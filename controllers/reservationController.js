

const Reservation = require('../models/Reservation');

// ================== GET ALL RESERVATIONS ==================
exports.index = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('guest')
      .populate('room');

    res.status(200).json(reservations);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ error: 'Server error while fetching reservations' });
  }
};

// ================== CREATE NEW RESERVATION ==================
exports.store = async (req, res) => {
  try {
    const {
      guestId,
      roomId,
      checkIn,
      checkOut,
      numberOfGuests,
      totalRooms,
      advanceReceipt,
      arrivalDate,
      arrivalTime,
      estimatedStay,
      departureDate,
      departureTime,
      stayDuration,
      remarks,
      status
    } = req.body;

    if (!guestId || !roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "guestId, roomId, checkIn, and checkOut are required." });
    }

    const reservation = new Reservation({
      guest: guestId,
      room: roomId,
      checkIn,
      checkOut,
      numberOfGuests,
      totalRooms: totalRooms || 1,
      advanceReceipt,
      arrivalDate,
      arrivalTime,
      estimatedStay,
      departureDate,
      departureTime,
      stayDuration,
      remarks,
      status: status || 'pending'
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ error: 'Server error while creating reservation' });
  }
};

// ================== GET SINGLE RESERVATION ==================
exports.show = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('guest')
      .populate('room');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json(reservation);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    res.status(500).json({ error: 'Server error while fetching reservation' });
  }
};

// ================== UPDATE RESERVATION ==================
exports.update = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const updatableFields = [
      'guest', 'room', 'checkIn', 'checkOut', 'numberOfGuests',
      'totalRooms', 'advanceReceipt', 'arrivalDate', 'arrivalTime',
      'estimatedStay', 'departureDate', 'departureTime', 'stayDuration',
      'remarks', 'status'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        reservation[field] = req.body[field];
      }
    });

    await reservation.save();
    res.status(200).json(reservation);
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({ error: 'Server error while updating reservation' });
  }
};

// ================== DELETE RESERVATION ==================
exports.destroy = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await reservation.deleteOne();
    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ error: 'Server error while deleting reservation' });
  }
};

