// ========================
// Core imports
// ========================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = require('../middlewares/auth.middleware');
const { updateProfile } = require('../controllers/user.controller');

// ========================
// Router instance
// ========================
const authRouter = express.Router();

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

// UPDATE PROFILE
authRouter.patch('/api/user/profile', authMiddleware, updateProfile);


// ========================
// EXPORT ROUTER
// ========================
module.exports = authRouter;
