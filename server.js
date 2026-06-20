const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // This safely reads your hidden variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/applications', require('./routes/application'));

// Connect to MongoDB Atlas safely using the environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch(err => console.error('Database connection error:', err));

// Base Test Route
app.get('/', (req, res) => {
    res.send('ESAPAG Backend API is running successfully!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});