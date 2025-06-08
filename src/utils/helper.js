const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpMap = new Map();

exports.generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

exports.generateQrCode = () => {
    const payload = {
    type,
    tanggal: new Date().toISOString().split("T")[0],
    secret: this.generateResetToken()
  };

  return payload;
}

exports.sendSetPasswordEmail = async (email, name, token) => {
  const link = `https://manajemen-pkl-production.up.railway.app/api/auth/set-password?token=${token}`; 
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  const htmlContent = `
    <h2>Selamat datang, ${name}!</h2>
    <p>Admin telah membuat akun ${email} untuk Anda di SIMAKU.</p>
    <p>Silakan klik tombol di bawah ini untuk mengatur password pertama Anda:</p>
    <a href="${link}" class="button">Atur Password Sekarang</a>
    <p>Link ini akan kedaluwarsa dalam 2 jam.</p>
  `;

  const mailOptions = {
    from: `"SIMAKU" <${process.env.ZOHO_EMAIL}>`,
    to: email,
    subject: "Atur Password Akun SIMAKU Anda",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email set password dikirim ke ${email}`);
};

exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.storeOtp = async (email, otp) => {
  const resetUrl = `https://manajemen-pkl-production.up.railway.app/api/auth/reset-password?email=${encodeURIComponent(email)}`;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    const htmlContent = `
    <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* Font modern */
            background-color: #E8F5E9; /* Hijau muda lembut sebagai background utama */
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased; /* Teks lebih halus */
            -moz-osx-font-smoothing: grayscale;
          }
          .email-wrapper {
            padding: 20px 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px; /* Radius lebih besar untuk kesan modern */
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08); /* Shadow lebih halus */
            overflow: hidden; /* Untuk memastikan border-radius pada header */
          }
          .header {
            text-align: center;
            padding: 30px 20px; /* Padding lebih besar */
            background: #4CAF50; /* Hijau utama */
            /* background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%); Gradasi hijau (opsional) */
            color: white;
            border-bottom: 5px solid #FFEB3B; /* Aksen kuning di bawah header */
          }
          .header h1 {
            margin: 0;
            font-size: 28px; /* Ukuran font lebih besar */
            font-weight: 600; /* Berat font sedikit lebih tebal */
          }
          .content {
            padding: 30px 35px; /* Padding lebih besar di konten */
            text-align: left; /* Teks rata kiri untuk readability */
            line-height: 1.6; /* Spasi antar baris */
            color: #333333; /* Warna teks lebih gelap untuk kontras */
          }
          .content p {
            margin: 0 0 15px 0; /* Margin bawah untuk paragraf */
            font-size: 16px;
          }
          .otp-code-container {
            text-align: center; /* Agar OTP code di tengah */
            margin: 25px 0;
          }
          .otp-code {
            font-size: 32px; /* Ukuran OTP lebih besar */
            font-weight: bold;
            background: #FFF9C4; /* Kuning muda untuk background OTP */
            color: #4CAF50; /* Warna teks OTP hijau */
            padding: 15px 25px;
            display: inline-block;
            border-radius: 8px;
            letter-spacing: 3px; /* Spasi antar karakter OTP */
            border: 1px dashed #FFEB3B; /* Border putus-putus kuning */
          }
          .button-container {
            text-align: center; /* Tombol di tengah */
            margin-top: 30px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background-color: #FFEB3B; /* Tombol utama warna kuning */
            color: #4CAF50; /* Teks tombol warna hijau */
            text-decoration: none;
            border-radius: 25px; /* Tombol lebih rounded (pill shape) */
            font-size: 18px;
            font-weight: bold;
            transition: background-color 0.3s ease, transform 0.2s ease; /* Transisi halus */
          }
          .button:hover {
            background-color: #FDD835; /* Warna kuning sedikit lebih gelap saat hover */
            transform: translateY(-2px); /* Efek sedikit terangkat saat hover */
          }
          .important-note {
            background-color: #E8F5E9; /* Background hijau muda untuk catatan penting */
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #4CAF50; /* Aksen hijau di kiri */
          }
          .important-note p {
            margin: 0;
            font-size: 14px;
            color: #2E7D32; /* Warna teks hijau tua */
          }
          .footer {
            text-align: center;
            padding: 25px 20px;
            font-size: 13px;
            color: #616161; /* Warna abu-abu yang lebih modern */
            background-color: #F1F8E9; /* Warna background footer sedikit berbeda */
            border-top: 1px solid #DCEDC8; /* Garis tipis pemisah */
          }
          .footer p {
            margin: 5px 0;
          }
          .footer a {
            color: #4CAF50; /* Warna link di footer hijau */
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }

          /* Responsive adjustments */
          @media screen and (max-width: 600px) {
            .content {
              padding: 20px 25px;
            }
            .header h1 {
              font-size: 24px;
            }
            .otp-code {
              font-size: 28px;
              padding: 12px 20px;
            }
            .button {
              font-size: 16px;
              padding: 12px 25px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${email},</p>
              <p>Kami menerima permintaan untuk mereset kata sandi akun Anda. Gunakan kode OTP di bawah ini untuk melanjutkan:</p>
              <div class="otp-code-container">
                <span class="otp-code">${otp}</span>
              </div>
              <p>Kode ini berlaku selama <strong>5 menit</strong>. Mohon untuk tidak membagikan kode ini kepada siapa pun demi keamanan akun Anda.</p>

              <div class="important-note">
                  <p>Jika Anda tidak meminta reset kata sandi, Anda dapat mengabaikan email ini dengan aman. Tidak ada perubahan yang akan dilakukan pada akun Anda.</p>
              </div>

              <div class="button-container">
                <a href="${resetUrl}" class="button">Reset Password Anda</a>
              </div>
            </div>
            <div class="footer">
              <p>Ini adalah email otomatis, mohon untuk tidak membalas.</p>
              <p>Butuh bantuan? <a href="#">Hubungi Tim Support</a>.</p>
              <p>&copy; ${new Date().getFullYear()} Nama Perusahaan Anda. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"SIMAKU" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: "Your OTP Code for Password Reset",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP berhasil dikirim ke ${email}`);
    return { success: true, message: `OTP berhasil dikirim ke ${email}` };
  } catch (error) {
    console.log("❌ Gagal mengirim OTP:", error.message);
    throw new Error("Gagal mengirim OTP. Silakan coba lagi.");
  }
};

exports.verifyOtp = async (email, inputOtp) => {
  const redis = await getRedisClient();
  const key = `otp:${email}`;
  const savedOtp = await redis.get(key);

  if (!savedOtp) {
    console.log('[OTP VERIFY] OTP not found or expired');
    return false;
  }

  const isValid = String(savedOtp) === String(inputOtp);
  console.log('[OTP VERIFY] isValid:', isValid);
  return isValid;
};

exports.setOtp = async (email, otp) => {
  const redis = await getRedisClient();
  await redis.set(`otp:${email}`, otp, { EX: 300 }); // 5 menit
};

exports.markOtpVerified = async (email) => {
  const redis = await getRedisClient();
  await redis.set(`otp_verified:${email}`, 'true', { EX: 600 }); // valid selama 10 menit
};

exports.checkOtpVerified = async (email) => {
  const redis = await getRedisClient();
  const isVerified = await redis.get(`otp_verified:${email}`);
  return isVerified === 'true';
};

exports.clearOtpData = async (email) => {
  const redis = await getRedisClient();
  await redis.del(`otp:${email}`, `otp_verified:${email}`);
};
