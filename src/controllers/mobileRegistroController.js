const mobileRegistroService = require('../service/mobileRegistroService');

async function registrarDiario(req, res) {
  try {
    const usuarioId = req.usuarioId; // vem do token via middleware
    const { humor, energia, estresse } = req.body;

    const resposta = await mobileRegistroService.registrarDiario({
      id_usuario: usuarioId,
      humor,
      energia,
      estresse
    });

    return res.json(resposta);

  } catch (err) {
    console.error("ERRO NO REGISTRO DIÁRIO:", err);
    return res.status(err.status || 500).json({ message: err.message });
  }
}

module.exports = { registrarDiario };
