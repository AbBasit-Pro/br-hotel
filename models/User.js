const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'Receptionist', 'Manager'], default: 'Receptionist' },
  tokens: [{ type: String }] // store active tokens
}, { timestamps: true });

// hash password before save if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// method to compare password
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// generate token and store
UserSchema.methods.generateAuthToken = async function () {
  const payload = { id: this._id };
  const secret = process.env.JWT_SECRET;
  const expiresInDays = process.env.TOKEN_EXPIRE_DAYS || 30;
  const token = jwt.sign(payload, secret, { expiresIn: `${expiresInDays}d` });

  // push token and save
  this.tokens = this.tokens || [];
  this.tokens.push(token);
  await this.save();
  return token;
};

module.exports = mongoose.model('User', UserSchema);
