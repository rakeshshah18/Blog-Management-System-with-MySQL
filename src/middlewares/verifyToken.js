const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Decoded Token:", decoded);

        if (!decoded.id) {
            return res.status(403).json({ status: "Error", message: "User ID missing in token." });
        }

        req.user = decoded;
        console.log("Author ID from token:", req.user.id); 
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};


module.exports = verifyToken;
