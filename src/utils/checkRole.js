const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: "Error",
                message: "Unauthorized access. Please log in."
            });
        }

        if (req.user.role !== role) {
            return res.status(403).json({
                status: "Error",
                message: `Access denied. Only ${role}s are allowed.`
            });
        }

        next();
    };
};

module.exports = checkRole;
