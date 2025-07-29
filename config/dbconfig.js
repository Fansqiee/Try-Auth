require('dotenv').config();
const { Sequelize } = require('sequelize');

// Konfigurasi koneksi database
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Untuk development, di production gunakan CA
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    freezeTableName: true, // Hindari pluralisasi otomatis
    timestamps: true // Aktifkan createdAt dan updatedAt
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Fungsi untuk koneksi dan sinkronisasi database
const connectDB = async () => {
  try {
    // Test koneksi
    await sequelize.authenticate();
    console.log('✅ Koneksi ke Supabase PostgreSQL berhasil!');
    
    // Sinkronisasi model dengan database (Hanya untuk development)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Model database berhasil disinkronisasi');
    }
    
    // Test query
    const [result] = await sequelize.query('SELECT NOW() as waktu_sekarang');
    console.log('⏱ Waktu database:', result[0].waktu_sekarang);
  } catch (error) {
    console.error('❌ Gagal terhubung ke database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };