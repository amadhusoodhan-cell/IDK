const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

/* 🧠 MAIN PROXY FETCH LAYER */
app.get("/fetch", async (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      responseType: "text"
    });

    res.send(response.data);
  } catch (err) {
    res.status(500).send("Fetch error: " + err.message);
  }
});

/* SPA fallback (prevents Cannot GET errors) */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
