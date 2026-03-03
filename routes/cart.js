const express = require('express');
const router = express.Router();
const { validateCartItem } = require('../middleware/validation');
const Cart = require('../models/cart');

router.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], total: 0 });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:userId/items', validateCartItem, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], total: 0 });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity
      });
    }

    const savedCart = await cart.save();

    res.status(201).json({
      success: true,
      data: savedCart
    });
  } catch (err) {
    next(err);
  }
});

router.put(
  '/:userId/items/:itemId',
  validateCartItem,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const itemProductId = req.params.itemId;
      const { quantity } = req.body;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({
          success: false,
          error: { message: 'Cart not found' }
        });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === itemProductId
      );

      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          error: { message: 'Item not found in cart' }
        });
      }

      cart.items[itemIndex].quantity = quantity;
      const savedCart = await cart.save();

      res.json({
        success: true,
        data: savedCart
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:userId/items/:itemId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const itemProductId = req.params.itemId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: { message: 'Cart not found' }
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === itemProductId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { message: 'Item not found in cart' }
      });
    }

    cart.items.splice(itemIndex, 1);
    const savedCart = await cart.save();

    res.json({
      success: true,
      data: savedCart
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const deletedCart = await Cart.findOneAndDelete({ user: userId });

    if (!deletedCart) {
      return res.status(404).json({
        success: false,
        error: { message: 'Cart not found' }
      });
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
