/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router.get('/health', () => {
  return { status: 'ok', service: 'mymeal-api' }
})

const AuthController = () => import('#controllers/auth_controller')

const CookProfilesController = () => import('#controllers/cook_profiles_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('register', [AuthController, 'register'])
        router.post('login', [AuthController, 'login'])

        // Protected Route
        router.post('logout', [AuthController, 'logout']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/', [CookProfilesController, 'store'])
        router.patch('/', [CookProfilesController, 'update'])
      })
      .prefix('cook-profiles')
      .use([middleware.auth(), middleware.role('cook')])

    const MealPlansController = () => import('#controllers/meal_plans_controller')

    router
      .group(() => {
        router.get('/', [MealPlansController, 'index'])
        router.post('/', [MealPlansController, 'store'])
        router.patch('/:id', [MealPlansController, 'update'])
      })
      .prefix('meal-plans')
      .use([middleware.auth(), middleware.role('cook')])

    const DiscoversController = () => import('#controllers/discovers_controller')

    router
      .group(() => {
        router.get('/cooks', [DiscoversController, 'index'])
        router.get('/cooks/:id', [DiscoversController, 'show'])
      })
      .prefix('discover')
      .use([middleware.auth(), middleware.role('consumer')])

    const SubscriptionsController = () => import('#controllers/subscriptions_controller')

    router
      .group(() => {
        router.get('/', [SubscriptionsController, 'index'])
        router.get('/:id', [SubscriptionsController, 'show'])
        router.post('/', [SubscriptionsController, 'store'])
        router.patch('/:id', [SubscriptionsController, 'update'])
        router.patch('/:id/status', [SubscriptionsController, 'updateStatus'])
      })
      .prefix('subscriptions')
      .use([middleware.auth(), middleware.role('consumer')])

    const OrdersController = () => import('#controllers/orders_controller')
    const OrderNotesController = () => import('#controllers/order_notes_controller')

    router
      .group(() => {
        router.get('/cook', [OrdersController, 'indexForCook']).use(middleware.role('cook'))
        router.get('/consumer', [OrdersController, 'indexForConsumer']).use(middleware.role('consumer'))
        router.patch('/:id/status', [OrdersController, 'updateStatus']).use(middleware.role('cook'))
        
        router.get('/:id/notes', [OrderNotesController, 'index'])
        router.post('/:id/notes', [OrderNotesController, 'store'])
      })
      .prefix('orders')
      .use(middleware.auth())

    const PaymentsController = () => import('#controllers/payments_controller')

    router
      .group(() => {
        router.post('/', [PaymentsController, 'store']).use(middleware.role('consumer'))
        router.get('/subscription/:id', [PaymentsController, 'index']).use(middleware.role('consumer'))
        router.get('/wallet', [PaymentsController, 'walletStatus']).use(middleware.role('cook'))
        router.post('/payout', [PaymentsController, 'payout']).use(middleware.role('cook'))
      })
      .prefix('payments')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
