const express = require('express');
const router = express.Router();
const { validateUser, validateId } = require('../middleware/validation');

let users = [];
let userIdCounter = 1;

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: users
  });
});

router.get('/:id', validateId, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }
  const { password, ...userWithoutPassword } = user;
  res.json({
    success: true,
    data: userWithoutPassword
  });
});

router.post('/', validateUser, (req, res) => {
  const existingUser = users.find(u => u.email === req.body.email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: { message: 'User with this email already exists' }
    });
  }
  const newUser = {
    id: userIdCounter++,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  const { password, ...userWithoutPassword } = newUser;
  res.status(201).json({
    success: true,
    data: userWithoutPassword
  });
});

router.put('/:id', validateId, validateUser, (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }
  if (req.body.email !== users[userIndex].email) {
    const existingUser = users.find(u => u.email === req.body.email && u.id !== parseInt(req.params.id));
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email already in use' }
      });
    }
  }
  users[userIndex] = {
    ...users[userIndex],
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    updatedAt: new Date().toISOString()
  };
  const { password, ...userWithoutPassword } = users[userIndex];
  res.json({
    success: true,
    data: userWithoutPassword
  });
});

router.delete('/:id', validateId, (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }
  users.splice(userIndex, 1);
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = router;
