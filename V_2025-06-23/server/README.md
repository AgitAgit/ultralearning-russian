# Ultralearning Russian - Express Server

A basic Node.js/Express server for the Ultralearning Russian project.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
NODE_ENV=development
```

3. Install nodemon for development (optional):
```bash
npm install -g nodemon
```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Available Endpoints

- `GET /` - Welcome message and server status
- `GET /health` - Health check endpoint
- `GET /api/hello` - Sample API endpoint

## Features

- ✅ Express.js server setup
- ✅ Environment variable support with dotenv
- ✅ CORS middleware for development
- ✅ JSON body parsing
- ✅ Error handling middleware
- ✅ 404 route handling
- ✅ Health check endpoint
- ✅ Structured logging

## Project Structure

```
server/
├── src/
│   └── index.js          # Main server file
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Next Steps

- Add database connection (MongoDB, PostgreSQL, etc.)
- Implement authentication middleware
- Add more API routes for Russian learning features
- Set up testing framework
- Add input validation
- Implement rate limiting 