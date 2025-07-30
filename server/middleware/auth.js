const jwt = require('jsonwebtoken')

function checkToken(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) res.status(401).json({error: "Token required for endpoint."});

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if (err) return res.status(403).json({error: "Invalid token."})
        req.user = user;
        next();
    })
}

module.exports = checkToken