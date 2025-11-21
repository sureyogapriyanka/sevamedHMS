const express = require('express');
const router = express.Router();
const knowledgeArticleController = require('../controllers/knowledgeArticleController');

// Get all articles
router.get('/', knowledgeArticleController.getAllArticles);

// Get article by ID
router.get('/:id', knowledgeArticleController.getArticleById);

// Create a new article
router.post('/', knowledgeArticleController.createArticle);

// Update an article
router.put('/:id', knowledgeArticleController.updateArticle);

// Delete an article
router.delete('/:id', knowledgeArticleController.deleteArticle);

// Increment view count
router.patch('/:id/view', knowledgeArticleController.incrementViewCount);

module.exports = router;