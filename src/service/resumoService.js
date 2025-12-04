// src/service/resumoService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function getResumoUsuario(userId) {
  const numericUserId = parseInt(userId, 10);

  if (Number.isNaN(numericUserId)) {
    throw new Error('ID de usuário inválido ao obter resumo');
  }

  // Busca, por exemplo, os últimos 7 registros do usuário
  const respostas = await prisma.respostas.findMany({
    where: { id_usuario: numericUserId },
    orderBy: { data_resposta: 'desc' },
  });

  if (!respostas.length) {
    return {
      totalRegistros: 0,
      mediaHumor: null,
      mediaEnergia: null,
      mediaEstresse: null,
      registros: [],
    };
  }

  const totalRegistros = respostas.length;

  const soma = respostas.reduce(
    (acc, r) => {
      acc.humor += r.humor;
      acc.energia += r.energia;
      acc.estresse += r.estresse;
      return acc;
    },
    { humor: 0, energia: 0, estresse: 0 }
  );

  const mediaHumor = soma.humor / totalRegistros;
  const mediaEnergia = soma.energia / totalRegistros;
  const mediaEstresse = soma.estresse / totalRegistros;

  return {
    totalRegistros,
    mediaHumor,
    mediaEnergia,
    mediaEstresse,
    registros: respostas,
  };
}

module.exports = {
  getResumoUsuario,
};
