// src/service/mobileAuthService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "segredo-super-seguro";

async function login(email, senha) {
  // 1) Validação básica
  if (!email || !senha) {
    const err = new Error("Email e senha são obrigatórios.");
    err.status = 400;
    throw err;
  }

  console.log("LOGIN SERVICE - email recebido:", email, "senha:", senha);

  // 2) Buscar usuário no banco
  const usuario = await prisma.usuarios.findUnique({
    where: { email },
    // se quiser ver tudo: tira o "select"
    // select: { id_usuario: true, email: true, senha_hash: true, senha: true, tipo_usuario: true, id_empresa: true }
  });

  console.log("LOGIN SERVICE - usuário encontrado:", usuario);

  if (!usuario) {
    const err = new Error("Credenciais inválidas.");
    err.status = 401;
    throw err;
  }

  // 3) Validar senha
  let senhaOk = false;

  // Se existir senha_hash, tenta bcrypt
  if (usuario.senha_hash) {
    console.log("LOGIN SERVICE - validando com bcrypt (senha_hash)");
    senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
  }

  // Se não passou no hash, e existir um campo senha em texto, tenta comparar direto
  if (!senhaOk && usuario.senha) {
    console.log("LOGIN SERVICE - validando com senha em texto puro");
    senhaOk = senha === usuario.senha;
  }

  if (!senhaOk) {
    const err = new Error("Credenciais inválidas.");
    err.status = 401;
    throw err;
  }

  // 4) Montar payload do token
  const payload = {
    id: usuario.id_usuario,
    email: usuario.email,
    tipoUsuario: usuario.tipo_usuario,
    idEmpresa: usuario.id_empresa
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  return { token, id: usuario.id_usuario };
}

module.exports = { login };
