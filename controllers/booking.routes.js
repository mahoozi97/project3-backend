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
    res.status(500).json({ error: error.message });
  }
});

// get all booking
router.get("/", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "You are not authorized" });
    }

    const allBooking = await Booking.find().sort({ _id: -1 });
    console.log("✅ fetched all booking successfully: ", allBooking);
    res.status(200).json(allBooking);
  } catch (error) {
    console.log("❌ Error fetching all bookings: ", error);
    res.status(500).json({ error: error.message });
  }
});

// get all booking by userId
router.get("/my-bookings", async (req, res) => {
  try {
    const userId = req.user._id;
    const bookingByUserId = await Booking.find({ userId }).sort({ _id: -1 });
    console.log("✅ fetched booking by userId successfully: ", bookingByUserId);
    res.status(200).json(bookingByUserId);
  } catch (error) {
    console.log("❌ Error fetching booking by userId: ", error);
    res.status(500).json({ error: error.message });
  }
});

// get one booking by id & userId
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user._id;
    const foundBooking = await Booking.findOne({
      _id: req.params.id,
      userId: userId,
    });

    if (!foundBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    console.log("✅ fetched booking by Id & userId successfully", foundBooking);
    res.status(200).json(foundBooking);
  } catch (error) {
    console.log("❌ Error fetching booking by Id & userId: ", error);
    res.status(500).json({ error: error.message });
  }
});

// edit the booking
router.put("/:id", async (req, res) => {
  try {
    const foundBooking = await Booking.findById(req.params.id);

    if (!foundBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const userId = req.user._id;
    if (!foundBooking.userId.equals(userId) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this booking" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    console.log("✅ Booking updated successfully: ", updatedBooking);
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.log("❌ Error updating booking: ", error);
    res.status(500).json({ error: error.message });
  }
});

// delete the booking
router.delete("/:id", async (req, res) => {
  try {
    const foundBooking = await Booking.findById(req.params.id);

    if (!foundBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const userId = req.user._id;
    if (!foundBooking.userId.equals(userId) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to cancel this booking" });
    }

    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    console.log("✅ Booking deleted successfully: ", deletedBooking);
    res.status(200).json(deletedBooking);
  } catch (error) {
    console.log("❌ Error deleting booking: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
