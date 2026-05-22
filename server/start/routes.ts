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


router
  .group(() => {
    // Browse kitchens & reviews without logging in (marketing + discovery).
    router.get('/discover/cooks', [controllers.Discovers, 'index'])
    router.get('/discover/cooks/:id', [controllers.Discovers, 'show'])
    router.get('/reviews/cook/:id', [controllers.Reviews, 'index'])

    router
      .group(() => {
        router.post('register', [controllers.Auth, 'register'])
        router.post('login', [controllers.Auth, 'login'])

        // Protected Route
        router.post('logout', [controllers.Auth, 'logout']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
        router.patch('/profile', [controllers.Profile, 'update'])
        router.patch('/profile/password', [controllers.Profile, 'updatePassword'])
        router.post('/profile/deactivate', [controllers.Profile, 'deactivate'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/', [controllers.CookProfiles, 'store'])
        router.patch('/', [controllers.CookProfiles, 'update'])
      })
      .prefix('cook-profiles')
      .use([middleware.auth(), middleware.role('cook')])


    router
      .group(() => {
        router.get('/', [controllers.MealPlans, 'index'])
        router.post('/', [controllers.MealPlans, 'store'])
        router.patch('/:id', [controllers.MealPlans, 'update'])
        router.delete('/:id', [controllers.MealPlans, 'destroy'])
      })
      .prefix('meal-plans')
      .use([middleware.auth(), middleware.role('cook')])


    router
      .group(() => {
        router.get('/', [controllers.Subscriptions, 'index'])
        router.get('/:id', [controllers.Subscriptions, 'show'])
        router.post('/', [controllers.Subscriptions, 'store'])
        router.patch('/:id', [controllers.Subscriptions, 'update'])
        router.patch('/:id/status', [controllers.Subscriptions, 'updateStatus'])
      })
      .prefix('subscriptions')
      .use([middleware.auth(), middleware.role('consumer')])


    router
      .group(() => {
        router.get('/cook', [controllers.Orders, 'indexForCook']).use(middleware.role('cook'))
        router.get('/consumer', [controllers.Orders, 'indexForConsumer']).use(middleware.role('consumer'))
        router.patch('/:id/status', [controllers.Orders, 'updateStatus']).use(middleware.role('cook'))
        
        router.get('/:id/notes', [controllers.OrderNotes, 'index'])
        router.post('/:id/notes', [controllers.OrderNotes, 'store'])
      })
      .prefix('orders')
      .use(middleware.auth())


    router
      .group(() => {
        router.post('/', [controllers.Payments, 'store']).use(middleware.role('consumer'))
        router.get('/subscription/:id', [controllers.Payments, 'index']).use(middleware.role('consumer'))
        router.get('/wallet/status', [controllers.Payments, 'walletStatus']).as('wallet.status')
        router.post('/payout', [controllers.Payments, 'payout']).as('payout')
      })
      .prefix('payments')
      .use(middleware.auth())


    router
      .group(() => {
        router.post('/', [controllers.Reviews, 'store']).as('reviews.store')
      })
      .prefix('reviews')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
