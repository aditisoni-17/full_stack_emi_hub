const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});