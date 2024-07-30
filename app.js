const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/products', require('./routes/product_routes'));
app.use('/api/categories', require('./routes/category_routes'));
app.use('/api/users', require('./routes/auth_routes'));
app.use('/api/cart', require('./routes/cart_routes'));
app.use('/api/orders', require('./routes/order_routes'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
