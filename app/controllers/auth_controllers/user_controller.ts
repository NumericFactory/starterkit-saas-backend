import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { updateUserValidator } from '../../validators/register_user.js'
import { AuthService } from '#services/auth_service'
import { setCommentValidator } from '#validators/comment'
import Comment from '#models/comment'
import { create } from 'domain'

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
        console.log(user);
        if (!user) {
            return response.status(404).send({ message: 'Aucun utilisateur trouvé!' })
        }
        // // 3. Charger les rôles de l'utilisateur
        // await user.load((preloader) => {
        //     preloader.load('roles')
        // })
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

    async getComments({ auth, request, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const movie_id = request.param('id')
        // 1 get comments
        const comments = await Comment.query().where('movie_id', Number(movie_id))
        return response.status(200).send({
            results: comments.map((comment) => ({
                id: comment.id,
                text: comment.comment,
                createdAt: comment.createdAt,
                movieId: comment.movie_id,
                userId: comment.user_id,
                username: AuthService.getSafeUserData(user).firstname + ' ' + AuthService.getSafeUserData(user).lastname?.charAt(0).toUpperCase()
            }))
        })
    }

    async postComment({ auth, request, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const { comment } = await request.validateUsing(setCommentValidator)
        const movie_id = request.param('id')
        const userId = user.id;
        const payload = {
            user_id: userId,
            movie_id: Number(movie_id),
            comment
        }
        // 2 store data
        const commentToSave = await Comment.create(payload)
        await commentToSave.save()
        return response.status(200).send({
            message: 'Commentaire ajouté',
            data: {
                id: commentToSave.id,
                text: commentToSave.comment,
                createdAt: commentToSave.createdAt,
                movieId: commentToSave.movie_id,
                userId: commentToSave.user_id,
                username: AuthService.getSafeUserData(user).firstname + ' ' + AuthService.getSafeUserData(user).lastname?.charAt(0).toUpperCase()
            }
        })
    }


}
