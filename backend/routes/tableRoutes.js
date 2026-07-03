const express = require('express');
const Table = require('../models/Table');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find({}).sort({ tableNumber: 1 });
    res.status(200).json(tables);
  } catch (error) {
    next(error);
  }
});

// Admin only: create table
router.post('/', requireAdmin, async (req, res, next) => {
  const { tableNumber, capacity } = req.body;
  try {
    const table = await Table.create({ tableNumber, capacity });
    res.status(201).json(table);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
