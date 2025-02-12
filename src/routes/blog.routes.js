const express = require('express');
const router = express.Router();
const { createBlog, getAllBlogs, updateBlog, deleteBlog } = require('../controllers/blog.controller');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../middlewares/upload');
const checkRole = require('../utils/checkRole');

router.post('/', verifyToken, checkRole('Agent'), upload.array('images', 5), createBlog);
router.put("/:id", verifyToken, upload.array('images', 5), updateBlog);
router.delete("/:id", verifyToken, checkRole('Agent'), deleteBlog);

router.get('/', getAllBlogs)
module.exports = router;

// how many methods ?? =>> get post put patch delete  