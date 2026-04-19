const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cpr: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    driver: {
      type: String,
      required: true,
      enum: ["Ahmed", "Ali", "Husain", "Taha"],
    },
    status: {
      type: String,
      enum: ["Pending ⏳", "Accepted ✅", "Rejected ❌"],
      default: "Pending ⏳",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
