const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    senderCompany: String,
    senderName: { type: String, required: true },
    senderPhone: String,

    documentType: { type: String, required: true },
    description: String,

    receiverCompany: String,
    receiverName: { type: String, required: true },
    receiverPhone: String,

    receiverImageUrl: String,
    signatureUrl: { type: String, required: true },

    receivedDate: { type: Date, default: Date.now },
    signedName: { type: String, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
