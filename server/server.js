require("dotenv").config();

// Force Google DNS to resolve MongoDB Atlas SRV records
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Rate limit contact form
app.use(
  "/api/leads",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { success: false, message: "Too many requests" } })
);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/leads", require("./routes/leads"));

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
