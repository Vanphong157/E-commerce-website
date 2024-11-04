const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoute");
const orderRoutes = require("./routes/orderRoute");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error));
