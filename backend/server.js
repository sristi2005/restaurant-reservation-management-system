require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const tableRoutes = require('./routes/tableRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const errorHandler = require('./middleware/errorHandler');

const Table = require('./models/Table');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);

app.use(errorHandler);

// Seed tables if empty
const seedTables = async () => {
  try {
    const count = await Table.countDocuments();
    if (count === 0) {
      console.log('Seeding tables...');
      const tablesToSeed = [
        { tableNumber: 1, capacity: 2 },
        { tableNumber: 2, capacity: 2 },
        { tableNumber: 3, capacity: 4 },
        { tableNumber: 4, capacity: 4 },
        { tableNumber: 5, capacity: 6 },
        { tableNumber: 6, capacity: 6 },
        { tableNumber: 7, capacity: 8 },
      ];
      await Table.insertMany(tablesToSeed);
      console.log('Tables seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding tables:', error);
  }
};

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'Admin' });
    if (!adminExists) {
      console.log('Seeding default admin...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'Admin',
        email: 'admin@reserveit.com',
        password: hashedPassword,
        role: 'Admin'
      });
      console.log('Default admin seeded.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant_reservations')
  .then(() => {
    console.log('Connected to MongoDB');
    seedTables();
    seedAdmin();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
