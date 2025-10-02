import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

// .env fayldan o'zgaruvchilarni yuklash
dotenv.config();

// Mongoose ulanish
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('✅ MongoDB ga ulanish muvaffaqiyatli');
  })
  .catch((err) => {
    console.error('❌ MongoDB ulanishda xato:', err);
  });

// __dirname aniqlash (ESM muhitida)
const __dirname = path.resolve();

// Express ilovasini yaratish
const app = express();

// ✅ CORS middleware (hamma uchun ochiq, cookie ruxsat)
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body va cookie parser
app.use(express.json());
app.use(cookieParser());

// Static fayllarni servis qilish (React frontend uchun)
app.use(express.static(path.join(__dirname, '/client/dist')));

// API endpointlar
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// SPA fallback (React Router uchun)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishga tushdi`);
});
