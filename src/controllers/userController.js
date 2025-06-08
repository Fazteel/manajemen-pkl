const userService = require("../services/userService");

exports.createUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const user = await userService.createUsers(req.body, adminId);
    res.status(201).json({
      error: false,
      status: 201,
      message: "Created - User successfully created",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      status: 400,
      message: "Bad Request - " + err.message,
      data: null,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - Users fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal Server Error - " + err.message,
      data: null,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await userService.update(req.params.id, req.body);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - User updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      status: 400,
      message: "Bad Request - " + err.message,
      data: null,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await userService.delete(req.params.id, req.user.id);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - User delete successfully",
      data: result
    });
  } catch (err) {
    res.status(403).json({
      error: true,
      status: 403,
      message: "Forbidden - " + err.message,
      data: null
    });
  }
};