const { User } = require('../models/index');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateOtp, verifyOtp, storeOtp, generateResetToken, sendSetPasswordEmail } = require('../utils/helper');
const getRedisClient = require('../utils/redisClinet');

const createToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.createUsers = async ({name, email, password, role}, createdBy) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('Email already exist');

  const allowedRoles = ['guru', 'siswa'];
  if (!allowedRoles.includes(role)) throw new Error('Invalid role');

  const token = generateResetToken();
  const tokenExpire = new Date(Date.now() + 1000 * 60 * 60 * 2);

  const user = await User.create({
      name,
      email,
      password: null,
      role,
      created_by: createdBy,
      reset_password_token: token,
      reset_token_expire: tokenExpire
  });
  await sendSetPasswordEmail(email, name, token);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    reset_password_token: token,
    reset_token_expire: tokenExpire
  };
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

exports.resetPassword = async ({ email, newPassword }) => {
  const redis = await getRedisClient();
  const verified = await redis.get(`verified:${email}`);
  if (!verified) throw new Error('OTP not verified for this email');

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashed }, { where: { email } });

  await redis.del(`otp:${email}`);
  await redis.del(`verified:${email}`);
};

exports.logout = async (req) => {
  return true;
};
