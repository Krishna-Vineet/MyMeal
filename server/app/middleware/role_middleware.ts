import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { guards?: string[] } | string[] | string) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({ message: 'Unauthorized' })
    }

    // Support both .use(middleware.role('cook')) and .use(middleware.role(['admin', 'cook']))
    let allowedRoles: string[] = []
    
    if (typeof options === 'string') {
      allowedRoles = [options]
    } else if (Array.isArray(options)) {
      allowedRoles = options
    } else if (options && typeof options === 'object' && options.guards) {
      allowedRoles = options.guards
    }

    if (allowedRoles.length > 0 && !(allowedRoles as unknown as string[]).includes(user.role)) {
      return ctx.response.forbidden({ message: 'Forbidden: You do not have the required role.' })
    }

    return await next()
  }
}