function logger(req, res, next) {
    console.log(`${req.method} Request made to ${req.originalUrl} at ${Date.now()}`);
    next();
}

module.exports = logger