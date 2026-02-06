const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // ⭐ penting
      validate: {
        validator: (value) => {
          const result =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return result.test(value);
        },
        message: 'Please enter a valid email address',
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    // 👇 PROFILE PICTURE
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // ⭐ bagus buat audit
  }
);

module.exports = mongoose.model('User', userSchema);
