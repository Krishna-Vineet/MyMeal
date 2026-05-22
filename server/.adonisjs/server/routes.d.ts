import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'discovers.index': { paramsTuple?: []; params?: {} }
    'discovers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reviews.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.auth.register': { paramsTuple?: []; params?: {} }
    'auth.auth.login': { paramsTuple?: []; params?: {} }
    'auth.auth.logout': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'profile.profile.update_password': { paramsTuple?: []; params?: {} }
    'profile.profile.deactivate': { paramsTuple?: []; params?: {} }
    'cook_profiles.store': { paramsTuple?: []; params?: {} }
    'cook_profiles.update': { paramsTuple?: []; params?: {} }
    'meal_plans.index': { paramsTuple?: []; params?: {} }
    'meal_plans.store': { paramsTuple?: []; params?: {} }
    'meal_plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'meal_plans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
  }
  GET: {
    'discovers.index': { paramsTuple?: []; params?: {} }
    'discovers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reviews.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'meal_plans.index': { paramsTuple?: []; params?: {} }
    'subscriptions.index': { paramsTuple?: []; params?: {} }
    'subscriptions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.index_for_cook': { paramsTuple?: []; params?: {} }
    'orders.index_for_consumer': { paramsTuple?: []; params?: {} }
    'order_notes.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet.status': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'discovers.index': { paramsTuple?: []; params?: {} }
    'discovers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reviews.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'meal_plans.index': { paramsTuple?: []; params?: {} }
    'subscriptions.index': { paramsTuple?: []; params?: {} }
    'subscriptions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.index_for_cook': { paramsTuple?: []; params?: {} }
    'orders.index_for_consumer': { paramsTuple?: []; params?: {} }
    'order_notes.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet.status': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.auth.register': { paramsTuple?: []; params?: {} }
    'auth.auth.login': { paramsTuple?: []; params?: {} }
    'auth.auth.logout': { paramsTuple?: []; params?: {} }
    'profile.profile.deactivate': { paramsTuple?: []; params?: {} }
    'cook_profiles.store': { paramsTuple?: []; params?: {} }
    'meal_plans.store': { paramsTuple?: []; params?: {} }
    'subscriptions.store': { paramsTuple?: []; params?: {} }
    'order_notes.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payments.store': { paramsTuple?: []; params?: {} }
    'payout': { paramsTuple?: []; params?: {} }
    'reviews.store': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'profile.profile.update_password': { paramsTuple?: []; params?: {} }
    'cook_profiles.update': { paramsTuple?: []; params?: {} }
    'meal_plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subscriptions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subscriptions.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'meal_plans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}