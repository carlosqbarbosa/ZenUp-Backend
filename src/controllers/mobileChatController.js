
async function chat(req, res) {
  try {
    console.log('CHAT MOBILE - BODY:', req.body);

    // Pegando campos do body (ajuste os nomes se no mobile for diferente)
    const { id, texto } = req.body;

    if (!id || !texto) {
      return res.status(400).json({ message: 'id e texto são obrigatórios.' });
    }

    // Por enquanto vamos só devolver um mock:
    const resposta = `Echo: ${texto}`;

    return res.json({
      mensagem: resposta
    });

  } catch (error) {
    console.error('ERRO NO CHAT MOBILE:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

module.exports = {
  chat
};
