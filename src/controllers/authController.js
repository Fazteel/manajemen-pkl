const authService = require('../services/authService');

exports.createUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const user = await authService.createUsers(req.body, adminId);
    res.status(201).json({
      error: false,
      status: 201,
      message: "Created - User successfully created",
      data: {
        user
      }
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      status: 400,
      message: "Bad Request - " + err.message,
      data: null
    });
  }
};

exports.userProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await authService.profile(userId);
    res.status(200).json({
      error: false,
      status: 200,
      message: 'Get Profile successfullt',
      data: {
        userProfile
      }
    });
  } catch (error) {
    res.status(200).json({
      error: false,
      status: 200,
      message: error.message,
      data: null
    });
    
  }
}

exports.login = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - The request was successful",
      data: {
        message: "Login sucessfully",
        authorization: `Bearer ${token}`,
        userToken: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  await authService.logout(req);
  res.status(200).json({
    error: false,
    status: 200,
    message: "OK - Logout success",
    data: {
      message: "Logout success"
    }
  });
};

exports.setPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const result = await authService.setPassword(token, password);
    res.status(200).json({
      message: 'Password berhasil disetel', result
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.resendSetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await authService.resendSetPassword(email);

    res.status(200).json({
      error: false,
      status: 200,
      message: "Set password email resent successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          reset_password_token: user.reset_password_token,
          reset_token_expire: user.reset_token_expire
        }
      }
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      status: 400,
      message: "Bad Request - " + err.message,
      data: null
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - OTP sent",
      data: {
        message: "OTP sent to your email"
      }
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      status: 400,
      message: "Bad Request - " + err.message,
      data: null
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(req.body);
    await authService.verifyOtpStep({ email, otp });
    res.json({ message: 'OTP verified. You can now reset your password.', email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - Password reset success",
      data: {
        message: "Password reset success"
      }
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      status: 400,
      message: "Bad Request - " + err.message,
      data: null
    });
  }
};
