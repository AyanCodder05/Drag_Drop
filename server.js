const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fetch = require("node-fetch"); // 👈 Needed for proxy
const Layout = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/dashboardDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 🔁 Proxy route to fetch external APIs
app.post("/proxy", async (req, res) => {
  try {
    const { apiUrl } = req.body;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy fetch error:", err);
    res.status(500).json({ error: "Failed to fetch API data" });
  }
});

app.post("/api/saveLayout", async (req, res) => {
  try {
    const { layout } = req.body;
    await Layout.deleteMany({});
    const savedLayout = await Layout.create({ layout });
    res.status(200).json(savedLayout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/loadLayout", async (req, res) => {
  try {
    const layout = await Layout.findOne({});
    res.status(200).json(layout || { layout: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
