const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Instância para interagir com o DB
const bcrypt = require('bcrypt'); // Para comparação de senha (segurança)
const jwt = require('jsonwebtoken'); // Para geração de tokens JWT

const JWT_SECRET = process.env.JWT_SECRET || 'uma_chave_secreta_muito_forte_e_aleatoria';

// 3. Objeto Auth Service
const authService = {
    async login({ email, senha }) {
        const emailParts = email.split('@');
        if (emailParts.length !== 2) {
            throw new Error('AUTH_INVALID'); 
        }
        
        const dominioFornecido = emailParts[1].toLowerCase();

        const usuario = await prisma.usuarios.findUnique({
            where: { email },
            select: {
                id_usuario: true,
                nome_funcionario: true,
                email: true,
                senha_hash: true,
                tipo_usuario: true,
                empresa: {
                    select: {dominio_email: true}
                }
            },
        });

        if (!usuario) {
            throw new Error('AUTH_INVALID'); 
        }

        const dominioEsperado = usuario.empresa.dominio_email.toLowerCase();
        if (dominioEsperado !== dominioFornecido) {
            throw new Error('Domínio de email inválido para esta organização.');
        }

        const isPasswordValid = await bcrypt.compare(senha, usuario.senha_hash);

        if (!isPasswordValid) {
            throw new Error('AUTH_INVALID'); 
        }

        const payload = {
            id: usuario.id_usuario,
            tipo_usuario: usuario.tipo_usuario
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' } // O token expira em 1 hora
        );

        const { senha_hash, ...userWithoutHash } = usuario;

        return { token, user: userWithoutHash };
    },
};

module.exports = authService;