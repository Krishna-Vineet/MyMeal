import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.auth.register': { paramsTuple?: []; params?: {} }
    'auth.auth.login': { paramsTuple?: []; params?: {} }
    'auth.auth.logout': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'cook_profiles.store': { paramsTuple?: []; params?: {} }
    'cook_profiles.update': { paramsTuple?: []; params?: {} }
    'meal_plans.index': { paramsTuple?: []; params?: {} }
    'meal_plans.store': { paramsTuple?: []; params?: {} }
    'meal_plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discovers.index': { paramsTuple?: []; params?: {} }
    'discovers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subscriptions.index': { paramsTuple?: []; params?: {} }
    'subscriptions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subscriptions.store': { paramsTuple?: []; params?: {} }
    'subscriptions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subscriptions.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.index_for_cook': { paramsTuple?: []; params?: {} }
    'orders.index_for_consumer': { paramsTuple?: []; params?: {} }
    'orders.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'order_notes.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'order_notes.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.store': { paramsTuple?: []; params?: {} }
    'payments.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet.status': { paramsTuple?: []; params?: {} }
    'payout': { paramsTuple?: []; params?: {} }
    'reviews.store': { paramsTuple?: []; params?: {} }
    'reviews.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'meal_plans.index': { paramsTuple?: []; params?: {} }
    'discovers.index': { paramsTuple?: []; params?: {} }
    'discovers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subscriptions.index': { paramsTuple?: []; params?: {} }
    'subscriptions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.index_for_cook': { paramsTuple?: []; params?: {} }
    'orders.index_for_consumer': { paramsTuple?: []; params?: {} }
    'order_notes.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet.status': { paramsTuple?: []; params?: {} }
    'reviews.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'meal_plans.index': { paramsTuple?: []; params?: {} }
    'discovers.index': { paramsTuple?: []; params?: {} }
    'discovers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subscriptions.index': { paramsTuple?: []; params?: {} }
    'subscriptions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.index_for_cook': { paramsTuple?: []; params?: {} }
    'orders.index_for_consumer': { paramsTuple?: []; params?: {} }
    'order_notes.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet.status': { paramsTuple?: []; params?: {} }
    'reviews.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.auth.register': { paramsTuple?: []; params?: {} }
    'auth.auth.login': { paramsTuple?: []; params?: {} }
    'auth.auth.logout': { paramsTuple?: []; params?: {} }
    'cook_profiles.store': { paramsTuple?: []; params?: {} }
    'meal_plans.store': { paramsTuple?: []; params?: {} }
    'subscriptions.store': { paramsTuple?: []; params?: {} }
    'order_notes.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.store': { paramsTuple?: []; params?: {} }
    'payout': { paramsTuple?: []; params?: {} }
    'reviews.store': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'cook_profiles.update': { paramsTuple?: []; params?: {} }
    'meal_plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subscriptions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subscriptions.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}