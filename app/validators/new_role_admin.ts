import vine from '@vinejs/vine'

/**
 * Validates new role creation action from admin
 */
export const createRoleValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(2).maxLength(20)
    })
)