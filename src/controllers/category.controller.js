const { dbConnection } = require('../config/db');

// Create new category
const addCategory = async (req, res) => {
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ 
                status: "Error", 
                message: "Category name is required." 
            });
        }

        const query = "INSERT INTO categories (name) VALUES (?)";
        const [result] = await dbConnection.query(query, [name]);  // Store result

        if (result.affectedRows === 0) {
            return res.status(500).json({ 
                status: "Error", 
                message: "Failed to add category." 
            });
        }

        const categoryId = result.insertId;  // Extract inserted ID
        const fetchQuery = "SELECT * FROM categories WHERE id = ?";
        const [data] = await dbConnection.query(fetchQuery, [categoryId]);

        res.status(201).json({
            status: "Success",
            message: "Category added successfully.",
            data: data[0]  // Return single object 
        });
    } catch (error) {
        console.error("Category Creation Error:", error);
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
            message: "Blogs fetched successfully.",
            data: blogs
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Failed to fetch blogs by category."
        });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    try {
        console.log('Request Params:', req.params); // Debugging
        console.log('Request Body:', req.body); // Debugging

        const { id } = req.params;
        const { name } = req.body;

        // Validate id
        if (!id || isNaN(id)) {
            return res.status(400).json({ 
                status: "Error", 
                message: "Invalid category ID" 
            });
        }

        const categoryId = parseInt(id, 10);
        if (!name) {
            return res.status(400).json({ 
                status: "Error", 
                message: "Category name is required" 
            });
        }

        console.log('Updating category:', { categoryId, name });

        const updateQuery = "UPDATE categories SET name = ? WHERE id = ?";
        const [updateResult] = await dbConnection.query(updateQuery, [name, categoryId]);

        console.log('Update result:', updateResult);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ 
                status: "Error", 
                message: "Category not found or no changes made" 
            });
        }

        const selectQuery = "SELECT * FROM categories WHERE id = ?";
        const [categories] = await dbConnection.query(selectQuery, [categoryId]);

        console.log('Selected category:', categories);

        res.status(200).json({
            status: "Success",
            message: "Category updated successfully",
            data: categories[0]
        });
    } catch (error) {
        console.error("Category Update Error:", error);
        res.status(500).json({ 
            status: "Error", 
            message: "Failed to update category" 
        });
    }
};

// Delete Category
const deleteCategory = async (req, res) => {
    try {
        console.log('Request Params:', req.params); // Debugging

        const { id } = req.params;

        // Validate id
        if (!id || isNaN(id)) {
            return res.status(400).json({ 
                status: "Error", 
                message: "Invalid category ID" 
            });
        }

        const categoryId = parseInt(id, 10);
        console.log('Deleting category:', { categoryId });

        const query = "DELETE FROM categories WHERE id = ?";
        const [result] = await dbConnection.query(query, [categoryId]);

        console.log('Delete result:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                status: "Error", 
                message: "Category not found" 
            
            });
        }

        res.status(200).json({ 
            status: "Success", 
            message: "Category deleted successfully" 
        });
    } catch (error) {
        console.error("Category Deletion Error:", error);
        res.status(500).json({ 
            status: "Error", 
            message: "Failed to delete category" 
        });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const query = "SELECT * FROM categories";
        const [categories] = await dbConnection.query(query);
        res.status(200).json({ 
            status: "Success", 
            message: "Categories fetched successfully", 
            data: categories 
        });
    } catch (error) {
        console.error("Category Fetching Error:", error);
        res.status(500).json({ 
            status: "Error", 
            message: "Failed to fetch categories" 
        });
    }
};




module.exports = {
    addCategory,
    getBlogsByCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
};