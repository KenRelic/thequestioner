const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024
  },
  role: {
    type: String
  },
  isVerified: {
    type: Boolean
  },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
});


module.exports = mongoose.model('User', UserSchema);




















