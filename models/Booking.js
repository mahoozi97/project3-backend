const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cpr: {
    type: Number,
    required: true,
    unique: true,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  driver: {
    type: String,
    required: true,
    enum: ["Ahmed", "Ali", "Husain", "Taha"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
