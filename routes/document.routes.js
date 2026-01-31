const express = require('express');
const { createDocument, getDocumentsByUser, getDocumentById } = require('../controllers/document.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, createDocument);
router.get('/', authMiddleware, getDocumentsByUser);
router.get('/:id', authMiddleware, getDocumentById);

module.exports = router;
