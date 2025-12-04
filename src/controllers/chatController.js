// src/controllers/chatController.js
// Exemplo: adaptador entre o app mobile e a SUA IA

// Se sua IA for um módulo local, algo assim:
// const iaService = require('../service/iaService');

// Se for uma API externa, você pode usar axios:
// const axios = require('axios');

const chatController = {
  chat: async (req, res) => {
    try {
      const { id, texto } = req.body;
      const userId = req.user?.id; // vindo do token (authMiddleware), se estiver usando

      if (!texto) {
        return res.status(400).json({
          mensagem: 'Campo "texto" é obrigatório',
        });
      }

      // 🔹 AQUI é onde você conecta a sua IA 🔹
      // EXEMPLO 1 – chamando um módulo da IA:
      //
      // const respostaIA = await iaService.gerarResposta({
      //   userId: userId ?? id,
      //   mensagem: texto,
      // });

      // EXEMPLO 2 – chamando uma API externa:
      //
      // const resposta = await axios.post('URL_DA_SUA_IA', {
      //   userId: userId ?? id,
      //   texto
      // });
      // const respostaIA = resposta.data.mensagem;

      // Por enquanto, vou deixar uma resposta mockada:
      const respostaIA =
        'Obrigado por compartilhar como você está se sentindo. ' +
        'Lembre-se de respeitar seus limites e, se precisar, procure apoio profissional.';

      // 🔹 O IMPORTANTE é devolver nesse formato:
      return res.status(200).json({
        mensagem: respostaIA, // <- bate com ChatResponse do app
      });
    } catch (error) {
      console.error('Erro no chat:', error);
      return res.status(500).json({
        mensagem: 'Erro interno ao processar o chat',
      });
    }
  },
};

module.exports = chatController;
