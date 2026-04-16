const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { authMiddleware } = require('../middlewares/auth.middleware');

const uploadRouter = express.Router();

// Simpan file di memory (tidak perlu simpan ke disk)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan'), false);
    }
  },
});

// ========================
// UPLOAD AVATAR
// ========================
uploadRouter.post('/api/upload/avatar', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    // Upload ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
          transformation: [{ width: 500, height: 500, crop: 'fill' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    return res.status(200).json({
      message: 'Upload berhasil',
      url: result.secure_url,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// ========================
// UPLOAD DOKUMEN
// ========================
uploadRouter.post('/api/upload/document', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'documents',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    return res.status(200).json({
      message: 'Upload berhasil',
      url: result.secure_url,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = uploadRouter;