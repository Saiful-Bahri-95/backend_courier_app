const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Cek header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authorization token tidak ditemukan',
      });
    }

    // 2️⃣ Ambil token
    const token = authHeader.split(' ')[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Inject user ke request (🔥 INI YANG DIPAKAI CONTROLLER)
    req.user = {
      id: decoded.id,
    };

    req.token = token; // optional (kalau perlu kirim ulang token)

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token tidak valid atau sudah expired',
    });
  }
};

module.exports = {authMiddleware};
