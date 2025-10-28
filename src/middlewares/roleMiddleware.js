const checkRole = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user.tipo_usuario;
        if (!userRole) {
            console.error("Tipo de usuário não encontrado no token.");
            return res.status(500).json({ message: 'Erro de autorização: Tipo de usuário não especificado.' });
        }
            if (userRole !== requiredRole) {
        return res.status(403).json({ 
            message: `Acesso negado. Você não tem a permissão necessária ('${requiredRole}').`
        });
    }
    next();
    };
}

module.exports = checkRole;