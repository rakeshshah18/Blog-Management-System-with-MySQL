const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbConnection } = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!['Customer', 'Agent'].includes(role)) {
        return res.status(400).json({
            status: "Error",
            message: 'Invalid role, Role should be Agent OR Customer.'
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        await dbConnection.query(query, [name, email, hashedPassword, role]);
        res.status(201).json({
            status: "Success",
            message: 'User Registered successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Error in Registering User"
        })
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    try {
        //  get user
        const [rows] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [email]);
        
        
        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "24h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};


module.exports = { register, login };