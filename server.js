const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* middleware */
app.use(cors());
app.use(express.json());

/* serve frontend */
app.use(express.static(path.join(__dirname, "public")));

/* home redirect */
app.get("/", (req, res) => {
  res.redirect("/Google.html");
});

/* proxy engine */
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

    const contentType = response.headers["content-type"];

    res.set("Content-Type", contentType);
    res.send(response.data);

  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

/* catch-all (prevents random crashes) */
app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
