const express = require('express');
const router = express.Router();
const { 
    addCategory, 
    getBlogsByCategory, 
    updateCategory, 
    deleteCategory,
    getAllCategories
} = require('../controllers/category.controller')

router.post('/', addCategory);
router.get('/', getAllCategories)
router.get('/:category_id', getBlogsByCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

module.exports = router;
