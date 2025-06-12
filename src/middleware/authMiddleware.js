const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Autentikasi gagal" });
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Akses terlarang: Anda tidak memiliki hak akses yang cukup.' });
    }

    next();
  };
};
