require('dotenv').config();
const express = require('express');
const { connectionDB } = require('./config/dbconfig');
const cors = require('cors');

// Buat server Express
const app = express();

// Koneksi Database
connectionDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));