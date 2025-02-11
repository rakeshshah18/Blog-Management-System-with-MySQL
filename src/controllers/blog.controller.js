const { dbConnection } = require('../config/db');


const createBlog = async (req, res) => {
    if (req.user.role !== 'Agent') {
        return res.status(403).json({
            status: "Error",
            message: "You are not authorized to create a blog."
        });
    }

    const { title, content, category_id } = req.body; 
    const userId = req.user.id; //  ID from JWT

    console.log("Creating Blog with Author ID:", userId);  

    const imgPath = req.files.map(file => file.filename);
    const imgPathString = JSON.stringify(imgPath);

    try {
        const query = "INSERT INTO blogs (title, content, category_id, author_id, images) VALUES (?, ?, ?, ?, ?)";
        await dbConnection.query(query, [title, content, category_id, userId, imgPathString]);

        return res.status(201).json({
            status: "Success",
            message: "Blog created successfully."
        });
    } catch (error) {
        console.error("Blog Creation Error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Failed to create blog."
        });
    }
};




const getBlogByCategory = async (req, res) => {
    const { category_id } = req.query;  
    console.log("Fetching blogs for category:", category_id);

    
    if (!category_id || isNaN(category_id)) {
        return res.status(400).json({ status: "Error", message: "Invalid category_id" });
    }

    try {
        const query = `
        SELECT blogs.*, users.role 
            FROM blogs 
            JOIN users ON blogs.author_id = users.id
            WHERE blogs.category_id = ?
        `;
        const [blogs] = await dbConnection.query(query, [parseInt(category_id)]);
        
        return res.status(200).json({
            status: "Success",
            data: blogs,
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({ status: "Error", message: "Failed to get blogs." });
    }
};

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content, category_id } = req.body;

    if (req.user.role !== "Agent") {
        return res.status(403).json({
            status: "Error",
            message: "You are not authorized to update this blog."
        });
    }

    try {
        
        const [blog] = await dbConnection.query("SELECT * FROM blogs WHERE id = ?", [id]);
        if (blog.length === 0) {
            return res.status(404).json({ status: "Error", message: "Blog not found." });
        }

        // Handleling image updates
        let imgPath = blog[0].images || '[]'; // Default
        if (req.files && req.files.length > 0) {
            const newImg = req.files.map(file => file.filename);
            imgPath = JSON.stringify(newImg);
        }

        let query = "UPDATE blogs SET title = ?, content = ?, images = ? WHERE id = ?";
        let params = [title, content, imgPath, id];

        if (category_id !== undefined) {

            const [category] = await dbConnection.query("SELECT * FROM categories WHERE id = ?", [category_id]);
            if (category.length === 0) {
                return res.status(400).json({
                    status: "Error",
                    message: "Invalid category_id. Category does not exist."
                });
            }

            query = "UPDATE blogs SET title = ?, content = ?, category_id = ?, images = ? WHERE id = ?";
            params = [title, content, category_id, imgPath, id];
        }

        // Execute update query
        const [result] = await dbConnection.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(500).json({ status: "Error", message: "Update failed, no rows affected." });
        }

        return res.status(200).json({ status: "Success", message: "Blog updated successfully." });
    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Failed to update blog.",
            error: error.message
        });
    }
};





const deleteBlog = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== "Agent") {
        return res.status(403).json({
            status: "Error",
            message: "You are not authorized to delete this blog."
        });
    }

    try {

        const [blog] = await dbConnection.query("SELECT * FROM blogs WHERE id = ?", [id]);
        if (blog.length === 0) {
            return res.status(404).json({ status: "Error", message: "Blog not found." });
        }


        const [result] = await dbConnection.query("DELETE FROM blogs WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ status: "Error", message: "Failed to delete blog." });
        }

        return res.status(200).json({ status: "Success", message: "Blog deleted successfully." });
    } catch (error) {
        console.error("Delete Error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Failed to delete blog.",
            error: error.message
        });
    }
};

const getAllBlogs = async (req, res) => {
    // const { category_id } = req.query;
    

    const query = `SELECT * FROM blogs`;

    try {
        const [blogs] = await dbConnection.query(query);
        res.status(200).json({ status: "Success", data: blogs });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to fetch blogs by category." });
    }
};






module.exports = { 
    createBlog, 
    getBlogByCategory, 
    updateBlog, 
    deleteBlog,
    getAllBlogs
};