const express = require('express');
const {
  createDocument,
  getDocumentsByUser,
  getDocumentById,
  deleteDocument, // 👈 tambahkan
} = require('../controllers/document.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, createDocument);
router.get('/', authMiddleware, getDocumentsByUser);
router.get('/:id', authMiddleware, getDocumentById);
router.delete('/:id', authMiddleware, deleteDocument); // ✅ INI YANG KURANG

module.exports = router;
