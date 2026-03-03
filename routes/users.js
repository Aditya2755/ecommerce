const express = require('express');
const router = express.Router();
const { validateUser, validateId } = require('../middleware/validation');
const User = require('../models/user');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateUser, async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User with this email already exists' }
      });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    const savedUser = await user.save();
    const userWithoutPassword = savedUser.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateId, validateUser, async (req, res, next) => {
  try {
    const existingWithEmail = await User.findOne({
      email: req.body.email,
      _id: { $ne: req.params.id }
    });
    if (existingWithEmail) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email already in use' }
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    const userWithoutPassword = updatedUser.toObject();
    delete userWithoutPassword.password;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
