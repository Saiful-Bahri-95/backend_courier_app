// ========================
// Core imports
// ========================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { updateProfile } = require('../controllers/user.controller');

// ========================
// Router instance
// ========================
const authRouter = express.Router();

// Simpan OTP sementara (pakai Map, simple untuk testing)
const otpStore = new Map();

// ========================
// SIGN UP
// ========================
authRouter.post('/api/signup', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // validasi input sederhana
    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: 'Fullname, email, dan password wajib diisi',
      });
    }

    // cek email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // simpan user baru
    const user = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
});

// ========================
// SIGN IN
// ========================
authRouter.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // validasi input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email dan password wajib diisi',
      });
    }

    // cari user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    // cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid password',
      });
    }

    // ========================
    // JWT TOKEN (INI YANG KRUSIAL)
    // ========================
    const token = jwt.sign(
      { id: user._id },               // 🔥 payload konsisten
      process.env.JWT_SECRET,             // 🔥 JANGAN HARDCODE
      { expiresIn: '1d' }                 // optional tapi recommended
    );

    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
});

// ========================
// FORGOT PASSWORD - Kirim OTP
// ========================
authRouter.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('📩 Request masuk:', email);

    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? 'yes' : 'no');

    if (!user) {
      return res.status(404).json({ message: 'Email tidak ditemukan' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 OTP generated:', otp);

    otpStore.set(email, {
      otp,
      expiry: Date.now() + 10 * 60 * 1000,
    });

    console.log('📧 Mulai kirim email...');
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    console.log('GMAIL_PASS exists:', !!process.env.GMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      connectionTimeout: 5000, // 5 detik
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    await transporter.sendMail({
      from: `"App Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Kode OTP Reset Password',
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Reset Password</h2>
          <p>Kode OTP kamu:</p>
          <h1 style="color: #0A68FF; letter-spacing: 5px;">${otp}</h1>
          <p>Kode berlaku selama <b>10 menit</b>.</p>
        </div>
      `,
    });

    console.log('✅ Email terkirim!');
    return res.status(200).json({ message: 'OTP berhasil dikirim' });

  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// ========================
// RESET PASSWORD - Verifikasi OTP + Ganti Password
// ========================
authRouter.post('/api/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Cek OTP
    const stored = otpStore.get(email);
    if (!stored) {
      return res.status(400).json({ message: 'OTP tidak ditemukan, minta ulang' });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ message: 'OTP salah' });
    }
    if (Date.now() > stored.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP sudah kadaluarsa' });
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    // Hapus OTP
    otpStore.delete(email);

    return res.status(200).json({ message: 'Password berhasil direset' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE PROFILE
authRouter.patch('/api/user/profile', authMiddleware, updateProfile);


// ========================
// EXPORT ROUTER
// ========================
module.exports = authRouter;
