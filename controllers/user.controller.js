const User = require('../models/user');

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ⬅️ dari JWT middleware
    const { fullname, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        avatar,
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      _id: updatedUser._id,
      fullname: updatedUser.fullname,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      token: req.token, // optional (kalau kamu refresh token)
    });
  } catch (error) {
    res.status(500).json({ message: 'Update profile failed' });
  }
};

module.exports = {
    updateProfile,
};
