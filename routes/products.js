const express = require('express');
const router = express.Router();
const { validateProduct, validateId } = require('../middleware/validation');
const Product = require('../models/product');

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      data: products
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: 'Product not found' }
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateProduct, async (req, res, next) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description || '',
      stock: req.body.stock || 0
    });
    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      data: savedProduct
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateId, validateProduct, async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        stock: req.body.stock
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: { message: 'Product not found' }
      });
    }

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        error: { message: 'Product not found' }
      });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
