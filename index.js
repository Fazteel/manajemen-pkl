require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./src/models/index");

const authRoutes = require("./src/routes/authRoute");
const userRoute = require("./src/routes/userRoute");
const attendanceRoutes = require("./src/routes/attendanceRoute");
const vacancyRoute = require("./src/routes/vacancyRoute");
const submissionRoute = require("./src/routes/submissionRoute");

const app = express();

// Load middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoute);
app.use("/api", attendanceRoutes);
app.use("/api", vacancyRoute);
app.use("/api", submissionRoute);

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

console.log(`🌍 Environment: ${NODE_ENV}`);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to database");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err.message);
    process.exit(1);
  });
