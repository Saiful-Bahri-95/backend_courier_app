const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const {
  uploadImage,
  uploadSignature,
} = require('../controllers/upload.controller');

const router = express.Router();

// memory upload (AMAN & CEPAT)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// IMAGE FILE
router.post(
  '/upload/image',
  authMiddleware,
  upload.single('file'),
  uploadImage
);

// SIGNATURE (base64)
router.post(
  '/upload/signature',
  authMiddleware,
  uploadSignature
);

module.exports = router;