import { errors, type HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export enum Role {
  user = 1,
  admin = 2,
  poweradmin = 3
}

/**
 * Check if user is authorized to access a route with his roles
 * @param routeAccessRoles
 * @param userRoles
 * @returns boolean or throw an HTTP exception error 403
 */
async function isUserAuthorized(routeAccessRoles: number[], userRoles: number[]): Promise<boolean> {
  console.log('ROUTE ACCESS ROLES:', routeAccessRoles)
  console.log('USER ROLES:', userRoles)
  const isAuthorized = userRoles.some(v => routeAccessRoles.includes(v));
  console.log('IS AUTHORIZED:', isAuthorized)
  if (!isAuthorized) {
    throw new errors.E_HTTP_EXCEPTION('Access denied', { code: 'Unauthorized', status: 403 })
  }
  return isAuthorized
}

export default class AuthorizeMiddleware {

  async handle(ctx: HttpContext, next: NextFn, options: { guards?: Role[] | number[] } = {}) {
    // get user roles
    const user = ctx.auth.user
    await user?.load('roles')
    const userRoles = user?.roles?.map((role: any) => role.id) || []
    // if user hasn't the required role, throw an error
    await isUserAuthorized(options.guards || [], userRoles)
    return next()
  }

}