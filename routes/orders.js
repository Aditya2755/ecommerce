const express = require('express');
const router = express.Router();
const { validateOrder, validateId } = require('../middleware/validation');
const Order = require('../models/order');

router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json({
      success: true,
      data: orders
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }
    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
});

router.get('/user/:userId', async (req, res, next) => {
  try {
    const userOrders = await Order.find({ user: req.params.userId });
    res.json({
      success: true,
      data: userOrders
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateOrder, async (req, res, next) => {
  try {
    const newOrder = new Order({
      user: req.body.userId || null,
      items: req.body.items.map((item) => ({
        product: item.productId,
        quantity: item.quantity
      })),
      totalAmount: req.body.totalAmount,
      status: req.body.status || 'pending'
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      data: savedOrder
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/status', validateId, async (req, res, next) => {
  try {
    const validStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled'
    ];
    const { status } = req.body;
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid status is required' }
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
