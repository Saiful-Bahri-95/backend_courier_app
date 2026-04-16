const cloudinary = require('../config/cloudinary');

/**
 * UPLOAD IMAGE FILE
 * multipart/form-data
 * field name: file
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'images',
      resource_type: 'image',
      transformation: [
        { width: 1200, crop: 'limit' },
        { quality: 'auto' },
      ],
    });

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error('Upload image error:', err);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

/**
 * UPLOAD SIGNATURE
 * JSON body: { imageBase64 }
 */
const uploadSignature = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: 'No signature data' });
    }

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: 'signatures',
      resource_type: 'image',
      transformation: [
        { background: 'transparent' },
        { width: 600, crop: 'limit' },
      ],
    });

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error('Upload signature error:', err);
    res.status(500).json({ message: 'Signature upload failed' });
  }
};

module.exports = {
  uploadImage,
  uploadSignature,
};