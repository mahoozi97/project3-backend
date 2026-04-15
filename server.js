const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const authRouter = require("./controllers/auth.routes");
const bookingRouter = require("./controllers/booking.routes");
const blogRouter = require("./controllers/blog.routes");
const verifyToken = require("./middleware/verify-token");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json());
app.use(logger("dev"));

// Routes go here
app.use("/auth", authRouter);
app.use("/booking", verifyToken, bookingRouter);
app.use("/api/blog", blogRouter);

app.listen(3000, () => {
  console.log("The express app is ready!");
});
