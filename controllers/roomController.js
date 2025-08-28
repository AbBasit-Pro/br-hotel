const Room = require('../models/Room');
const Reservation = require('../models/Reservation');

// ================== GET ALL ROOMS ==================
exports.index = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: 'Server error while fetching rooms' });
  }
};

// ================== CREATE NEW ROOM ==================
exports.store = async (req, res) => {
  try {
    const room = new Room({
      roomNumber: req.body.roomNumber,
      type: req.body.type,
      capacity: req.body.capacity,
      pricePerNight: req.body.pricePerNight,
      status: req.body.status
    });

    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error("Error creating room:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Room number must be unique' });
    }
    res.status(500).json({ error: 'Server error while creating room' });
  }
};

// ================== GET SINGLE ROOM (with reservations) ==================
exports.show = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Fetch reservations separately
    const reservations = await Reservation.find({ room: room._id }).populate('guest');

    res.json({ ...room.toObject(), reservations });
  } catch (err) {
    console.error("Error fetching room:", err);
    res.status(500).json({ error: 'Server error while fetching room' });
  }
};

// ================== UPDATE ROOM ==================
exports.update = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    Object.assign(room, req.body);
    await room.save();
    res.json(room);
  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).json({ error: 'Server error while updating room' });
  }
};

// ================== DELETE ROOM ==================
// DELETE /api/rooms/:id
exports.destroy = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id); // directly delete

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ error: "Server error" });
  }
};

