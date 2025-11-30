const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'uma_chave_secreta_muito_forte_e_aleatoria';

const authService = {
    async login({ email, senha }) {
        const emailParts = email.split('@');
        if (emailParts.length !== 2) {
            console.log('Formato de email inválido');
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
                id_empresa: true,
                empresas: {
                    select: {
                        id_empresa: true,
                        dominio_email: true
                    }
                }
            },
        });

        if (!usuario) {
            console.log('Usuário não encontrado');
            throw new Error('AUTH_INVALID'); 
        }

        const isPasswordValid = await bcrypt.compare(senha, usuario.senha_hash);

        if (!isPasswordValid) {
            console.log('Senha incorreta');
            throw new Error('AUTH_INVALID'); 
        }

        if (usuario.empresa && usuario.empresa.dominio_email) {
            const dominioEsperado = usuario.empresa.dominio_email.toLowerCase();
            console.log(' Validando domínio. Esperado:', dominioEsperado, 'Fornecido:', dominioFornecido);

            if (dominioEsperado !== dominioFornecido) {
                console.log('Domínio não corresponde');
                throw new Error('Domínio de email inválido para esta organização.');
            }
        } else {
            console.log('Usuário sem empresa vinculada, pulando validação de domínio');
        }

        const payload = {
            id: usuario.id_usuario,
            tipo_usuario: usuario.tipo_usuario
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { senha_hash, ...userWithoutHash } = usuario;

        return { token, user: userWithoutHash };
    },
};

module.exports = authService;