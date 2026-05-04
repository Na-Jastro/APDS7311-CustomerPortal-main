// ===============================
// Load Environment Variables FIRST
// ===============================
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// ===============================
// Core Imports
// ===============================
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/payment");
const employeeRoutes = require("./routes/employeeRoutes");

const {
  securityHeaders,
  globalLimiter,
  authLimiter,
  paymentLimiter,
  employeeLimiter,
  corsMiddleware,
  sanitizeInput,
  requestLogger,
  bruteForceProtection
} = require("./config/security");

// ===============================
// Initialize App
// ===============================
const app = express();
connectDB();

// ===============================
// Port Configuration
// ===============================
const rawPort = process.env.PORT;
const PORT = rawPort && /^\d+$/.test(rawPort)
  ? parseInt(rawPort, 10)
  : 5001;

// ===============================
// Security Middleware
// ===============================
app.use(securityHeaders);
app.use(corsMiddleware);
app.options("*", corsMiddleware);

app.use(requestLogger);
app.use(sanitizeInput);
app.use(globalLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===============================
// Session Configuration
// ===============================
const USE_SSL = process.env.USE_SSL === "true";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      touchAfter: 24 * 3600
    }),
    cookie: {
      secure: USE_SSL,   // 🔥 Secure cookies when HTTPS enabled
      httpOnly: true,
      maxAge: 1800000,
      sameSite: "strict"
    }
  })
);

// ===============================
// Rate Limiters
// ===============================
app.use("/api/auth/login", authLimiter);
app.use("/api/employee/login", employeeLimiter);
app.use("/api/payment", paymentLimiter);

app.use("/api/auth/login", bruteForceProtection);
app.use("/api/employee/login", bruteForceProtection);

// ===============================
// Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/employee", employeeRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// ===============================
// React Static Serving (Optional)
// ===============================
const clientBuildPath = path.join(__dirname, "../client/build");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(clientBuildPath, "index.html"));
    } else {
      res.status(404).json({ error: "API route not found" });
    }
  });
}

// ===============================
// Error Handling
// ===============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong"
  });
});

// ===============================
// HTTPS / HTTP Startup
// ===============================
const SSL_KEY_PATH = process.env.SSL_KEY
  ? path.join(__dirname, process.env.SSL_KEY)
  : null;

const SSL_CERT_PATH = process.env.SSL_CERT
  ? path.join(__dirname, process.env.SSL_CERT)
  : null;

if (
  USE_SSL &&
  SSL_KEY_PATH &&
  SSL_CERT_PATH &&
  fs.existsSync(SSL_KEY_PATH) &&
  fs.existsSync(SSL_CERT_PATH)
) {
  const sslOptions = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH)
  };

  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🔒 HTTPS Server running on https://localhost:${PORT}`);
  });
} else {
  console.log("⚠ SSL disabled or certificate files missing.");
  http.createServer(app).listen(PORT, () => {
    console.log(`🚀 HTTP Server running on http://localhost:${PORT}`);
  });
}
