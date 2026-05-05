const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// serve static files (google.html)
app.use(express.static(path.join(__dirname, "public")));

// home page
app.get("/", (req, res) => {
  res.send(`
    <h1>✅ Proxy Server Running</h1>
    <p><a href="/google.html">Open Google Page</a></p>
  `);
});

// OPTION C FIX: handle search route so it never crashes
app.get("/search", (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.send("No search query provided");
  }

  res.send(`
    <h2>🔎 You searched for: ${q}</h2>
    <a href="/google.html">⬅ Back</a>
  `);
});

// proxy endpoint (your original feature)
app.get("/proxy", async (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      responseType: "arraybuffer"
    });

    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

// safety fallback (prevents ugly Cannot GET errors)
app.use((req, res) => {
  res.status(404).send("❌ Route not found");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
