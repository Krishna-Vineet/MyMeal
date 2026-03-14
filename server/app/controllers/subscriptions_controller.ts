import type { HttpContext } from '@adonisjs/core/http'
import Subscription from '#models/subscription'
import MealPlan from '#models/meal_plan'
import MealComponent from '#models/meal_component'
import OrderService from '#services/order_service'
import PaymentService from '#services/payment_service'
import db from '@adonisjs/lucid/services/db'
import { createSubscriptionValidator } from '#validators/subscription'
import { DateTime } from 'luxon'

export default class SubscriptionsController {

    /**
     * Helper to calculate end date and count valid days based on validityType
     */
    private calculateSubscriptionRange(startDate: DateTime, duration: string, validityType: string) {
        let endDate: DateTime
        
        switch (duration) {
            case 'one_time': endDate = startDate; break
            case '1_week': endDate = startDate.plus({ weeks: 1 }).minus({ days: 1 }); break
            case '2_week': endDate = startDate.plus({ weeks: 2 }).minus({ days: 1 }); break
            case '1_month': endDate = startDate.plus({ months: 1 }).minus({ days: 1 }); break
            case '3_month': endDate = startDate.plus({ months: 3 }).minus({ days: 1 }); break
            default: endDate = startDate.plus({ months: 1 }).minus({ days: 1 })
        }

        let validDays = 0
        let current = startDate

        while (current <= endDate) {
            const day = current.weekday // 1-7 (Mon-Sun)
            if (validityType === 'all_days') {
                validDays++
            } else if (validityType === 'weekdays' && day <= 5) {
                validDays++
            } else if (validityType === 'weekends' && day >= 6) {
                validDays++
            }
            current = current.plus({ days: 1 })
        }

        return { endDate, validDays }
    }

    /**
     * Subscribe a consumer to a meal plan
     */
    async store({ request, auth, response }: HttpContext) {
        const user = auth.user!
        const payload = await request.validateUsing(createSubscriptionValidator)

        // 1. Validate Meal Plan exists and is active
        const mealPlan = await MealPlan.query()
            .where('id', payload.mealPlanId)
            .where('isActive', true)
            .first()

        if (!mealPlan) return response.notFound({ message: 'Active meal plan not found' })

        // 2. Validate Pickup Slot
        const slot = await mealPlan.related('pickupSlots').query().where('id', payload.pickupSlotId).first()
        if (!slot) return response.badRequest({ message: 'Invalid pickup slot' })

        // 3. Calculation Logic
        const start = DateTime.fromISO(payload.startDate)
        const duration = payload.duration || '1_month'
        const { endDate, validDays } = this.calculateSubscriptionRange(start, duration, mealPlan.validityType)

        if (validDays === 0) {
            return response.badRequest({ message: 'No valid days found in the selected duration' })
        }

        // 4. Calculate Daily Extra Price from Components
        const componentIds = payload.components.map((c: any) => c.mealComponentId)
        const mealComponents = await MealComponent.query().whereIn('id', componentIds)

        let dailyExtraPrice = 0
        const subComponentsData = payload.components.map((item: any) => {
            const original = mealComponents.find((mc: MealComponent) => mc.id === item.mealComponentId)
            if (!original) throw new Error(`Component ${item.mealComponentId} not found`)

            let itemExtraPrice = 0
            if (original.isToggle) {
                if (item.enabled) itemExtraPrice = original.price || 0
            } else {
                const extraQty = item.quantity - (original.defaultQuantity || 0)
                if (extraQty > 0) itemExtraPrice = extraQty * (original.price || 0)
            }

            dailyExtraPrice += itemExtraPrice

            return {
                mealComponentId: item.mealComponentId,
                quantity: item.quantity,
                enabled: item.enabled ?? true,
                price: original.price
            }
        })

        const dailyTotal = Number(mealPlan.basePrice) + dailyExtraPrice
        const totalPrice = dailyTotal * validDays

        // 4.5. Verify Advance Payment (Minimum 10%)
        const minAdvance = 0.1 * totalPrice
        const advance = payload.advancePayment || 0
        if (advance < minAdvance) {
            return response.badRequest({ 
                message: `Minimum 10% advance (₹${minAdvance.toFixed(2)}) is required to confirm subscription.`,
                totalPrice,
                minAdvance
            })
        }

        // 5. Transaction
        const trx = await db.transaction()

        try {
            const subscription = new Subscription()
            subscription.userId = user.id
            subscription.mealPlanId = payload.mealPlanId
            subscription.pickupSlotId = payload.pickupSlotId
            subscription.startDate = start
            subscription.endDate = endDate
            subscription.duration = duration
            subscription.totalPrice = totalPrice.toString()
            subscription.status = 'active'
            subscription.amountPaid = advance.toString() 
            subscription.amountConsumed = '0'
            
            subscription.useTransaction(trx)
            await subscription.save()

            await subscription.related('subscribedMealComponents').createMany(subComponentsData)

            await trx.commit()

            await subscription.load('subscribedMealComponents')

            // Trigger Order Generation
            const orderService = new OrderService()
            await orderService.generateOrders(subscription)

            // Record Advance Payment if provided
            const ap = payload.advancePayment
            if (ap && ap > 0) {
                const paymentService = new PaymentService()
                await paymentService.processPayment({
                    userId: user.id,
                    subscriptionId: subscription.id,
                    amount: ap,
                    method: 'advance_payment',
                    type: 'advance'
                })
            }

            return response.created({
                message: 'Subscription confirmed!',
                totalPrice,
                validDays,
                dailyTotal,
                subscription
            })

        } catch (error) {
            await trx.rollback()
            return response.internalServerError({ message: 'Failed to create subscription', error: (error as Error).message })
        }
    }

    /**
     * Show detailed subscription
     */
    async show({ params, auth, response }: HttpContext) {
        const user = auth.user!
        const subscription = await Subscription.query()
            .where('id', params.id)
            .where('userId', user.id)
            .preload('mealPlan', (q) => q.preload('cook'))
            .preload('pickupSlot')
            .preload('subscribedMealComponents', (q) => q.preload('mealComponent'))
            .first()

        if (!subscription) return response.notFound({ message: 'Subscription not found' })

        // Calculate due
        const due = parseFloat(subscription.amountConsumed) - parseFloat(subscription.amountPaid)

        return response.ok({
            subscription,
            financials: {
                totalPrice: parseFloat(subscription.totalPrice),
                amountPaid: parseFloat(subscription.amountPaid),
                amountConsumed: parseFloat(subscription.amountConsumed),
                due: due
            }
        })
    }

    /**
     * Update subscription (Edit components/slot)
     */
    async update({ params, request, auth, response }: HttpContext) {
        const user = auth.user!
        const subscription = await Subscription.query()
            .where('id', params.id)
            .where('userId', user.id)
            .preload('mealPlan')
            .preload('subscribedMealComponents')
            .first()

        if (!subscription) return response.notFound({ message: 'Subscription not found' })

        const payload = await request.validateUsing(createSubscriptionValidator) // Reusing structure for edit

        const trx = await db.transaction()

        try {
            subscription.useTransaction(trx)

            // 1. Update Pickup Slot if changed
            if (payload.pickupSlotId) {
                subscription.pickupSlotId = payload.pickupSlotId
            }

            // 2. Update Components if provided
            if (payload.components) {
                // For MVP, we replace components (snapshot prices again)
                const componentIds = payload.components.map((c: any) => c.mealComponentId)
                const mealComponents = await MealComponent.query().whereIn('id', componentIds)

                // Delete old SubscribedMealComponents
                await db.from('subscribed_meal_components').where('subscription_id', subscription.id).delete().useTransaction(trx)

                const subComponentsData = payload.components.map((item: any) => {
                    const original = mealComponents.find((mc: MealComponent) => mc.id === item.mealComponentId)
                    if (!original) throw new Error(`Component ${item.mealComponentId} not found`)
                    return {
                        subscriptionId: subscription.id,
                        mealComponentId: item.mealComponentId,
                        quantity: item.quantity,
                        enabled: item.enabled ?? true,
                        price: original.price
                    }
                })

                await trx.table('subscribed_meal_components').insert(subComponentsData)
                
                // Trigger Order Refresh on Edit
                const orderService = new OrderService()
                await orderService.handleSubscriptionEdit(subscription)
            }

            await subscription.save()
            await trx.commit()

            return response.ok({ message: 'Subscription updated successfully', subscription })

        } catch (error) {
            await trx.rollback()
            return response.internalServerError({ message: 'Update failed', error: (error as Error).message })
        }
    }

    /**
     * List current user's subscriptions
     */
    async index({ auth, response }: HttpContext) {
        const user = auth.user!
        const subscriptions = await Subscription.query()
            .where('userId', user.id)
            .preload('mealPlan', (q) => q.preload('cook'))
            .preload('pickupSlot')
            .orderBy('createdAt', 'desc')

        return response.ok(subscriptions)
    }

    /**
     * Pause or Cancel subscription with financial checks
     */
    async updateStatus({ params, request, auth, response }: HttpContext) {
        const user = auth.user!
        const { status } = request.all()
        const subscription = await Subscription.query()
            .where('id', params.id)
            .where('userId', user.id)
            .first()

        if (!subscription) return response.notFound({ message: 'Subscription not found' })

        const due = parseFloat(subscription.amountConsumed) - parseFloat(subscription.amountPaid)

        if (status === 'cancelled' && due > 0) {
            return response.badRequest({ message: `Cannot cancel subscription with outstanding dues: ₹${due}. Please pay first.` })
        }

        subscription.status = status
        await subscription.save()

        // Trigger Order Lifecycle
        const orderService = new OrderService()
        if (status === 'paused') {
            await orderService.handleSubscriptionPause(subscription)
        } else if (status === 'active') {
            await orderService.handleSubscriptionResume(subscription)
        }

        return response.ok({ message: `Subscription ${status}`, subscription })
    }
}