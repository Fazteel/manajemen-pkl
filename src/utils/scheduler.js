const cron = require("node-cron");
const { absence } = require("../services/attendanceService");

cron.schedule("0 17 * * *", () => {
  absence()
    .then(() => console.log("Alpha marking success"))
    .catch((err) => console.error("Alpha marking error:", err));
});
