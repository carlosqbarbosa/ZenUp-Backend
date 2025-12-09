const userService = require("../service/userService");

const userController = {
  async createUser(req, res) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: newUser,
      });
    } catch (error) {
      console.error("Erro ao criar usuário: ", error);
      if (error.message === "Este e-mail já está em uso.") {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários: ", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const user = await userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário: ", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const updatedUser = await userService.updateUser(userId, req.body);
      res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário: ", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      await userService.deleteUser(userId);
      res.status(200).json({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar usuário: ", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async getEmpresaPorUsuario(req, res) {
    try {
      const { id } = req.params;

      const usuario = await prisma.usuarios.findUnique({
        where: { id_usuario: Number(id) },
        include: { 
          empresas: true 
        },
      });

      if (!usuario) {
        console.log('Usuário não encontrado');
        return res.status(404).json({ 
          erro: "Usuário não encontrado" 
        });
      }
      if (!usuario.id_empresa) {
        console.log('Usuário não possui empresa associada');
        return res.status(404).json({ 
          erro: "Usuário não possui empresa associada" 
        });
      }

      const response = {
        id_usuario: usuario.id_usuario,
        nome_funcionario: usuario.nome_funcionario,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
        id_empresa: usuario.id_empresa,
        empresa: usuario.empresas || usuario.empresa || null
      };

      return res.status(200).json(response);
      
    } catch (error) {
      console.error("Erro ao buscar empresa do usuário:", error);
      console.error("Stack trace:", error.stack);
      
      res.status(500).json({ 
        erro: "Erro interno do servidor.",
        mensagem: error.message,
        detalhes: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  async getEmpresaPorUsuario(req, res) {
  try {
    const { id } = req.params;
    const usuarioSemRelacao = await prisma.usuarios.findUnique({
      where: { id_usuario: Number(id) }
    });
    
    let usuario;
    try {
      usuario = await prisma.usuarios.findUnique({
        where: { id_usuario: Number(id) },
        include: { empresas: true }
      });
    } catch (e1) {
      try {
        usuario = await prisma.usuarios.findUnique({
          where: { id_usuario: Number(id) },
          include: { empresa: true }
        });
      } catch (e2) {
        throw new Error('Relação não encontrada no schema Prisma');
      }
    }
    
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    return res.status(200).json({
      id_usuario: usuario.id_usuario,
      id_empresa: usuario.id_empresa,
      empresa: usuario.empresas || usuario.empresa
    });
    
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ 
      erro: error.message,
      stack: error.stack
    });
  }
}
};

module.exports = {
  createUser: userController.createUser,
  getAllUsers: userController.getAllUsers,
  getUserById: userController.getUserById,
  updateUser: userController.updateUser,
  deleteUser: userController.deleteUser,
  getEmpresaPorUsuario: userController.getEmpresaPorUsuario
};