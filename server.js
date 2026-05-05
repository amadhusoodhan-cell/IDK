const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANT: allows access to google.html and other files
app.use(express.static(__dirname));

// Home route
app.get("/", (req, res) => {
  res.send(`
    <h1>✅ Proxy Server Running</h1>
    <p>Open: <a href="/google.html">Google Proxy Page</a></p>
  `);
});

// Proxy endpoint
app.get("/proxy", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("❌ Missing URL (?url=...)");
  }

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      responseType: "arraybuffer",
      timeout: 15000
    });

    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);

  } catch (err) {
    res.status(500).send("❌ Proxy Error: " + err.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
