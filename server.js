require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const guestRoutes = require('./routes/guestRoutes');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const guestHistoryRoutes = require('./routes/guestHistoryRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan('dev'));

// ✅ Serve uploaded files (e.g. scanned CNIC, Passport images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/guests', guestRoutes); 
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/guest-histories', guestHistoryRoutes);
app.use('/api/reports', reportRoutes);   // <-- Report endpoint now inside routes

// ✅ Root route
app.get('/', (req, res) => res.json({ message: 'Hotel Management API running' }));

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
