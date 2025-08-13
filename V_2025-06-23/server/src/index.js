const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const cors = require('cors');

const users = require('./routes/users')
const books = require('./routes/books')
const flashcards = require('./routes/flashcards')

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI

// Middleware
app.use(cors());
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
app.use('/flashcards', flashcards)

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'pong,',
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

// MongoDB connection function with retry logic
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('📦 MongoDB already connected');
    return;
  }

  try {
    // Connection options optimized for Lambda
    const options = {
      maxPoolSize: 10, // Limit connection pool size for Lambda
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    console.log('📦 Connected to MongoDB!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    isConnected = false;
    
    // Don't exit in Lambda environment
    if (process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
      process.exit(1);
    }
  }
};

// Initialize connection
connectDB();

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error: ' + err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
  isConnected = false;
});

// Close the Mongoose connection when Node.js process ends
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// Only start the server if we're not in a Lambda environment
if (process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
  });
}

module.exports.handler = serverless(app);
