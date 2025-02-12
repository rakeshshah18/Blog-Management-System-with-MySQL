const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');  // Make sure to destructure JWT_SECRET

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: "Error",
                message: "No token provided or invalid format"
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Use the same secret key that was used to generate the token
        const decoded = jwt.verify(token, JWT_SECRET || 'secret-key');  // Match the secret used in generateToken

        console.log("Decoded Token:", decoded);

        if (!decoded.id) {
            return res.status(403).json({
                status: "Error",
                message: "User ID missing in token"
            });
        }

        req.user = decoded;
        console.log("User from token:", req.user);
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({
            status: "Error",
            message: "Invalid token",
            details: error.message
        });
    }
};

module.exports = verifyToken;
