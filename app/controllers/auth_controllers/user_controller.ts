import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { updateUserValidator } from '../../validators/register_user.js'
import { AuthService } from '#services/auth_service'

@inject()
export default class UserController {

    constructor() { }

    /**
     * route: GET api/v1/me
     * role: user
     */
    async show({ auth, response }: HttpContext) {
        // 1 get auth user
        const user = auth.getUserOrFail()
        if (!user) {
            return response.status(404).send({ message: 'Aucun utilisateur trouvé!' })
        }
        // 2 load auth user roles
        await user.load('roles')
        // 3 send response
        return response.status(200).send({
            data: AuthService.getSafeUserData(user)
        })
    }

    /**
     * route: PUT api/v1/me
     * role: user
     */
    async update({ auth, request, response }: HttpContext) {
        const user = auth.getUserOrFail()
        if (!user) {
            return response.status(404).send({ message: 'Aucun utilisateur trouvé!' })
        }
        // validate request
        const payload = await request.validateUsing(updateUserValidator)
        // 1 create user
        user.merge(payload)
        await user.save()
        return response.status(200).send({
            message: 'Données utilisateur mises à jour!',
            data: AuthService.getSafeUserData(user)
        })
    }


}
