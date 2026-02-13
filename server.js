const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', productsRoutes);
app.use('/users', usersRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
