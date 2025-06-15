require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URL;

const app = express();

// ✅ Middleware
app.use(cors({
    origin: ["http://localhost:5173", "https://zerodha1dashboard.netlify.app","*"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));
app.use(bodyParser.json());

// ✅ Routes

// Get all holdings
app.get("/allHoldings", async (req, res) => {
    try {
        const allHoldings = await HoldingsModel.find({});
        res.status(200).json(allHoldings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch holdings" });
    }
});

// Get all positions
app.get("/allPositions", async (req, res) => {
    try {
        const allPositions = await PositionsModel.find({});
        res.status(200).json(allPositions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch positions" });
    }
});

// Create new order
app.post("/newOrder", async (req, res) => {
    try {
        const { name, qty, price, mode } = req.body;
        const newOrder = new OrdersModel({ name, qty, price, mode });
        await newOrder.save();
        res.status(201).json({ message: "Order saved successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save order" });
    }
});

// ✅ MongoDB Connection and App Start
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server started on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
    });
