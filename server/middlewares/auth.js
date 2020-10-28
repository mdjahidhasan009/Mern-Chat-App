const jwt = require("jwt-then");

//Token verification
module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) throw "Forbidden!!";
        const token = req.headers.authorization.split(" ")[1]; //Token structure "Bearer token"
        const payload = await jwt.verify(token, process.env.SECRET);
        req.payload = payload;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Forbidden 🚫🚫🚫",
        });
    }
};
