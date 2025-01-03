const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();


// Middleware
app.use(cors()); // Allow CORS
app.use(
  cors({
    origin: ["https://seat-reservation-app-henna.vercel.app/login"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json()); // Body parser

app.get("/", (req, res) => {
  res.json("Hello")
})

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Example protected route
const protect = require("./middlewares/authMiddleware");
app.get("/api/home", protect, (req, res) => {
  res.json({ message: `Welcome, ${req.user.name}!` });
});

// Error handling middleware for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
