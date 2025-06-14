const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { Attendance, QrCode, User } = require("../models/index");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

exports.generateQr = async (userId) => {
  const secret = uuidv4();

  const qrEntry = await QrCode.create({
    secret,
    created_by: userId,
  });

  const qrString = JSON.stringify({ secret });
  const qrImage = await QRCode.toDataURL(qrString);

  return {
    id: qrEntry.id,
    secret: qrEntry.secret,
    qr_image: qrImage,
  };
};

const validateQr = async (qrData) => {
  let parsed;
  try {
    parsed = typeof qrData === "string" ? JSON.parse(qrData) : qrData;
  } catch (e) {
    throw new Error("QR tidak valid (format)");
  }

  if (!parsed.secret) {
    throw new Error("QR tidak memiliki secret");
  }

  const qrInDb = await QrCode.findOne({ where: { secret: parsed.secret } });
  if (!qrInDb) {
    throw new Error("QR tidak terdaftar");
  }
};

exports.getLatestQrCode = async () => {
  const latestQr = await QrCode.findOne({
    order: [["createdAt", "DESC"]],
  });

  return latestQr;
};

exports.checkIn = async (userId, qrData, location) => {
  validateQr(qrData);

  // Validasi lokasi bisa dilakukan di sini (contoh lokasi tidak kosong)
  //   if (!location || !location.lat || !location.lng) {
  //     throw new Error("Lokasi tidak valid");
  //   }

  const now = dayjs().tz("Asia/Jakarta");
  const todayDateString = now.format("YYYY-MM-DD");

  let absensi = await Attendance.findOne({
    where: {
      user_id: userId,
      tanggal: todayDateString,
    },
  });

  if (absensi && absensi.check_in) {
    throw new Error("Anda sudah melakukan check-in hari ini");
  }

  const checkInTime = now.toDate();
  if (!absensi) {
    absensi = await Attendance.create({
      user_id: userId,
      tanggal: todayDateString,
      check_in: checkInTime,
      keterangan: "Hadir",
    });
  } else {
    absensi.check_in = checkInTime;
    await absensi.save();
  }

  return {
    tanggal: absensi.tanggal,
    check_in: dayjs(absensi.check_in).tz("Asia/Jakarta").format("HH:mm:ss"),
  };
};

exports.checkOut = async (userId, qrData, location) => {
  validateQr(qrData);

  //   if (!location || !location.lat || !location.lng) {
  //     throw new Error("Lokasi tidak valid");
  //   }

  const now = dayjs().tz("Asia/Jakarta");
  const todayDateString = now.format("YYYY-MM-DD");

  const absensi = await Attendance.findOne({
    where: {
      user_id: userId,
      tanggal: todayDateString,
    },
  });

  if (!absensi || !absensi.check_in) {
    throw new Error("Anda belum melakukan check-in hari ini");
  }

  if (absensi.check_out) {
    throw new Error("Anda sudah melakukan check-out hari ini");
  }

  absensi.check_out = now.toDate();
  await absensi.save();

  return {
      tanggal: absensi.tanggal,
      check_in: dayjs(absensi.check_in).tz('Asia/Jakarta').format('HH:mm:ss'),
      check_out: dayjs(absensi.check_out).tz('Asia/Jakarta').format('HH:mm:ss'),
  };
};

exports.getAttendanceByUserId = async (userId) => {
  const records = await Attendance.findAll({
    where: { user_id: userId },
    include: {
      model: User,
      attributes: ["id", "name", "email"],
    },
    order: [["tanggal", "DESC"]],
  });
  return records;
};

exports.getAllAttendance = async () => {
  const records = await Attendance.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: {
      model: User,
      attributes: ["id", "name", "email"],
    },
    order: [["tanggal", "DESC"]],
  });
  return records;
};

exports.getTodaysLeaderboard = async () => {
  const today = new Date().toISOString().split("T")[0];

  const leaderboardData = await Attendance.findAll({
    where: {
      tanggal: today,
      keterangan: "Hadir",
      check_in: {
        [Op.ne]: null,
      },
    },
    include: {
      model: User,
      attributes: ["name"],
      required: true,
    },
    order: [["check_in", "ASC"]],
    attributes: ["id", "check_in"],
  });

  return leaderboardData;
};

exports.permit = async (userId, keterangan, alasan) => {
  const allowedTypes = ["sakit", "izin"];
  if (!allowedTypes.includes(keterangan)) {
    throw new Error("Keterangan harus berupa 'sakit' atau 'izin'");
  }
  if (!alasan || alasan.trim() === "") {
    throw new Error("Deskripsi alasan wajib diisi");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await Attendance.findOne({
    where: { user_id: userId, tanggal: today },
  });

  if (existing) {
    throw new Error("Absensi hari ini sudah tercatat");
  }

  const permit = await Attendance.create({
    user_id: userId,
    tanggal: today,
    keterangan,
    alasan,
  });

  return permit;
};

exports.absence = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const users = await User.findAll({
    where: { role: { [Op.in]: ["siswa", "guru"] } },
    attributes: ["id"],
  });
  const recorded = await Attendance.findAll({
    where: { tanggal: today },
    attributes: ["user_id"],
  });

  const recordedUserIds = recorded.map((a) => a.user_id);
  const absentUsers = users.filter((u) => !recordedUserIds.includes(u.id));

  const created = [];

  for (const user of absentUsers) {
    const absensi = await Attendance.create({
      user_id: user.id,
      tanggal: today,
      keterangan: "alpha",
    });
    created.push(absensi);
  }

  return created;
};
