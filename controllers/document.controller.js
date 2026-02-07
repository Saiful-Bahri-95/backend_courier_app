const mongoose = require('mongoose');
const Document = require('../models/document.model');

const createDocument = async (req, res) => {
  try {
    const {
      senderCompany,
      senderName,
      senderPhone,
      documentType,
      description,
      receiverCompany,
      receiverName,
      receiverPhone,
      receiverImageUrl,
      signatureUrl,
      receivedDate,
      signedName,
    } = req.body;

    // Validasi wajib
    if (!senderName || !documentType || !receiverName || !signatureUrl || !signedName) {
      return res.status(400).json({
        message: 'Data wajib belum lengkap',
      });
    }

    const document = await Document.create({
      senderCompany,
      senderName,
      senderPhone,
      documentType,
      description,
      receiverCompany,
      receiverName,
      receiverPhone,
      receiverImageUrl,
      signatureUrl,
      receivedDate,
      signedName,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: 'Dokumen berhasil disimpan',
      data: document,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
};

const getDocumentsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const documents = await Document.find({ createdBy: userId })
      .sort({ createdAt: -1 }); // terbaru di atas

    return res.status(200).json({
      message: 'List dokumen berhasil diambil',
      data: documents,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1️⃣ Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID dokumen tidak valid',
      });
    }

    // 2️⃣ Cari dokumen + pastikan milik user
    const document = await Document.findOne({
      _id: id,
      createdBy: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        message: 'Dokumen tidak ditemukan',
      });
    }

    // 3️⃣ Return detail
    return res.status(200).json({
      message: 'Detail dokumen berhasil diambil',
      data: document,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: 'Dokumen tidak ditemukan',
      });
    }

    // 🔐 OWNER CHECK (PAKAI createdBy)
    if (document.createdBy.toString() !== userId) {
      return res.status(403).json({
        message: 'Tidak diizinkan menghapus dokumen ini',
      });
    }

    await Document.findByIdAndDelete(id);

    // ✅ SUCCESS
    return res.status(204).send();
  } catch (error) {
    console.error('❌ Delete document error:', error);
    return res.status(500).json({
      message: 'Gagal menghapus dokumen',
    });
  }
};



module.exports = {
  createDocument,
  getDocumentsByUser,
  getDocumentById,
  deleteDocument,
};
