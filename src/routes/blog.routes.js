const express = require('express');
const router = express.Router();
const { createBlog, getAllBlogs, updateBlog, deleteBlog } = require('../controllers/blog.controller');
const verifyToken = require('../middlewares/verifyToken');
const upload  = require('../middlewares/upload')

router.post('/add', verifyToken, upload.array ('images', 5),createBlog);
router.put("/:id", verifyToken, upload.array ('images', 5),updateBlog);
router.delete("/:id", verifyToken, deleteBlog);

router.get('/all_blogs', getAllBlogs )
module.exports = router;