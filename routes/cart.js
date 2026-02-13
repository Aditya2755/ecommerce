const express = require('express');
const router = express.Router();
const { validateCartItem, validateId } = require('../middleware/validation');

let carts = {};
let cartIdCounter = 1;

router.get('/:userId', validateId, (req, res) => {
  const userId = req.params.userId;
  const cart = carts[userId] || { userId, items: [], total: 0 };
  res.json({
    success: true,
    data: cart
  });
});

router.post('/:userId/items', validateId, validateCartItem, (req, res) => {
  const userId = req.params.userId;
  if (!carts[userId]) {
    carts[userId] = { userId, items: [], total: 0 };
  }
  const existingItemIndex = carts[userId].items.findIndex(
    item => item.productId === req.body.productId
  );
  if (existingItemIndex !== -1) {
    carts[userId].items[existingItemIndex].quantity += req.body.quantity;
  } else {
    carts[userId].items.push({
      productId: req.body.productId,
      quantity: req.body.quantity
    });
  }
  res.status(201).json({
    success: true,
    data: carts[userId]
  });
});

router.put('/:userId/items/:itemId', validateId, validateCartItem, (req, res) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;
  if (!carts[userId]) {
    return res.status(404).json({
      success: false,
      error: { message: 'Cart not found' }
    });
  }
  const itemIndex = carts[userId].items.findIndex(item => item.productId === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Item not found in cart' }
    });
  }
  carts[userId].items[itemIndex].quantity = req.body.quantity;
  res.json({
    success: true,
    data: carts[userId]
  });
});

router.delete('/:userId/items/:itemId', validateId, (req, res) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;
  if (!carts[userId]) {
    return res.status(404).json({
      success: false,
      error: { message: 'Cart not found' }
    });
  }
  const itemIndex = carts[userId].items.findIndex(item => item.productId === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Item not found in cart' }
    });
  }
  carts[userId].items.splice(itemIndex, 1);
  res.json({
    success: true,
    data: carts[userId]
  });
});

router.delete('/:userId', validateId, (req, res) => {
  const userId = req.params.userId;
  if (!carts[userId]) {
    return res.status(404).json({
      success: false,
      error: { message: 'Cart not found' }
    });
  }
  delete carts[userId];
  res.json({
    success: true,
    message: 'Cart cleared successfully'
  });
});

module.exports = router;
