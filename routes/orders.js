const express = require('express');
const router = express.Router();
const { validateOrder, validateId } = require('../middleware/validation');

let orders = [];
let orderIdCounter = 1;

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: orders
  });
});

router.get('/:id', validateId, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
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
});

router.get('/user/:userId', validateId, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.params.userId);
  res.json({
    success: true,
    data: userOrders
  });
});

router.post('/', validateOrder, (req, res) => {
  const newOrder = {
    id: orderIdCounter++,
    userId: req.body.userId || null,
    items: req.body.items,
    totalAmount: req.body.totalAmount,
    status: req.body.status || 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  res.status(201).json({
    success: true,
    data: newOrder
  });
});

router.put('/:id/status', validateId, (req, res) => {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const { status } = req.body;
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: { message: 'Valid status is required' }
    });
  }
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (orderIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Order not found' }
    });
  }
  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date().toISOString();
  res.json({
    success: true,
    data: orders[orderIndex]
  });
});

router.delete('/:id', validateId, (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (orderIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Order not found' }
    });
  }
  orders.splice(orderIndex, 1);
  res.json({
    success: true,
    message: 'Order deleted successfully'
  });
});

module.exports = router;
