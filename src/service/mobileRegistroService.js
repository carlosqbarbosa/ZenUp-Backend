// src/service/mobileRegistroService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function registrarDiario({ id_usuario, humor, energia, estresse }) {

  if (!id_usuario) {
    const err = new Error("Usuário não encontrado. Faça login novamente.");
    err.status = 401;
    throw err;
  }

  const usuario = await prisma.usuarios.findUnique({
    where: { id_usuario }
  });

  if (!usuario) {
    const err = new Error("Usuário não encontrado. Faça login novamente.");
    err.status = 401;
    throw err;
  }

  await prisma.registrosDiarios.create({
    data: {
      id_usuario,
      humor,
      energia,
      estresse
    }
  });

  return { message: "Registro salvo com sucesso!" };
}

module.exports = { registrarDiario };
