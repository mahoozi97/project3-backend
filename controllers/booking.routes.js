const router = require("express").Router();
const Booking = require("../models/Booking");

router.post("/", async (req, res) => {
  try {
    console.log(req.user);
    req.body.userId = req.user._id;
    const createdBooking = await Booking.create(req.body);
    console.log("✅ new booking: ", createdBooking);
    res.status(201).json(createdBooking);
  } catch (error) {
    console.log("❌ error create a new booking: ", error);
    res.status(500).json(error);
  }
});

// get all booking
router.get("/", async (req, res) => {
  try {
    const allBooking = await Booking.find();
    console.log("✅ fetched all booking successfully: ", allBooking);
    res.status(200).json(allBooking);
  } catch (error) {
    console.log("❌ error fetch all booking: ", error);
    res.status(500).json(error);
  }
});

module.exports = router;
