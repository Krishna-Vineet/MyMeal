/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.auth.register': {
    methods: ["POST"],
    pattern: '/api/v1/auth/register',
    tokens: [{"old":"/api/v1/auth/register","type":0,"val":"api","end":""},{"old":"/api/v1/auth/register","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/register","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.auth.register']['types'],
  },
  'auth.auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.auth.login']['types'],
  },
  'auth.auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.auth.logout']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'cook_profiles.store': {
    methods: ["POST"],
    pattern: '/api/v1/cook-profiles',
    tokens: [{"old":"/api/v1/cook-profiles","type":0,"val":"api","end":""},{"old":"/api/v1/cook-profiles","type":0,"val":"v1","end":""},{"old":"/api/v1/cook-profiles","type":0,"val":"cook-profiles","end":""}],
    types: placeholder as Registry['cook_profiles.store']['types'],
  },
  'cook_profiles.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/cook-profiles',
    tokens: [{"old":"/api/v1/cook-profiles","type":0,"val":"api","end":""},{"old":"/api/v1/cook-profiles","type":0,"val":"v1","end":""},{"old":"/api/v1/cook-profiles","type":0,"val":"cook-profiles","end":""}],
    types: placeholder as Registry['cook_profiles.update']['types'],
  },
  'meal_plans.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/meal-plans',
    tokens: [{"old":"/api/v1/meal-plans","type":0,"val":"api","end":""},{"old":"/api/v1/meal-plans","type":0,"val":"v1","end":""},{"old":"/api/v1/meal-plans","type":0,"val":"meal-plans","end":""}],
    types: placeholder as Registry['meal_plans.index']['types'],
  },
  'meal_plans.store': {
    methods: ["POST"],
    pattern: '/api/v1/meal-plans',
    tokens: [{"old":"/api/v1/meal-plans","type":0,"val":"api","end":""},{"old":"/api/v1/meal-plans","type":0,"val":"v1","end":""},{"old":"/api/v1/meal-plans","type":0,"val":"meal-plans","end":""}],
    types: placeholder as Registry['meal_plans.store']['types'],
  },
  'meal_plans.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/meal-plans/:id',
    tokens: [{"old":"/api/v1/meal-plans/:id","type":0,"val":"api","end":""},{"old":"/api/v1/meal-plans/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/meal-plans/:id","type":0,"val":"meal-plans","end":""},{"old":"/api/v1/meal-plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['meal_plans.update']['types'],
  },
  'discovers.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/discover/cooks',
    tokens: [{"old":"/api/v1/discover/cooks","type":0,"val":"api","end":""},{"old":"/api/v1/discover/cooks","type":0,"val":"v1","end":""},{"old":"/api/v1/discover/cooks","type":0,"val":"discover","end":""},{"old":"/api/v1/discover/cooks","type":0,"val":"cooks","end":""}],
    types: placeholder as Registry['discovers.index']['types'],
  },
  'discovers.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/discover/cooks/:id',
    tokens: [{"old":"/api/v1/discover/cooks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/discover/cooks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/discover/cooks/:id","type":0,"val":"discover","end":""},{"old":"/api/v1/discover/cooks/:id","type":0,"val":"cooks","end":""},{"old":"/api/v1/discover/cooks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['discovers.show']['types'],
  },
  'subscriptions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/subscriptions',
    tokens: [{"old":"/api/v1/subscriptions","type":0,"val":"api","end":""},{"old":"/api/v1/subscriptions","type":0,"val":"v1","end":""},{"old":"/api/v1/subscriptions","type":0,"val":"subscriptions","end":""}],
    types: placeholder as Registry['subscriptions.index']['types'],
  },
  'subscriptions.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/subscriptions/:id',
    tokens: [{"old":"/api/v1/subscriptions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/subscriptions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/subscriptions/:id","type":0,"val":"subscriptions","end":""},{"old":"/api/v1/subscriptions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['subscriptions.show']['types'],
  },
  'subscriptions.store': {
    methods: ["POST"],
    pattern: '/api/v1/subscriptions',
    tokens: [{"old":"/api/v1/subscriptions","type":0,"val":"api","end":""},{"old":"/api/v1/subscriptions","type":0,"val":"v1","end":""},{"old":"/api/v1/subscriptions","type":0,"val":"subscriptions","end":""}],
    types: placeholder as Registry['subscriptions.store']['types'],
  },
  'subscriptions.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/subscriptions/:id',
    tokens: [{"old":"/api/v1/subscriptions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/subscriptions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/subscriptions/:id","type":0,"val":"subscriptions","end":""},{"old":"/api/v1/subscriptions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['subscriptions.update']['types'],
  },
  'subscriptions.update_status': {
    methods: ["PATCH"],
    pattern: '/api/v1/subscriptions/:id/status',
    tokens: [{"old":"/api/v1/subscriptions/:id/status","type":0,"val":"api","end":""},{"old":"/api/v1/subscriptions/:id/status","type":0,"val":"v1","end":""},{"old":"/api/v1/subscriptions/:id/status","type":0,"val":"subscriptions","end":""},{"old":"/api/v1/subscriptions/:id/status","type":1,"val":"id","end":""},{"old":"/api/v1/subscriptions/:id/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['subscriptions.update_status']['types'],
  },
  'orders.index_for_cook': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/orders/cook',
    tokens: [{"old":"/api/v1/orders/cook","type":0,"val":"api","end":""},{"old":"/api/v1/orders/cook","type":0,"val":"v1","end":""},{"old":"/api/v1/orders/cook","type":0,"val":"orders","end":""},{"old":"/api/v1/orders/cook","type":0,"val":"cook","end":""}],
    types: placeholder as Registry['orders.index_for_cook']['types'],
  },
  'orders.index_for_consumer': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/orders/consumer',
    tokens: [{"old":"/api/v1/orders/consumer","type":0,"val":"api","end":""},{"old":"/api/v1/orders/consumer","type":0,"val":"v1","end":""},{"old":"/api/v1/orders/consumer","type":0,"val":"orders","end":""},{"old":"/api/v1/orders/consumer","type":0,"val":"consumer","end":""}],
    types: placeholder as Registry['orders.index_for_consumer']['types'],
  },
  'orders.update_status': {
    methods: ["PATCH"],
    pattern: '/api/v1/orders/:id/status',
    tokens: [{"old":"/api/v1/orders/:id/status","type":0,"val":"api","end":""},{"old":"/api/v1/orders/:id/status","type":0,"val":"v1","end":""},{"old":"/api/v1/orders/:id/status","type":0,"val":"orders","end":""},{"old":"/api/v1/orders/:id/status","type":1,"val":"id","end":""},{"old":"/api/v1/orders/:id/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['orders.update_status']['types'],
  },
  'order_notes.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/orders/:id/notes',
    tokens: [{"old":"/api/v1/orders/:id/notes","type":0,"val":"api","end":""},{"old":"/api/v1/orders/:id/notes","type":0,"val":"v1","end":""},{"old":"/api/v1/orders/:id/notes","type":0,"val":"orders","end":""},{"old":"/api/v1/orders/:id/notes","type":1,"val":"id","end":""},{"old":"/api/v1/orders/:id/notes","type":0,"val":"notes","end":""}],
    types: placeholder as Registry['order_notes.index']['types'],
  },
  'order_notes.store': {
    methods: ["POST"],
    pattern: '/api/v1/orders/:id/notes',
    tokens: [{"old":"/api/v1/orders/:id/notes","type":0,"val":"api","end":""},{"old":"/api/v1/orders/:id/notes","type":0,"val":"v1","end":""},{"old":"/api/v1/orders/:id/notes","type":0,"val":"orders","end":""},{"old":"/api/v1/orders/:id/notes","type":1,"val":"id","end":""},{"old":"/api/v1/orders/:id/notes","type":0,"val":"notes","end":""}],
    types: placeholder as Registry['order_notes.store']['types'],
  },
  'payments.store': {
    methods: ["POST"],
    pattern: '/api/v1/payments',
    tokens: [{"old":"/api/v1/payments","type":0,"val":"api","end":""},{"old":"/api/v1/payments","type":0,"val":"v1","end":""},{"old":"/api/v1/payments","type":0,"val":"payments","end":""}],
    types: placeholder as Registry['payments.store']['types'],
  },
  'payments.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/payments/subscription/:id',
    tokens: [{"old":"/api/v1/payments/subscription/:id","type":0,"val":"api","end":""},{"old":"/api/v1/payments/subscription/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/payments/subscription/:id","type":0,"val":"payments","end":""},{"old":"/api/v1/payments/subscription/:id","type":0,"val":"subscription","end":""},{"old":"/api/v1/payments/subscription/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['payments.index']['types'],
  },
  'wallet.status': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/payments/wallet/status',
    tokens: [{"old":"/api/v1/payments/wallet/status","type":0,"val":"api","end":""},{"old":"/api/v1/payments/wallet/status","type":0,"val":"v1","end":""},{"old":"/api/v1/payments/wallet/status","type":0,"val":"payments","end":""},{"old":"/api/v1/payments/wallet/status","type":0,"val":"wallet","end":""},{"old":"/api/v1/payments/wallet/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['wallet.status']['types'],
  },
  'payout': {
    methods: ["POST"],
    pattern: '/api/v1/payments/payout',
    tokens: [{"old":"/api/v1/payments/payout","type":0,"val":"api","end":""},{"old":"/api/v1/payments/payout","type":0,"val":"v1","end":""},{"old":"/api/v1/payments/payout","type":0,"val":"payments","end":""},{"old":"/api/v1/payments/payout","type":0,"val":"payout","end":""}],
    types: placeholder as Registry['payout']['types'],
  },
  'reviews.store': {
    methods: ["POST"],
    pattern: '/api/v1/reviews',
    tokens: [{"old":"/api/v1/reviews","type":0,"val":"api","end":""},{"old":"/api/v1/reviews","type":0,"val":"v1","end":""},{"old":"/api/v1/reviews","type":0,"val":"reviews","end":""}],
    types: placeholder as Registry['reviews.store']['types'],
  },
  'reviews.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/reviews/cook/:id',
    tokens: [{"old":"/api/v1/reviews/cook/:id","type":0,"val":"api","end":""},{"old":"/api/v1/reviews/cook/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/reviews/cook/:id","type":0,"val":"reviews","end":""},{"old":"/api/v1/reviews/cook/:id","type":0,"val":"cook","end":""},{"old":"/api/v1/reviews/cook/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['reviews.index']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
