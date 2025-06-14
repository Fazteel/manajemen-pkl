const { User } = require('../models/index');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateOtp, verifyOtp, storeOtp, generateResetToken, sendSetPasswordEmail } = require('../utils/helper');
const getRedisClient = require('../utils/redisClinet');

const createToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid password');

  const token = createToken(user);
  return { token, user };
};

exports.setPassword = async (token, password) => {
  const user = await User.findOne({
    where: {
      reset_password_token: token,
      reset_token_expire: { [Op.gt]: new Date() },
    },
  });

  if (!user) throw new Error('Token tidak valid atau sudah kadaluarsa');

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  user.reset_password_token = null;
  user.reset_token_expire = null;
  await user.save();

  return { id: user.id, email: user.email };
};

exports.resendSetPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  if (user.password !== null) throw new Error("User sudah mengatur password");

  const token = generateResetToken();
  const tokenExpire = new Date(Date.now() + 1000 * 60 * 60 * 2);

  user.reset_password_token = token;
  user.reset_token_expire = tokenExpire;
  await user.save();

  await sendSetPasswordEmail(user.email, user.name, token);

  return user;
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Email not registered');

  const otp = generateOtp();
  const redis = await getRedisClient();
  await redis.set(`otp:${email}`, otp, { EX: 300 });

  await storeOtp(email, otp);
  console.log(`[DEBUG] OTP for ${email}: ${otp}`);
};

exports.verifyOtpStep = async ({ email, otp }) => {
  const redis = await getRedisClient();
  const savedOtp = await redis.get(`otp:${email}`);

  if (!savedOtp || savedOtp !== String(otp)) {
    throw new Error('Invalid OTP');
  }

  await redis.set(`verified:${email}`, 'true', { EX: 600 });
};

exports.requestPasswordReset = async (email) => {
  if (!email) throw new Error('Email diperlukan');

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Email tidak terdaftar');

  const otp = generateOtp();
  const redis = await getRedisClient();

  await redis.set(`reset-otp:${email}`, otp, { EX: 300 });

  await sendOtpEmail(email, otp); 
  console.log(`[DEBUG] Reset OTP for ${email}: ${otp}`);
};


exports.changeUserPassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    throw new Error('Password lama dan password baru diperlukan');
  }
  if (currentPassword === newPassword) {
    throw new Error('Password baru tidak boleh sama dengan password lama');
  }
  
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User tidak ditemukan');
  
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Password lama yang Anda masukkan salah');
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });
  
  // await sendPasswordChangeNotification(user.email);
};

exports.logout = async (req) => {
  return true;
};