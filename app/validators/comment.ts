import vine from '@vinejs/vine'
/**
 * Validates comment creation action
 */
export const setCommentValidator = vine.compile(
    vine.object({
        comment: vine.string().trim().minLength(4).maxLength(200),
        score: vine.number().min(1).max(10)
    })
)