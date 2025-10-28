const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. token não fornecido' });
    }

    if (!JWT_SECRET) {
        console.error("JWT_SECRET não definido. Verifique seu arquivo .env.");
        return res.status(500).json({ message: 'Erro interno: Chave de segurança não configurada.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            tipo_usuario: decoded.tipo_usuario
        };
        next();
    } catch (error) {
        console.error ("Erro na varificação do JWT: ", error.message);
        return res.status(401).json({ message: 'Token de autenticação inválido ou expirado.' });
        }
};
module.exports = authMiddleware;
