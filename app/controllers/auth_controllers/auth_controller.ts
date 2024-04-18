import type { HttpContext } from '@adonisjs/core/http'
// models
import User from '../../models/user.js'
// validators
import { loginUserValidator } from '../../validators/login_user.js'
import { createUserValidator } from '../../validators/register_user.js'
import { forgotPasswordValidator, newPasswordValidator } from '../../validators/forgot_password.js'
// services
import mail from '@adonisjs/mail/services/main'
import { Secret } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'
import { AuthService } from '#services/auth_service'

export default class AuthController {

    /**
     * route : POST /api/v1/auth/register
     * role : register a new user
     * @param createUserValidator
     * @returns response
     */
    async register({ request, response }: HttpContext) {
        // validate request
        const payload = await request.validateUsing(createUserValidator)
        // 1 create user
        const user = await User.create(payload)
        // 2 generate validation token
        const token = await User.accessTokens.create(user, ['auth:validate-account'], { expiresIn: '1h', name: 'validate-account' })
        if (!token || !token?.value)
            return response.status(500).send({ message: 'Erreur. Réessayer plus tard.' })
        const url = AuthService.buildAuthLink('validate-account', user.email, token.value.release(), token?.identifier?.toString())
        // 3 send email with account validation link
        const emailSent = await mail.send((message) => {
            message
                .from('contact@airskill.fr')
                .to(user.email)
                .subject('Validez votre compte utilisateur')
                .html(`<strong>Hello ${user.firstname} !  <br><br>
                    Votre compte est bien crée.</strong>,<br>
                    veuillez cliquer sur le <a href="${url}">lien de validation<a/> pour valider votre compte : <br><br>
                    <a href="${url}">${url}<a/> <br><br>
                    <em><strong>Attention:</strong> ce lien est valable pour une heure.</em>`)
        })
        // 4 send response
        if (emailSent?.messageId) {
            response.status(201).send({ message: 'Inscription réussie! RDV dans votre boîte Email pour valider votre compte.' })
        }
    }

    /**
     * route : GET /api/v1/auth/validate-account
     * role : validate account
     * @querystring token&email
     */
    async validateAccount({ request, response }: HttpContext) {
        // get data from querystring
        const { token, email, tokenId } = request.qs()
        // 1 find user by email
        const user = await User.findBy('email', email)
        if (!user)
            return response.status(400).send({ message: 'Cet utilisateur n\'existe pas.' })
        // 2 verify token
        const foundToken = await User.accessTokens.find(user, tokenId)
        const tokenObj = await User.accessTokens.verify(new Secret(token))
        if (!foundToken || !tokenObj || tokenObj?.name !== 'validate-account' || foundToken?.lastUsedAt || tokenObj?.isExpired())
            return response.status(400).send({ message: 'Lien de réinitialisation mot de passe non-valide ou expiré.' })
        // 3 update validated_at
        user.validatedAt = DateTime.now()
        await user.save()
        // 4 update roles
        await user.related('roles').sync([1])
        await User.accessTokens.delete(user, tokenId)
        // 5 send response
        response.status(200).send({ message: 'Votre compte utilisateur est bien validé!' })
    }

    /**
     * route : POST /api/v1/auth/login
     * role : login a user
     * @param loginUserValidator
     * @returns response
     */
    async login({ request, response }: HttpContext) {
        // validate request
        const { email, password } = await request.validateUsing(loginUserValidator)
        // 1 Verify credentials
        const user = await User.verifyCredentials(email, password)
        await user?.load('roles')
        // 2 Generate token
        const token = await User.accessTokens.create(user)
        // 3 Send response
        response.status(200).send({
            message: 'Vous êtes connecté(e)!',
            token: { oat: token?.value?.release(), expiresAt: token?.expiresAt, lastUsedAt: token?.lastUsedAt },
            user: { id: user.id, firstname: user.firstname, lastname: user.lastname, phone: user.phone, email: user.email, roles: user.roles.map((role) => role.id) }
        })
    }

    /**
     * route : POST /api/v1/auth/remember-password
     * role : send an email to reset password
     * @param forgotPasswordValidator
     * @returns response
     */
    async rememberPassword({ request, response }: HttpContext) {
        // validate request
        const { email } = await request.validateUsing(forgotPasswordValidator)
        // 1 find user by email
        let user = await User.findBy('email', email)
        if (!user || !user?.password === null || user?.password === '') {
            return response.status(400).send({ message: 'L\'utilisateur n\'existe pas ou n\'a pas de mot de passe.' })
        }
        // 2 generate token
        const token = await User.accessTokens.create(user, ['auth:reset-password'], { expiresIn: '1h', name: 'reset-password' })
        if (!token || !token?.value) {
            return response.status(500).send({ message: 'il y a eu une erreur. Réessayer plus tard.' })
        }
        const url = AuthService.buildAuthLink('reset-password', email, token.value.release(), token?.identifier?.toString())
        // 3 send email
        const emailSent = await mail.send((message) => {
            message
                .from('contact@airskill.fr')
                .to(email)
                .subject('Modification de mot de passe')
                .html(`<strong>Hello</strong>,<br><br>veuillez cliquer <a href="${url}">ici<a/> pour redéfinir votre mot de passe.`)
        })
        // 4 send response
        if (emailSent?.messageId) {
            response.status(200).send({ message: 'un email vous a été envoyé!' })
        }
    }

    /**
     * route : POST /api/v1/auth/reset-password
     * role : reset password
     * @querystring token&email
     * @returns response
     */
    async resetPassword({ request, response }: HttpContext) {
        // validate request
        const { password } = await request.validateUsing(newPasswordValidator)
        // get data from querystring
        const { token, email, tokenId } = request.qs()
        // 1 find user by email
        const user = await User.findBy('email', email)
        if (!user)
            return response.status(400).send({ message: 'Cet utilisateur n\'existe pas.' })
        // 2 verify token
        const foundToken = await User.accessTokens.find(user, tokenId)
        const tokenObj = await User.accessTokens.verify(new Secret(token))
        if (!tokenObj || tokenObj?.name !== 'reset-password' || foundToken?.lastUsedAt || tokenObj?.isExpired())
            return response.status(400).send({ message: 'Lien de réinitialisation mot de passe non-valide ou expiré.' })
        // 3 update password
        user.password = password
        await user.save()
        await User.accessTokens.delete(user, tokenId)
        // 4 send response
        response.status(200).send({ message: 'Mot de passe mis à jour!' })
    }

    /**
     * route : POST /api/v1/auth/logout
     * role : logout user
     * @returns response
     */
    async logout({ auth, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const token = auth.user?.currentAccessToken.identifier
        if (!token)
            return response.status(400).send({ message: 'Token introuvable' })
        await User.accessTokens.delete(user, token)
        return response.status(200).send({ message: 'Vous êtes bien déconnecté(e)' })
    }

}
