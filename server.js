const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* 🔥 CRITICAL FIX: serve static files */
app.use(express.static(path.join(__dirname, "public")));

/* Home route */
app.get("/", (req, res) => {
  res.send(`
    <h1>✅ Proxy Server Running</h1>
    <p><a href="/google.html">Open Google Proxy Page</a></p>
  `);
});

/* Proxy endpoint */
app.get("/proxy", async (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      responseType: "arraybuffer",
    });

    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

/* 🔥 Catch-all fallback (prevents “Cannot GET”) */
app.use((req, res) => {
  res.status(404).send(`
    <h2>404 Not Found</h2>
    <a href="/">Go Home</a>
  `);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
