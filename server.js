const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ✅ MUST be BEFORE routes */
app.use(express.static(path.join(__dirname, "public")));

/* Home */
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Mini Browser Running</h1>
    <a href="/google.html">Open App</a>
  `);
});

/* Basic proxy (NOT full UV, but works for simple pages) */
app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      responseType: "arraybuffer"
    });

    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

/* SPA fallback (prevents Cannot GET) */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "google.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
