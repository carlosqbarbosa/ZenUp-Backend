
const userService = require('../service/userService');


const userController = {
  async createUser(req, res) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json({
        message: 'Usuário criado com sucesso!',
        user: newUser
      });
    }catch (error) {
      console.error('Erro ao criar usuário: ', error);
      if (error.message === 'Este e-mail já está em uso.') {
        return res.status(409).json({ message: error.message});
      }
      return res.status(500).json({message: 'Error interno do servidor.'});
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    }catch (error) {
      console.error('Erro ao buscar usuários: ', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  },

  async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.'});
      }
      return res.status(200).json(user);
    }catch(error) {
      console.error('Erro ao buscar usuário: ', error);
      res.status(500).json({ message: 'Erro interno do servidor.'});
    }
  },

  async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const updatedUser = await userService.updateUser(userId, req.body);
      res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: updatedUser});
    } catch (error) {
      console.error('Erro ao atualizar usuário: ', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      await userService.deleteUser(userId);
      res.status(200).json ({ message: 'Usuário deletado com sucesso!'});
    } catch (error) {
      console.error('Erro ao deletar usuário: ', error);
      res.status(500).json({ message: 'Erro interno do servidor.'});
    }
  }
};

module.exports = {
  createUser: userController.createUser,
  getAllUsers: userController.getAllUsers,
  getUserById: userController.getUserById,
  updateUser: userController.updateUser,
  deleteUser: userController.deleteUser
}
