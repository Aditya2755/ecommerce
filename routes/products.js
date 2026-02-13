const express = require('express');
const router = express.Router();
const { validateProduct, validateId } = require('../middleware/validation');

let products = [];
let productIdCounter = 1;

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: products
  });
});

router.get('/:id', validateId, (req, res, next) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
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
});

router.post('/', validateProduct, (req, res) => {
  const newProduct = {
    id: productIdCounter++,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description || '',
    stock: req.body.stock || 0,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  res.status(201).json({
    success: true,
    data: newProduct
  });
});

router.put('/:id', validateId, validateProduct, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Product not found' }
    });
  }
  products[productIndex] = {
    ...products[productIndex],
    name: req.body.name,
    price: req.body.price,
    description: req.body.description || products[productIndex].description,
    stock: req.body.stock !== undefined ? req.body.stock : products[productIndex].stock,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: products[productIndex]
  });
});

router.delete('/:id', validateId, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Product not found' }
    });
  }
  products.splice(productIndex, 1);
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

module.exports = router;
