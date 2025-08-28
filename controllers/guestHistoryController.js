const GuestHistory = require('../models/GuestHistory');

exports.index = async (req, res) => {
  const histories = await GuestHistory.find().populate('guest').populate('reservation');
  res.json(histories);
};

exports.store = async (req, res) => {
  try {
    const payload = {
      guest: req.body.guestId,
      reservation: req.body.reservationId,
      roomNumber: req.body.roomNumber,
      rentPaid: req.body.rentPaid || 0
    };
    const gh = new GuestHistory(payload);
    await gh.save();
    res.status(201).json(gh);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.show = async (req, res) => {
  const gh = await GuestHistory.findById(req.params.id).populate('guest').populate('reservation');
  if (!gh) return res.status(404).json({ message: 'Guest history not found' });
  res.json(gh);
};

exports.update = async (req, res) => {
  const gh = await GuestHistory.findById(req.params.id);
  if (!gh) return res.status(404).json({ message: 'Guest history not found' });
  Object.assign(gh, req.body);
  await gh.save();
  res.json(gh);
};

exports.destroy = async (req, res) => {
  try {
    const gh = await GuestHistory.findById(req.params.id);
    if (!gh) {
      return res.status(404).json({ error: 'Guest history not found' });
    }

    await gh.deleteOne(); // ✅ instead of gh.remove()

    res.json({ message: 'Guest history deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
