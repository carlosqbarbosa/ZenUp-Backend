// src/middlewares/authMobileMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo-super-seguro';

function authMobile(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token mal formatado.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Exemplo: anexar id do usuário na requisição
    req.usuarioId = decoded.id;

    return next();
  } catch (error) {
    console.error('ERRO NA VALIDAÇÃO DO TOKEN:', error);
    return res.status(401).json({ message: 'Token inválido.' });
  }
}

module.exports = authMobile;
