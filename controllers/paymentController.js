const Payment = require('../models/Payment');

exports.index = async (req, res) => {
  const payments = await Payment.find().populate({
    path: 'reservation',
    populate: [{ path: 'guest' }, { path: 'room' }]
  });
  res.json(payments);
};

exports.store = async (req, res) => {
  try {
    const payload = {
      reservation: req.body.reservationId,
      amount: req.body.amount,
      method: req.body.method,
      status: req.body.status,
      paymentDate: req.body.paymentDate,
      comingFrom: req.body.comingFrom,
      billingInstructions: req.body.billingInstructions
    };
    const payment = new Payment(payload);
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.show = async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('reservation');
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  res.json(payment);
};

exports.update = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  Object.assign(payment, req.body);
  await payment.save();
  res.json(payment);
};

exports.destroy = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    await payment.deleteOne(); // ✅ updated
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

