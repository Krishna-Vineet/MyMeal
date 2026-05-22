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

    // Convert everything to lowercase to avoid case-sensitivity issues
    const userRole = user.role?.toLowerCase()
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase())

    if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
      return ctx.response.forbidden({ 
        message: `Forbidden: You do not have the required role. Required: ${normalizedAllowedRoles.join(', ')}. Your role: ${userRole || 'none'}` 
      })
    }

    return await next()
  }
}