const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

/* -----------------------------
   🔎 SEARCH API (live suggestions)
------------------------------*/
const fakeSuggestions = [
  "hello world",
  "how to code",
  "github",
  "google",
  "proxy server",
  "node js",
  "render deploy",
  "javascript tutorial"
];

app.get("/suggest", (req, res) => {
  const q = (req.query.q || "").toLowerCase();

  if (!q) return res.json([]);

  const results = fakeSuggestions.filter(item =>
    item.toLowerCase().includes(q)
  );

  res.json(results.slice(0, 5));
});

/* -----------------------------
   🌐 PROXY (iframe fetch backend)
------------------------------*/
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
    res.status(500).send("Proxy error");
  }
});

/* -----------------------------
   🚫 ANTI 404 SYSTEM (IMPORTANT)
------------------------------*/
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
