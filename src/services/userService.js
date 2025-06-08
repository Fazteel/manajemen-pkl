const { where, Op } = require("sequelize");
const { User } = require("../models/index");

exports.createUsers = async ({ name, email, password, role }, createdBy) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email already exist");

  const allowedRoles = ["guru", "siswa"];
  if (!allowedRoles.includes(role)) throw new Error("Invalid role");

  const token = generateResetToken();
  const tokenExpire = new Date(Date.now() + 1000 * 60 * 60 * 2);

  const user = await User.create({
    name,
    email,
    password: null,
    role,
    created_by: createdBy,
    reset_password_token: token,
    reset_token_expire: tokenExpire,
  });
  await sendSetPasswordEmail(email, name, token);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    reset_password_token: token,
    reset_token_expire: tokenExpire,
  };
};

exports.getAllUsers = async () => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role"],
    where: {
      role: {
        [Op.ne]: "admin",
      },
      deletedAt: null,
    },
  });
  return users;
};

exports.update = async (id, payload) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  delete payload.email;
  delete payload.password;

  await user.update(payload);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

exports.delete = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  await user.destroy();
  return { message: "User soft deleted", id };
};
