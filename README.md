## E-commerce REST API (Node.js + MongoDB)

Simple backend for an e-commerce app with REST APIs for products, users, carts, and orders, using Express and MongoDB (Mongoose).

### Requirements

- **Node.js**: v18+ recommended  
- **MongoDB**: running locally or accessible via connection string

### Setup

- **Install dependencies**

```bash
npm install
```

- **Environment variables (optional)**

By default the app connects to:

```bash
mongodb://127.0.0.1:27017/ecommerce
```

You can override it with:

```bash
export MONGO_URI="your-mongodb-connection-string"
```

### Run the server

```bash
npm start
```

Expected console output on successful start:

```bash
Connected to MongoDB
Server running on port 3000
```

### API Routes

All responses are JSON with the shape:

- **success**: boolean  
- **data / error**: payload or error description

#### Products

- **GET** `/products` – list all products  
- **GET** `/products/:id` – get single product by MongoDB ID  
- **POST** `/products` – create product  
  - body: `{ "name", "price", "description?", "stock?" }`
- **PUT** `/products/:id` – update product  
  - body: same as create
- **DELETE** `/products/:id` – delete product

#### Users

- **GET** `/users` – list all users  
- **GET** `/users/:id` – get single user (password omitted)  
- **POST** `/users` – create user  
  - body: `{ "name", "email", "password" }`
- **PUT** `/users/:id` – update user  
  - body: `{ "name", "email", "password" }`
- **DELETE** `/users/:id` – delete user

#### Cart

Cart is stored per user.

- **GET** `/cart/:userId` – get or auto-create cart for user  
- **POST** `/cart/:userId/items` – add item to cart  
  - body: `{ "productId", "quantity" }`
- **PUT** `/cart/:userId/items/:itemId` – update quantity for an item  
  - body: `{ "quantity" }` (`itemId` is the product ID in the cart)
- **DELETE** `/cart/:userId/items/:itemId` – remove item from cart  
- **DELETE** `/cart/:userId` – clear cart

#### Orders

- **GET** `/orders` – list all orders  
- **GET** `/orders/:id` – get order by ID  
- **GET** `/orders/user/:userId` – list orders for a user  
- **POST** `/orders` – create order  
  - body:
    - `userId?` – optional user MongoDB ID
    - `items` – array of `{ "productId", "quantity" }`
    - `totalAmount` – number
    - `status?` – one of `pending | processing | shipped | delivered | cancelled` (default: `pending`)
- **PUT** `/orders/:id/status` – update order status  
  - body: `{ "status" }` (same allowed values as above)
- **DELETE** `/orders/:id` – delete order

