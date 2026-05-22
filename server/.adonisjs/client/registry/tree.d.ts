/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  discovers: {
    index: typeof routes['discovers.index']
    show: typeof routes['discovers.show']
  }
  reviews: {
    index: typeof routes['reviews.index']
    store: typeof routes['reviews.store']
  }
  auth: {
    auth: {
      register: typeof routes['auth.auth.register']
      login: typeof routes['auth.auth.login']
      logout: typeof routes['auth.auth.logout']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
      update: typeof routes['profile.profile.update']
      updatePassword: typeof routes['profile.profile.update_password']
      deactivate: typeof routes['profile.profile.deactivate']
    }
  }
  cookProfiles: {
    store: typeof routes['cook_profiles.store']
    update: typeof routes['cook_profiles.update']
  }
  mealPlans: {
    index: typeof routes['meal_plans.index']
    store: typeof routes['meal_plans.store']
    update: typeof routes['meal_plans.update']
    destroy: typeof routes['meal_plans.destroy']
  }
  subscriptions: {
    index: typeof routes['subscriptions.index']
    show: typeof routes['subscriptions.show']
    store: typeof routes['subscriptions.store']
    update: typeof routes['subscriptions.update']
    updateStatus: typeof routes['subscriptions.update_status']
  }
  orders: {
    indexForCook: typeof routes['orders.index_for_cook']
    indexForConsumer: typeof routes['orders.index_for_consumer']
    updateStatus: typeof routes['orders.update_status']
  }
  orderNotes: {
    index: typeof routes['order_notes.index']
    store: typeof routes['order_notes.store']
  }
  payments: {
    store: typeof routes['payments.store']
    index: typeof routes['payments.index']
  }
  wallet: {
    status: typeof routes['wallet.status']
  }
  payout: typeof routes['payout']
}
