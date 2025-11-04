const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function validateRange( value, min, max, fieldname) {
    if (typeof value !== 'number' || value < min || value > max) {
        throw new Error(`VALIDATION_FIELD: O campo ${fieldname} deve ser um número entre ${min} e ${max}.`);
    }
}

const answerService = {
    async createResposta(answerData, userId) {
        const { humor, energia, estresse, resumo } = answerData;

        validateRange(humor, 0, 5, 'humor');
        validateRange(energia, 0, 4, 'energia');
        validateRange(estresse, 0, 4, 'estresse');

        try {
            const newResposta = await prisma.respostas.create({
                data: {
                    humor: humor,
                    energia: energia,
                    estresse: estresse,
                    resumo: resumo,
                    id_usuario: userId,
                },
            });

            return newResposta;

        } catch (error) {
            console.error("Erro no Service ao criar resposta:", error);
            throw new Error('Falha ao registrar a resposta no banco de dados.');
        }
    },
    
    // Futuras funções de leitura de respostas (ex: getRespostasByUserId)
};

module.exports = answerService;
