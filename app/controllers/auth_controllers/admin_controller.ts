import { createUserValidator } from '#validators/register_user'
import type { HttpContext } from '@adonisjs/core/http'
// models
import User from '#models/user'
// services
import mail from '@adonisjs/mail/services/main'
import { AuthService, SafeUserModelType } from '#services/auth_service'
// validators
import { setRolesValidator } from '#validators/set_role'

export default class AdminController {


    /**
     * Route: GET api/v1/admin/users
     * Role : Admin
     */
    async getUsers({ auth, response }: HttpContext) {
        const me = auth.user?.id;
        const users = await (await User.query().preload('roles').orderBy('createdAt', 'desc'))
        if (!users || users.length === 0)
            return response.status(404).send({ message: 'Aucun utilisateur!' })
        const safeUsers: SafeUserModelType[] = users.map((user: any) => AuthService.getSafeUserData(user))
        const safeUsersWithoutMe: SafeUserModelType[] = safeUsers.filter((user: SafeUserModelType) => user.id != me)
        return response.status(200).send(safeUsersWithoutMe)
    }

    /**
     * Route: POST api/v1/admin/users
     * Role : PowerAdmin
     */
    async registerUser({ request, response }: HttpContext) {
        // validate request
        const payload = await request.validateUsing(createUserValidator)
        // 1 create user
        const user = await User.create(payload)
        // 2 generate validation token
        const token = await User.accessTokens.create(user, ['auth:reset-password'], { expiresIn: '24h', name: 'reset-password' })
        if (!token || !token?.value)
            return response.status(500).send({ message: 'Erreur. Réessayer plus tard.' })
        const url = AuthService.buildAuthLink('reset-password', user.email, token.value.release(), token?.identifier?.toString())
        // 3 send email with account validation link
        const emailSent
            = await mail.send((message) => {
                message
                    .from('contact@airskill.fr')
                    .to(user.email)
                    .subject(`${user.firstname}, votre compte a été créé avec succès`)
                    .html(`<strong>Hello ${user.firstname},<br><br>
                    Votre compte est bien crée.</strong>,<br>
                    Vous devez maintenant cliquer sur <a href="${url}">ce lien<a/> pour créer votre mot de passe personnalisé.<br><br>
                    <a href="${url}">${url}<a/> <br><br>
                    <em><strong>Attention:</strong> Ce lien est valable pour 24h.</em>`)
            })
        // 4 send response
        if (emailSent?.messageId) {
            response.status(201).send({ message: 'Inscription réussie. Un email vient d\'être envoyé à l\'utilisateur.' })
        }
    }

    /**
     * Route: PUT api/v1/admin/users/:id
     * Role : PowerAdmin
     */
    async updateUser({ request, response }: HttpContext) {
        // validate request
        const { firstname, lastname, email } = await request.validateUsing(createUserValidator)
        // 1 find user
        const user = await User.find(request.param('id'))
        if (!user) return response.status(404).send({ message: 'Utilisateur introuvable' })
        // 2 update user
        user.firstname = firstname
        user.lastname = lastname
        user.email = email
        await user.save()
        // 3 send response
        response.status(200).send({ message: 'Utilisateur mis à jour' })
    }

    /**
     * Route: DELETE api/v1/admin/users/:id
     * Role : PowerAdmin
     */
    async deleteUser({ params, response }: HttpContext) {
        // 1 find user
        const user = await User.find(params.id)
        if (!user) return response.status(404).send({ message: 'Utilisateur introuvable' })
        // 2 delete user
        await user.delete()
        // 3 send response
        response.status(200).send({ message: 'Utilisateur supprimé' })
    }

    /**
     * Route: POST api/v1/users/:id/roles
     * Role : PowerAdmin
     */
    async setRole({ request, response }: HttpContext) {
        // validate request
        const { roles_ids, user_id } = await request.validateUsing(setRolesValidator)
        // 1 find user
        const user = await User.find(user_id)
        if (!user) return response.status(404).send({ message: 'Utilisateur introuvable' })
        // 2 update roles
        await user.related('roles').sync([...roles_ids])
        // 3 send response
        response.status(200).send({ message: 'Rôle utilisateur mis à jour' })
    }


}