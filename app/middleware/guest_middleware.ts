import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Guest middleware
 */
export default class GuestMiddleware {
    /**
     * The URL to redirect to, when authentication success
     */
    redirectTo = '/admin/'

    async handle(
        ctx: HttpContext,
        next: NextFn, options: {
            guards?: (keyof Authenticators)[]
        } = {}
    ) {
        for (let guard of options.guards || [ctx.auth.defaultGuard]) {
            if (await ctx.auth.use(guard).check()) {
                return ctx.response.redirect(this.redirectTo, true)
            }
        }
        return next()
    }
}