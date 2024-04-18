import vine from '@vinejs/vine'

/**
 * Validates email for forgot password action
 */
export const forgotPasswordValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
    })
)

export const newPasswordValidator = vine.compile(
    vine.object({
        password: vine.string().trim().minLength(8).maxLength(20)
    })
)