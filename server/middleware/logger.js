function logger(req, res, next) {
    const time = new Date().toLocaleString();
    console.log(`${req.method} Request made to ${req.originalUrl} at ${time}`);
    next();
}

module.exports = logger