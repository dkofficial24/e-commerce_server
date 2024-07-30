const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./utils/error_handler');

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler);

app.use('/api/products', require('./routes/product_routes'));
app.use('/api/categories', require('./routes/category_routes'));
app.use('/api/users', require('./routes/auth_routes'));
app.use('/api/cart', require('./routes/cart_routes'));
app.use('/api/orders', require('./routes/order_routes'));

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
