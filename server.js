const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./config/db");

dotenv.config();

const auth = require("./routes/auth");
const gigs = require("./routes/gigs");
const bids = require("./routes/bids");

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", auth);
app.use("/api/gigs", gigs);
app.use("/api/bids", bids);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "GigFlow API",
    timestamp: new Date().toISOString(),
  });
});


const syncDatabase = async () => {
  try {
    console.log("🔍 Checking database connection...");
    
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    
    console.log("✅ Database ready");
    
    return true;
  } catch (error) {
    console.error("❌ Database sync failed:", error.message);
    throw error;
  }
};


const PORT = process.env.PORT || 5000;

syncDatabase()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
      console.log(`🌐 Frontend: http://localhost:5173`);
      console.log(`🔐 Health check: http://localhost:${PORT}/api/health`);
    });

    process.on("unhandledRejection", (err) => {
      console.log(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error("❌ Server startup failed:", err.message);
    process.exit(1);
  });