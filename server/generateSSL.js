const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env")
});

const fs = require("fs");

(async () => {
  try {
    const selfsigned = require("selfsigned");

    const sslDir = path.join(__dirname, "ssl");

    if (!fs.existsSync(sslDir)) {
      fs.mkdirSync(sslDir);
    }

    console.log("🔐 Generating self-signed SSL certificate...");

    const attrs = [{ name: "commonName", value: "localhost" }];

    // 🔥 IMPORTANT: Await the Promise
    const pems = await selfsigned.generate(attrs, {
      keySize: 2048,
      days: 365,
      algorithm: "sha256"
    });

    if (!pems.private || !pems.cert) {
      throw new Error("Certificate generation returned invalid data");
    }

    fs.writeFileSync(path.join(sslDir, "server.key"), pems.private);
    fs.writeFileSync(path.join(sslDir, "server.crt"), pems.cert);

    console.log("✅ Self-signed certificate created successfully!");
    console.log("📁 Location:", sslDir);
  } catch (err) {
    console.error("❌ Error generating certificate:", err.message);
  }
})();
