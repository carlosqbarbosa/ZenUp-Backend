// src/controllers/mobileRegistroController.js
const answerService = require('../service/answerService');

const registrarDiario = async (req, res) => {
  try {

    console.log('Body recebido em /register-mobile:', req.body);
    console.log('Usuário autenticado em req.user:', req.user);

    const { humor, energia, estresse } = req.body;
    const userId = req.user?.id || req.user?.id_usuario; // ajuste conforme o payload do token
    
    if (!userId) {
      return res.status(400).json({ mensagem: 'Não foi possível identificar o usuário a partir do token'});
    };

    if (
      typeof humor === 'undefined' ||
      typeof energia === 'undefined' ||
      typeof estresse === 'undefined'
    ) {
      return res.status(400).json({
        mensagem: 'Campos humor, energia e estresse são obrigatórios',
      });
    }

    const novaResposta = await answerService.createResposta(
      {
        humor,
        energia,
        estresse,
      },
      userId
    );

    console.log('Resposta criada:', novaResposta)

    return res.status(201).json({
      id: novaResposta.id_resposta,
      mensagem: 'Registro diário salvo com sucesso',
      dataRegistro: novaResposta.data_resposta,
    });
  } catch (error) {
    console.error('Erro ao registrar diário (mobile):', error);
    return res.status(500).json({
      mensagem: 'Erro interno do servidor ao registrar o diário',
    });
  }
};

module.exports = {
  registrarDiario,
};
