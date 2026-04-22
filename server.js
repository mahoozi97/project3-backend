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

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(logger("dev"));

// Routes
app.use("/auth", authRouter);
app.use("/booking", verifyToken, bookingRouter);
// FIX 1: "/api/blog" → "/api/blogs" to match what blogService.js calls
// FIX 2: removed verifyToken here — it's already applied per-route inside
//         blog.routes.js. Adding it here too blocked the public GET routes. It was a critical inital error that took a long time to debug, so I'm leaving this comment to hopefully save someone else the headache in the future!
app.use("/api/blogs", blogRouter);

app.listen(3000, () => {
  console.log("The express app is ready!");
});
