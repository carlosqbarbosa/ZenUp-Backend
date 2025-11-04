const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const userService = {
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    try {
      const newUser = await prisma.usuarios.create({
        data: {
          nome: userData.nome,
          email: userData.email,
          senha_hash: hashedPassword,
          id_empresa: userData.id_empresa ? Number(userData.id_empresa):null,
        }
      });
      return newUser;
    } catch(error) {
      if (error.code === 'P2002') {
        throw new Error('Este e-mail já está em uso.');
      }
      throw error;
    }
  },

  async getAllUsers() {
    return prisma.usuarios.findMany();
  },

  async getUserById(id_user) {
    return await prisma.usuarios.findUnique({
      where: { id_user: id_user}
    });
  },


  async updateUser(id_user, updateData) {
    if (updateData.senha) {
      updateData.senha_hash = await bcrypt.hash(updateData.senha, SALT_ROUNDS);
      delete updateData.senha;
    }

    return prisma.usuarios.update ({
      where: {id_user: id_user},
      data: updateData
    });
  },

  async deleteUser(id_user) {
    return await prisma.usuarios.delete({
      where: {id_user: id_user}
    });
  }
};


module.exports = userService;