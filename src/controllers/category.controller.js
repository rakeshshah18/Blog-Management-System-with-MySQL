const { dbConnection } = require('../config/db');

// Create new category
const addCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const query = "INSERT INTO categories (name) VALUES (?)";
        await dbConnection.query(query, [name]);

        res.status(201).json({
            status: "Success",
            message: "Category added successfully."
        });
    } catch (error) {
        console.error("🚨 Category Creation Error:", error);
        res.status(500).json({
            status: "Error",
            message: "Failed to add category."
        });
    }
};


//Get blogs by category
const getBlogsByCategory = async (req, res) => {
    const { category_id } = req.params;
    const query = `
        SELECT blogs.*, categories.name AS category_name 
        FROM blogs 
        INNER JOIN categories ON blogs.category_id = categories.id 
        WHERE blogs.category_id = ?`;

    try {
        const [blogs] = await dbConnection.query(query, [category_id]);
        res.status(200).json({
            status: "Success",
            data: blogs
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Failed to fetch blogs by category."
        });
    }
};


module.exports = {addCategory, getBlogsByCategory };