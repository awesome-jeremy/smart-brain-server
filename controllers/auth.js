const redisClient = require('./signin').redisClient;


//middleware to check if token in the redis
const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized!');
    }

    redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('Unauthorized!');
        }
    })
    next();
}

module.exports = {
    requireAuth
}