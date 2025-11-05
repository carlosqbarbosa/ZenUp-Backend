const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkCompanyAccess = async (req, res, next ) => {
    const id_empresa_param= req.params.id;
    const usuarioLogadoId = req.user.id;
    
    if (!id_empresa_param || isNaN(parseInt(id_empresa_param))) {
        return res.status(400).json({ message: 'ID da empresa inválido ou não fornecido.' }); 
    };

    try {
        const empresaUsuario = await prisma.usuarios.findUnique({
            where: {
                id_usuario: usuarioLogadoId
            },
            select: {
                id_empresa: true
            }
        });

        const idEmpresaNumeric = parseInt(id_empresa_param);

        if (!empresaUsuario || empresaUsuario.id_empresa !== idEmpresaNumeric) {
            return res.status(403).json({ 
                message: 'Acesso negado. Você não tem permissão para visualizar os dados desta empresa.' 
            });
        }
        next();
    } catch (error) {
        console.error('Erro no resourceAuthMiddleware:', error.message);
        next(error);
    }
}

module.exports = checkCompanyAccess;