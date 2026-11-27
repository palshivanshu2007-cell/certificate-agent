
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json({ limit: "20kb" }));

// Certificate database structure
const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  recipientName: {
    type: String,
    required: true,
    trim: true
  },
  achievementTitle: {
    type: String,
    required: true,
    trim: true
  },
  tier: {
    type: String,
    default: "Bronze"
  },
  issuerName: {
    type: String,
    default: "Certificate Agent"
  },
  description: {
    type: String,
    default: ""
  },
  dateIssued: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Certificate = mongoose.model(
  "Certificate",
  certificateSchema
);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Certificate Agent API is running!",
    status: "OK"
  });
});

// Create certificate
app.post("/api/certificates", async (req, res) => {
  try {
    const {
      certificateId,
      recipientName,
      achievementTitle,
      tier,
      issuerName,
      description
    } = req.body;

    if (
      !certificateId ||
      !recipientName ||
      !achievementTitle
    ) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID, recipient name and achievement title are required."
      });
    }

    const certificate = await Certificate.create({
      certificateId,
      recipientName,
      achievementTitle,
      tier,
      issuerName,
      description
    });

    res.status(201).json({
      success: true,
      message: "Certificate created successfully.",
      certificate
    });

  } catch (error) {
    const status = error.code === 11000 ? 409 : 500;

    res.status(status).json({
      success: false,
      message: status === 409
        ? "Certificate ID already exists."
        : "Unable to create certificate."
    });
  }
});

// Public certificate verification
app.get("/api/certificates/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.id
    }).select("-__v");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found."
      });
    }

    res.json({
      success: true,
      certificate
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Verification failed."
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
