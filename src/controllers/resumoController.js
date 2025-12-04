// src/controllers/mobileResumoController.js
const resumoService = require('../service/resumoService');

async function obterResumo(req, res) {
  try {
    const { id_usuario } = req.params;

    const userIdToken = req.user.id;

    console.log('Resumo -> req.params.id_usuario:', id_usuario);
    console.log('Resumo -> usuário autenticado:', req.user);

    if (Number(id_usuario) !== Number(userIdToken)) {
      return res.status(403).json({
        erro: 'Você não tem permissão para ver o resumo de outro usuário.',
      });
    }

    const resumo = await resumoService.getResumoUsuario(id_usuario);

    return res.status(200).json(resumo);
  } catch (error) {
    console.error('Erro ao obter resumo (mobile):', error);
    return res
      .status(500)
      .json({ erro: 'Erro ao obter resumo dos registros diários.' });
  }
}

module.exports = {
  obterResumo,
};
