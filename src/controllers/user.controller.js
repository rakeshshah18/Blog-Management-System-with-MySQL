const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const { dbConnection } = require('../config/db');
const generateToken  = require('../middlewares/jwtToken')

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
        // **Check if email already exists**
        const [existingUser] = await dbConnection.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({
                status: "Error",
                message: "Email is already registered. Please use another email."
            });
        }
        const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        const [result] = await dbConnection.query(query, [name, email, hashedPassword, role]); // Store result

        if (result.affectedRows === 0) {
            return res.status(500).json({
                status: "Error",
                message: "Failed to register user."
            });
        }

        const userId = result.insertId;  // Extract inserted ID
        const fetchQuery = "SELECT id, name, email, role FROM users WHERE id = ?";
        const [data] = await dbConnection.query(fetchQuery, [userId]);

        res.status(201).json({
            status: "Success",
            message: 'User Registered successfully',
            data: data[0]  // Return single user object
        });
    } catch (error) {
        console.error("User Registration Error:", error);
        res.status(500).json({
            status: "Error",
            message: "Error in Registering User",
            error: error.message
        });
    }
};


// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "Error",
            message: "Email and password required"
        });
    }

    try {
        // Fetch user by email
        const [rows] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ 
                status: "Error",
                message: "Invalid credentials" 
            });
        }

        const user = rows[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ 
                status: "Error",
                message: "Invalid credentials" 
            });
        }

        // Generate token
        const token = generateToken(user);

        res.status(200).json({ 
            status: "Success",
            message: "Login successful",
            token: token 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ 
            status: "Error",
            message: "Error logging in", 
            error: error.message 
        });
    }
};



// View Profile
const showProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                status: "Error",
                message: "Unauthorized access. Please login."
            });
        }

        const userId = req.user.id;
        const query = "SELECT name, email, role, id FROM users WHERE id = ?";
        const [user] = await dbConnection.query(query, [userId]);

        if (!user.length) {
            return res.status(404).json({
                status: "Error",
                message: "User not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Profile fetched successfully",
            data: user[0]
        });
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({
            status: "Error",
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};





module.exports = { register, login, showProfile };