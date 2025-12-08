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

  // 2) Buscar usuário no banco pelo e-mail
  const usuario = await prisma.usuarios.findUnique({
    where: { email },
    select: {
      id_usuario: true,
      email: true,
      senha_hash: true,
      tipo_usuario: true,
      id_empresa: true,
      empresas: {
        select: {
          id_empresa: true,
          dominio_email: true,
        },
      },
    },
  });

  if (!usuario) {
    const err = new Error("Credenciais inválidas.");
    err.status = 401;
    throw err;
  }

  // 3) Validar senha (assumindo que 'senha_hash' está com bcrypt)
  const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);

  if (!senhaOk) {
    const err = new Error("Credenciais inválidas.");
    err.status = 401;
    throw err;
  }

  // 4) Montar payload do token (coloca o que você quiser carregar)
  const payload = {
    id: usuario.id_usuario,
    email: usuario.email,
    tipoUsuario: usuario.tipo_usuario,
    idEmpresa: usuario.id_empresa,
    dominioEmail: usuario.empresas?.dominio_email,
  };

  // 5) Gerar token JWT
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  // 6) Retornar o formato que o mobile espera
  return { token, id: usuario.id_usuario };
}

module.exports = { login };
