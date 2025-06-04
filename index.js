require("dotenv").config();
const express = require("express");
const { sequelize } = require("./src/models/index");

const authRoutes = require("./src/routes/authRoute");
const attendanceRoutes = require("./src/routes/attendanceRoute");
const vacancyRoute = require("./src/routes/vacancyRoute");
const submissionRoute = require("./src/routes/submissionRoute");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", authRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", vacancyRoute);
app.use("/api", submissionRoute);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to database");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err.message);
    process.exit(1);
  });
