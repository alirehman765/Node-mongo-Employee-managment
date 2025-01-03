const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

// Create a new employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create employee', details: err });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().populate('department');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees', details: err });
  }
});

// Get a single employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department');
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee', details: err });
  }
});

// Update an employee by ID
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('department');
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update employee', details: err });
  }
});

// Delete an employee by ID
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee', details: err });
  }
});

module.exports = router;
