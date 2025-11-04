const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const answerService = {
    async createResposta(answerData, userId) {
        const { humor, energia, estresse, resumo } = answerData;
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
