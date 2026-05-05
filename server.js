const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   🔁 CORE PROXY ENGINE
========================= */
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing URL");

  try {
    const response = await axios.get(target, {
      responseType: "text",
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const contentType = response.headers["content-type"];

    /* =========================
       🌐 HTML REWRITER
    ========================= */
    if (contentType && contentType.includes("text/html")) {
      const $ = cheerio.load(response.data);

      /* rewrite links */
      $("a").each((_, el) => {
        let href = $(el).attr("href");
        if (href && !href.startsWith("#")) {
          $(el).attr("href", "/proxy?url=" + encodeURIComponent(new URL(href, target).href));
        }
      });

      /* rewrite scripts */
      $("script[src]").each((_, el) => {
        let src = $(el).attr("src");
        $(el).attr("src", "/proxy?url=" + encodeURIComponent(new URL(src, target).href));
      });

      /* rewrite images */
      $("img").each((_, el) => {
        let src = $(el).attr("src");
        if (src) {
          $(el).attr("src", "/proxy?url=" + encodeURIComponent(new URL(src, target).href));
        }
      });

      return res.send($.html());
    }

    /* =========================
       📦 NON-HTML (assets)
    ========================= */
    res.set("Content-Type", contentType);
    res.send(response.data);

  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

/* homepage */
app.get("/", (req, res) => {
  res.redirect("/Google.html");
});

app.listen(PORT, () => {
  console.log("UV-LITE running on port " + PORT);
});
