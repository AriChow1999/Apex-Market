const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./database-connection/db");
const { signup, login, updateUsername, updatePassword } = require('./controllers/authController');
const cors = require('cors');
const verifyToken = require('./middlewares/AuthMiddleware');
const uploadMiddleware = require('./middlewares/uploadMiddleware');
const { createProduct } = require('./controllers/productController');
const getProductsByCategory = require("./controllers/fetchProductController");
const deleteProduct = require("./controllers/deleteProductController");
const { getProductById } = require("./controllers/getProductController");
const cartFetch = require("./controllers/cartFetch");
const cartUpdate = require('./controllers/cartUpdation');
const { createOrder } = require("./controllers/createOrderController");
const { verifyPayment } = require("./controllers/verifyPaymentController");
const { getUserOrders } = require("./controllers/getUserOrders");
const email = require("./controllers/nodemailer");


// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Write the route paths directly here
app.post('/api/auth/signup', signup);
app.post('/api/auth/login', login);
app.post("/products-upload", uploadMiddleware, createProduct)

app.patch('/api/auth/update-username', verifyToken, updateUsername);
app.patch('/api/auth/update-password', verifyToken, updatePassword);

app.post("/api/products", getProductsByCategory);

app.delete("/products/:id", deleteProduct);

app.get("/product/:id", getProductById);

app.get("/api/cart", verifyToken, cartFetch);
app.post('/api/cart', verifyToken, cartUpdate);

app.post('/api/create-order', verifyToken, createOrder);
app.post('/api/verify-payment', verifyToken, verifyPayment);

app.get('/api/orders', verifyToken, getUserOrders);

app.post("/api/subscribe", email)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});