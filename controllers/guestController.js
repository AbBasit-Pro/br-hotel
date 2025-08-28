const Guest = require('../models/Guest');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage });

exports.uploadMiddleware = upload.single('identityAttachment');

exports.index = async (req, res) => {
  const guests = await Guest.find();
  res.json(guests);
};

exports.store = async (req, res) => {
  try {
    const payload = {
      guestId: req.body.guestId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      contactNo: req.body.contactNo,
      nationality: req.body.nationality,
      cnicNo: req.body.cnicNo,
      email: req.body.email,
      passportNo: req.body.passportNo,
      companyName: req.body.companyName,
      placeOfIssue: req.body.placeOfIssue,
      reference: req.body.reference,
      expiryDate: req.body.expiryDate,
      address: req.body.address,
      identityAttachment: req.file ? req.file.path : undefined
    };
    const guest = new Guest(payload);
    await guest.save();
    res.status(201).json({ message: 'Guest created successfully', data: guest });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ error: 'Duplicate field value', details: err.keyValue });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.show = async (req, res) => {
  const guest = await Guest.findById(req.params.id);
  if (!guest) return res.status(404).json({ message: 'Guest not found' });
  res.json(guest);
};

exports.update = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    Object.assign(guest, req.body);
    if (req.file) guest.identityAttachment = req.file.path;
    await guest.save();
    res.json({ message: 'Guest updated successfully', data: guest });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ error: 'Duplicate field value', details: err.keyValue });
    res.status(500).json({ error: 'Server error' });
  }
};

// guestController.js

exports.destroy = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    await guest.deleteOne(); // <-- replace remove() with deleteOne()

    res.json({ message: 'Guest deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting guest', error: err.message });
  }
};

