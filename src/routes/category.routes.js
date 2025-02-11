const express = require('express');
const router = express.Router();
const { addCategory, getBlogsByCategory } = require('../controllers/category.controller')

router.post('/add-new', addCategory);
router.get('/:category_id', getBlogsByCategory)

module.exports = router;
