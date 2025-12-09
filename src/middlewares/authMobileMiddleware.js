const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "segredo-super-seguro";

function authMobile(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id;

    return next();
  } catch (error) {
    console.error("ERRO NA VALIDAÇÃO DO TOKEN:", error);
    return res.status(401).json({ message: "Token inválido." });
  }
};

module.exports = authMobile;
