require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transaction');

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', transactionRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
