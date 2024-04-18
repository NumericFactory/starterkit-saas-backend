import vine from '@vinejs/vine'

/**
 * Validates user creation action
 */
export const setRolesValidator = vine.compile(
    vine.object({
        roles_ids: vine.array(vine.number().min(0).max(3)),
        user_id: vine.number(),
    })
)