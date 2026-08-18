require("dotenv").config();

// Force Google DNS to resolve MongoDB Atlas SRV records
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const { startTaskScheduler } = require("./controllers/tasksController");

const app = express();

connectDB().then(startTaskScheduler);

const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || "").split(","),
  "http://localhost:3000",
  "https://www.arpassociates.in",
  "https://arpassociates.in",
]
  .map((o) => o && o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/leads", require("./routes/leads"));
app.use("/leads", require("./routes/leads"));
app.use("/api/clients", require("./routes/clients"));
app.use("/api/users", require("./routes/users"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/billing", require("./routes/billing"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/push", require("./routes/push"));

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
