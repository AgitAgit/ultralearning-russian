const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const users = require('./routes/users')
const books = require('./routes/books')

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (for development)
// TODO: add a check if the server is running in dev mode.
// If not, limit the allowed origin to the deployed client?
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


// routes
app.use('/users', users)
app.use('/books', books)

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Ultralearning Russian API',
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Sample API route
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from the API!',
    data: {
      language: 'Russian',
      project: 'Ultralearning'
    }
  });
});

// 404 handler
//this is causing a crash
// app.use('*', (req, res) => {
//   res.status(404).json({
//     error: 'Route not found',
//     path: req.originalUrl
//   });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('📦 Connected to MongoDB!');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        // It's often good practice to exit if the DB connection is critical for the app
        // process.exit(1);
    });

mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

// Close the Mongoose connection when Node.js process ends
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});
