const express = require('express');
const { body, validationResult } = require('express-validator');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

// Helper function to find available table
const findAvailableTable = async (guests, date, timeSlot, excludeReservationId = null) => {
  // Find all tables that can fit the guests, sort by smallest capacity first
  const tables = await Table.find({ capacity: { $gte: guests } }).sort({ capacity: 1 });
  
  if (tables.length === 0) {
    throw new Error(`No tables available with capacity for ${guests} guests.`);
  }

  for (let table of tables) {
    let conflictQuery = {
      table: table._id,
      date,
      timeSlot
    };

    if (excludeReservationId) {
      conflictQuery._id = { $ne: excludeReservationId };
    }

    const conflict = await Reservation.findOne(conflictQuery);
    
    if (!conflict) {
      return table; // Found an available table
    }
  }

  throw new Error('No tables available for this date and time slot.');
};

// Get reservations (Admin sees all, Customer sees own)
router.get('/', async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      query.user = req.user._id;
    }
    
    if (req.query.date) {
      query.date = req.query.date;
    }

    const reservations = await Reservation.find(query)
      .populate('table')
      .populate('user', 'name email')
      .sort({ date: 1, timeSlot: 1 });
      
    res.status(200).json(reservations);
  } catch (error) {
    next(error);
  }
});

// Create a reservation
router.post('/', [
  body('date').notEmpty().withMessage('Date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
  body('guests').isInt({ min: 1 }).withMessage('Guests must be at least 1')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }

  const { date, timeSlot, guests } = req.body;

  try {
    const availableTable = await findAvailableTable(guests, date, timeSlot);

    const reservation = await Reservation.create({
      user: req.user._id,
      table: availableTable._id,
      date,
      timeSlot,
      guests
    });

    await reservation.populate('table');
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a reservation
router.put('/:id', [
  body('date').notEmpty().withMessage('Date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
  body('guests').isInt({ min: 1 }).withMessage('Guests must be at least 1')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }

  const { date, timeSlot, guests } = req.body;

  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (req.user.role !== 'Admin' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this reservation' });
    }

    const availableTable = await findAvailableTable(guests, date, timeSlot, reservation._id);

    reservation.table = availableTable._id;
    reservation.date = date;
    reservation.timeSlot = timeSlot;
    reservation.guests = guests;

    await reservation.save();
    await reservation.populate('table');
    
    res.status(200).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel/Delete a reservation
router.delete('/:id', async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (req.user.role !== 'Admin' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to cancel this reservation' });
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Reservation cancelled successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
