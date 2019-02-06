const jwt = require('jsonwebtoken');

/**
 * Verificar token
 */
const verifyToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.TOKEN_SEED , (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error
            })
        }
        req.user = decoded.user;
    });
    next();
};

module.exports = {
    verifyToken
};