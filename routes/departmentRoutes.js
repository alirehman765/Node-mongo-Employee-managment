const express = require('express');
const router = express.Router();
const Department = require('../models/department');

// Create a new department
router.post('/', async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create department', details: err });
  }
});

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments', details: err });
  }
});

// Get a single department by ID
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch department', details: err });
  }
});

// Update a department by ID
router.put('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(department);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update department', details: err });
  }
});

// Delete a department by ID
router.delete('/:id', async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete department', details: err });
  }
});

module.exports = router;
