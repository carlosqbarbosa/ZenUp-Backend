const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function validateRange(value, min, max, fieldname) {
  if (typeof value !== 'number' || value < min || value > max) {
    throw new Error(
      `VALIDATION_FIELD: O campo ${fieldname} deve ser um número entre ${min} e ${max}.`
    );
  }
}

const answerService = {
  async createResposta(answerData, userId) {
    const { humor, energia, estresse } = answerData;

    // validações básicas
    validateRange(humor, 0, 5, 'humor');
    validateRange(energia, 0, 5, 'energia');
    validateRange(estresse, 0, 5, 'estresse');

    try {
      const numericUserId = parseInt(userId, 10);
      console.log('createResposta -> userId', numericUserId);

      if (Number.isNaN(numericUserId)) {
        throw new Error('ID de usuário inválido ao criar resposta');
      }

      // Aqui ligamos a resposta ao usuário via campo id_usuario
      const newResposta = await prisma.respostas.create({
        data: {
          humor,
          energia,
          estresse,
          id_usuario: numericUserId,
        },
      });

      console.log('Resposta criada com sucesso', newResposta);
      return newResposta;
    } catch (error) {
      console.error('Erro no Service ao criar resposta:', error);
      throw new Error('Falha ao registrar a resposta no banco de dados.');
    }
  },

  // Futuras funções de leitura de respostas (ex: getRespostasByUserId)
};

module.exports = answerService;
