// scripts/createAdmin.js
'use strict';

const bcrypt = require('bcrypt');
require('dotenv').config();
const { sequelize, User } = require('./src/models'); // pastikan path ini benar

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB.');

    // Admin data langsung tertulis di sini
    const name = 'Fahmi';
    const email = 'fahmiandika31@gmail.com';
    const plainPassword = 'Antares19';

    // Cek jika email sudah dipakai
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('Email sudah digunakan. Tidak membuat ulang akun.');
      return;
    }

    // Hash password
    const hashed = await bcrypt.hash(plainPassword, 10);

    // Buat admin baru
    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: 'admin'
    });

    console.log('Akun admin berhasil dibuat:');
    console.log(`ID: ${admin.id}`);
    console.log(`Email: ${admin.email}`);
  } catch (err) {
    console.error('Gagal membuat admin:', err.message);
  } finally {
    await sequelize.close();
  }
})();
