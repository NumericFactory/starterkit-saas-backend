import vine from '@vinejs/vine'

/**
 * Validates user creation action
 */
export const loginUserValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        password: vine.string().trim().minLength(8).maxLength(20),
    })
)