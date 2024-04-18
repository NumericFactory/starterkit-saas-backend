import vine from '@vinejs/vine'
import { uniqueRule } from './rules/unique.js'

/**
 * Validates user creation action
 */
export const createUserValidator = vine.compile(
    vine.object({
        firstname: vine.string().trim().minLength(2).maxLength(20),
        lastname: vine.string().trim().minLength(2).maxLength(20),
        phone: vine.string().trim().minLength(8).maxLength(20),
        email: vine.string().trim().email().use(uniqueRule({ table: 'users', column: 'email' })),
        password: vine.string().trim().minLength(8).maxLength(20),
    })
)
/**
 * Validates user update action
 */
export const updateUserValidator = vine.compile(
    vine.object({
        firstname: vine.string().trim().minLength(2).maxLength(20),
        lastname: vine.string().trim().minLength(2).maxLength(20),
        phone: vine.string().trim().minLength(8).maxLength(20),
        email: vine.string().trim().email().use(uniqueRule({ table: 'users', column: 'email' }))
    })
)

