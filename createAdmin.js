// scripts/createAdmin.js

const readline = require('readline');
const bcrypt = require('bcrypt'); // pastikan ini mengarah ke model User kamu
require('dotenv').config();
const { sequelize, User } = require('./src/models'); // pastikan ini mengarah ke config sequelize

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB.');

    const name = await ask('Nama admin: ');
    const email = await ask('Email admin: ');
    const password = await ask('Password admin: ');

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('Email sudah digunakan.');
      return rl.close();
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: 'admin'
    });

    console.log('Akun admin berhasil dibuat:');
    console.log(`ID: ${admin.id}`);
    console.log(`Email: ${admin.email}`);
    rl.close();
  } catch (err) {
    console.error('Gagal membuat admin:', err.message);
    rl.close();
  }
})();
