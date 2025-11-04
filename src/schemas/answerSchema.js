const z = require('zod');

const createAnswerSchema = z.object({
    humor: z.number({
        invalid_type_error: 'O humor deve ser um número inteiro.',
    })

    .int('O humor deve ser um número inteiro.')
    .min(indicadorMin, `O humor deve ser no mínimo ${INDICATOR_MIN}.`)
    .max(INDICATOR_MAX, `O humor deve ser no máximo ${INDICATOR_MAX}.`)

    energia: z.number({
        invalid_type_error: 'A energia deve ser um número inteiro.',
    })

    .int('A energia deve ser um número inteiro.')
    .min(INDICATOR_MIN, `A energia deve ser no mínimo ${INDICATOR_MIN}.`)
    .max(INDICATOR_MAX, `A energia deve ser no máximo ${INDICATOR_MAX}.`),
})