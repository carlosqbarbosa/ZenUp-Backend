// src/controllers/mobileAuthController.js
const mobileAuthService = require('../service/mobileAuthService');

async function login(req, res) {
  try {
    console.log('LOGIN MOBILE - BODY:', req.body);

    const { email, senha } = req.body; // nomes que vêm do app

    const resultado = await mobileAuthService.login(email, senha);

    // resultado = { token, id }
    return res.json(resultado);

  } catch (error) {
    console.error('ERRO NO LOGIN MOBILE:', error);

    const status = error.statusCode || 500;
    const message =
      status === 500
        ? 'Erro interno do servidor'
        : error.message;

    return res.status(status).json({ message });
  }
}

module.exports = {
  login
};
