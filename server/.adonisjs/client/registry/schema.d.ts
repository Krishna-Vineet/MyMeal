/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.auth.register': {
    methods: ["POST"]
    pattern: '/api/v1/auth/register'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['register']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['register']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.auth.login': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.auth.logout': {
    methods: ["POST"]
    pattern: '/api/v1/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'cook_profiles.store': {
    methods: ["POST"]
    pattern: '/api/v1/cook-profiles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cook_profile').createCookProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/cook_profile').createCookProfileValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cook_profiles_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cook_profiles_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'cook_profiles.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/cook-profiles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cook_profile').updateCookProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/cook_profile').updateCookProfileValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cook_profiles_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cook_profiles_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'meal_plans.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/meal-plans'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/meal_plans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/meal_plans_controller').default['index']>>>
    }
  }
  'meal_plans.store': {
    methods: ["POST"]
    pattern: '/api/v1/meal-plans'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/meal_plan').createMealPlanValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/meal_plan').createMealPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/meal_plans_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/meal_plans_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'meal_plans.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/meal-plans/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/meal_plan').updateMealPlanValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/meal_plan').updateMealPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/meal_plans_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/meal_plans_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'discovers.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/discover/cooks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discovers_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discovers_controller').default['index']>>>
    }
  }
  'discovers.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/discover/cooks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discovers_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discovers_controller').default['show']>>>
    }
  }
  'subscriptions.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/subscriptions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subscriptions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subscriptions_controller').default['index']>>>
    }
  }
  'subscriptions.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/subscriptions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subscriptions_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subscriptions_controller').default['show']>>>
    }
  }
  'subscriptions.store': {
    methods: ["POST"]
    pattern: '/api/v1/subscriptions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/subscription').createSubscriptionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/subscription').createSubscriptionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subscriptions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subscriptions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'subscriptions.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/subscriptions/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/subscription').createSubscriptionValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/subscription').createSubscriptionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subscriptions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subscriptions_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'subscriptions.update_status': {
    methods: ["PATCH"]
    pattern: '/api/v1/subscriptions/:id/status'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subscriptions_controller').default['updateStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subscriptions_controller').default['updateStatus']>>>
    }
  }
  'orders.index_for_cook': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/orders/cook'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['indexForCook']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['indexForCook']>>>
    }
  }
  'orders.index_for_consumer': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/orders/consumer'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['indexForConsumer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['indexForConsumer']>>>
    }
  }
  'orders.update_status': {
    methods: ["PATCH"]
    pattern: '/api/v1/orders/:id/status'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['updateStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['updateStatus']>>>
    }
  }
  'order_notes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/orders/:id/notes'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_notes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_notes_controller').default['index']>>>
    }
  }
  'order_notes.store': {
    methods: ["POST"]
    pattern: '/api/v1/orders/:id/notes'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_notes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_notes_controller').default['store']>>>
    }
  }
  'payments.store': {
    methods: ["POST"]
    pattern: '/api/v1/payments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/payments_controller').default['store']>>>
    }
  }
  'payments.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/payments/subscription/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/payments_controller').default['index']>>>
    }
  }
  'wallet.status': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/payments/wallet/status'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payments_controller').default['walletStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/payments_controller').default['walletStatus']>>>
    }
  }
  'payout': {
    methods: ["POST"]
    pattern: '/api/v1/payments/payout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payments_controller').default['payout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/payments_controller').default['payout']>>>
    }
  }
  'reviews.store': {
    methods: ["POST"]
    pattern: '/api/v1/reviews'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/review').createReviewValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/review').createReviewValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reviews_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reviews_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'reviews.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/reviews/cook/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reviews_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reviews_controller').default['index']>>>
    }
  }
}
