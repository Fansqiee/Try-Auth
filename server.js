require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/dbconfig');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Inisialisasi aplikasi
const app = express();

// Middleware dasar
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Koneksi database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: 'Connected',
    timestamp: new Date()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  console.log('\n🛑 Menerima sinyal terminasi');
  try {
    await sequelize.close();
    console.log('📦 Koneksi database ditutup');
    process.exit(0);
  } catch (err) {
    console.error('Gagal menutup koneksi:', err);
    process.exit(1);
  }
});