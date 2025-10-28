const authService = require('../service/authService');

login = async (req, res) => {
  try {
    const {email, senha} = req.body;
    const result = await authService.login({email, senha});
    return res.status(200).json({
      message: 'Login realizado com sucesso',
      token: result.token,
      user: result.user,
    });
  }catch ( error ) {
    console.error('Erro ao tentar logar:', error.message);
    if (error.message === 'AUTH_INVALID') {
      return res.status(401).json({ message: 'Email ou senha inválidos'});
    };

    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  login,
};