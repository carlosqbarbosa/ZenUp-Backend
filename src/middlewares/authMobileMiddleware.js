// src/middlewares/authMobileMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "segredo-super-seguro";

function authMobile(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token mal formatado." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Aqui a gente padroniza:
    // tudo que estiver no payload do token vai para req.user
    //
    // No mobileAuthService, o payload é algo assim:
    // { id, email, tipoUsuario, idEmpresa, dominioEmail }
    req.user = decoded;

    return next();
  } catch (error) {
    console.error("ERRO NA VALIDAÇÃO DO TOKEN:", error);
    return res.status(401).json({ message: "Token inválido." });
  }
}

module.exports = authMobile;
