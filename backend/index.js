require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const salesRoutes = require("./routes/salesRoutes");

const app = express();
// THE CORS CONFIGURATION BELOW ALLOWS ALL ORIGINS. IN PRODUCTION, YOU SHOULD RESTRICT THIS TO YOUR FRONTEND DOMAIN.
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/sales", salesRoutes);


app.get("/", (req, res) => {
  res.send("Inventory API is running ✅");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
