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
        router.post('/', [SubscriptionsController, 'store'])
        router.delete('/:id', [SubscriptionsController, 'destroy'])
      })
      .prefix('subscriptions')
      .use([middleware.auth(), middleware.role('consumer')])
  })
  .prefix('/api/v1')
