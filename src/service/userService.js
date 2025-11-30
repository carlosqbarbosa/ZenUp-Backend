const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const userService = {
  async createUser(userData) {
    try {

      // 1. Gerar hash da senha
      const hashedPassword = await bcrypt.hash(userData.senha, SALT_ROUNDS);

      // 2. Extrair e limpar domínio do email
      let dominio = userData.dominio;
      
      // Remove @ do início se existir
      if (dominio && dominio.startsWith('@')) {
        dominio = dominio.substring(1);
      }
      
      // Se não foi fornecido, extrai do email
      if (!dominio && userData.email.includes('@')) {
        dominio = userData.email.split('@')[1];
      }

      // 3. Verificar se já existe empresa com esse domínio
      let empresaCriada = null;

      if (dominio) {
        // Busca empresa existente
        empresaCriada = await prisma.empresas.findFirst({
          where: { dominio_email: dominio }
        });

        // Se não existe, cria uma nova
        if (!empresaCriada) {
          console.log('Criando nova empresa com domínio:', dominio);
          
          // Gera um nome padrão baseado no domínio
          const nomeEmpresa = dominio.split('.')[0].charAt(0).toUpperCase() + 
                             dominio.split('.')[0].slice(1);
          
          empresaCriada = await prisma.empresas.create({
            data: { 
              dominio_email: dominio,
              nome_empresa: nomeEmpresa 
            }
          });
        } else {
          console.log('Empresa já existe:', empresaCriada.id_empresa);
        }
      }

      // 4. Criar usuário vinculado à empresa
      const newUser = await prisma.usuarios.create({
        data: {
          nome_funcionario: userData.nome,
          email: userData.email,
          senha_hash: hashedPassword,
          id_empresa: empresaCriada ? empresaCriada.id_empresa : null,
          tipo_usuario: userData.tipo_usuario || "colaborador"
        }
      });

      return newUser;

    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Este e-mail já está em uso.');
      }
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      const usuario = await prisma.usuarios.findUnique({
        where: { email },
        include: {
          empresas: true 
        }
      });
      
      return usuario;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  },

  async authenticateUser(email, senha) {
    try {
      const usuario = await prisma.usuarios.findUnique({
        where: { email },
        include: {
          empresas: true
        }
      });

      if (!usuario) {
        return { success: false, message: 'Usuário não encontrado' };
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      
      if (!senhaValida) {
        return { success: false, message: 'Senha incorreta' };
      }
      const { senha_hash, ...usuarioSemSenha } = usuario;

      return {
        success: true,
        usuario: usuarioSemSenha
      };

    } catch (error) {
      console.error(' Erro na autenticação:', error);
      throw error;
    }
  },

  async getAllUsers() {
    return prisma.usuarios.findMany();
  },

  async getUserById(id_user) {
    return prisma.usuarios.findUnique({
      where: { id_user }
    });
  },

  async updateUser(id_user, updateData) {
    if (updateData.senha) {
      updateData.senha_hash = await bcrypt.hash(updateData.senha, SALT_ROUNDS);
      delete updateData.senha;
    }

    return prisma.usuarios.update({
      where: { id_user },
      data: updateData
    });
  },

  async deleteUser(id_user) {
    return prisma.usuarios.delete({
      where: { id_user }
    });
  }
};

module.exports = userService;