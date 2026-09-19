const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {}

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middlewares - Dynamic CORS handling for localhost, 127.0.0.1 and CLIENT_URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Set limits high to support Base64 photo storage
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', time: new Date() });
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admissions', require('./routes/admissions'));
app.use('/api/records', require('./routes/records'));
app.use('/api/content', require('./routes/content'));

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Endpoint not found' });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Clean error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    message: req.app.get('env') === 'development' ? message : 'An unexpected server error occurred. Please contact support.',
    ...(req.app.get('env') === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
