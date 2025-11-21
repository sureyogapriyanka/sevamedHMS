const KnowledgeArticle = require('../models/KnowledgeArticle');

// Get all knowledge articles
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await KnowledgeArticle.find().sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get article by ID
exports.getArticleById = async (req, res) => {
    try {
        const article = await KnowledgeArticle.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new article
exports.createArticle = async (req, res) => {
    try {
        const article = new KnowledgeArticle(req.body);
        const savedArticle = await article.save();
        res.status(201).json(savedArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an article
exports.updateArticle = async (req, res) => {
    try {
        const article = await KnowledgeArticle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an article
exports.deleteArticle = async (req, res) => {
    try {
        const article = await KnowledgeArticle.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Increment view count
exports.incrementViewCount = async (req, res) => {
    try {
        const article = await KnowledgeArticle.findByIdAndUpdate(
            req.params.id,
            { $inc: { viewCount: 1 } },
            { new: true }
        );
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};