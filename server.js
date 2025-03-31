require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit process if connection fails
    });

// Define Dashboard Schema
const DashboardSchema = new mongoose.Schema({
    userId: String,
    layout: Object,
});

const Dashboard = mongoose.model("Dashboard", DashboardSchema);

// Save Dashboard Layout
app.post("/save-layout", async (req, res) => {
    try {
        const { userId, layout } = req.body;
        await Dashboard.findOneAndUpdate(
            { userId },
            { layout },
            { upsert: true, new: true }
        );
        res.json({ message: "✅ Layout saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "❌ Error saving layout" });
    }
});

// Get Dashboard Layout
app.get("/get-layout/:userId", async (req, res) => {
    try {
        const dashboard = await Dashboard.findOne({ userId: req.params.userId });
        res.json(dashboard ? dashboard.layout : {});
    } catch (error) {
        res.status(500).json({ error: "❌ Error fetching layout" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
