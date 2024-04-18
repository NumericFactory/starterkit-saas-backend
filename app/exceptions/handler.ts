import app from '@adonisjs/core/services/app'
import { errors as authErrors } from '@adonisjs/auth'
import { HttpContext, ExceptionHandler, errors as httpErrors } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { SimpleErrorReporter, errors as vineErrors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction
  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {

    /**
     * handle custom credentials user error 400
     */
    if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
      return ctx
        .response
        .status(error.status)
        .send({
          message: "Email ou mot de passe invalide."
          // error.getResponseMessage(error, ctx) 
        })
    }

    /**
     * handle custom credentials user error 422 Email Unique
     */
    if (error instanceof vineErrors.E_VALIDATION_ERROR && error.messages[0].rule === 'unique' && error.messages[0].field === 'email') {
      return ctx
        .response
        .status(error.status)
        .send({
          message: "Email déjà utilisé."
          // error.getResponseMessage(error, ctx) 
        })
    }


    /**
     * http exception error 401
     */
    if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
      return ctx
        .response.unauthorized({
          status: error.status,
          path: ctx.request.url(),
          timestamp: DateTime.local(),
          code: 'E_UNAUTHORIZED_ACCESS',
          message: error.message,
          detail: 'Ensure you are logged in.'
        })

    }

    /**
     * http exception error 403
     */
    if (error instanceof httpErrors.E_HTTP_EXCEPTION && authErrors.E_UNAUTHORIZED_ACCESS) {
      return ctx
        .response.forbidden({
          status: error.status,
          path: ctx.request.url(),
          timestamp: DateTime.local(),
          code: 'E_FORBIDDEN',
          message: error.message,
          detail: 'Ensure you have the right permissions.'
        })
    }

    /**
     * http exception error 404 E_ROUTE_NOT_FOUND
     */
    if (error instanceof httpErrors.E_ROUTE_NOT_FOUND) {
      return ctx
        .response.notFound({
          status: error.status,
          path: ctx.request.url(),
          timestamp: DateTime.local(),
          code: 'E_ROUTE_NOT_FOUND',
          message: error.message,
          detail: 'Ensure the route is correct and the controller exists.'
        })
    }

    /**
     * http exception error 404 E_RESOURCE_NOT_FOUND
     */
    if ((error instanceof httpErrors.E_HTTP_EXCEPTION && error.status === 404)
      || error instanceof httpErrors.E_HTTP_EXCEPTION && error.code === 'E_ROW_NOT_FOUND') {
      return ctx
        .response.notFound({
          status: error.status,
          path: ctx.request.url(),
          timestamp: DateTime.local(),
          code: 'E_RESOURCE_NOT_FOUND',
          message: error.message,
          detail: 'Ensure the resource exists and that you have the right permissions.'
        })
    }

    /**
     * http exception error 500
     */
    return ctx
      .response
      .status(500)
      .send({
        message: "Server Error."
      })

    // only for development mode
    // return super.handle(error, ctx)
  }



  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: any, ctx: HttpContext) {
    if (this.shouldReport(error) && app.inDev) {
      console.error("error report : ", error)
      return
    }
    if (!this.shouldReport(error) || !app.inProduction) {
      return
    }
    ctx.logger.error(error)
  }


}
