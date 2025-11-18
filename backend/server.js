const Sentry = require('@sentry/node');

// Sentry initialization 
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
});

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db.js');

// Import Routes
const authRoutes = require('./routes/authRoutes.js');
const farmerRoutes = require('./routes/farmerRoutes.js');
const activityRoutes = require('./routes/activityRoutes.js');
const collectionRoutes = require('./routes/collectionRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');

// Config
dotenv.config();

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
const PORT = process.env.PORT || 5000;

// Make io accessible in controllers
global.io = io;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security headers
app.use(helmet());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/ai', aiRoutes);

// Sentry error handler 
app.use(Sentry.expressErrorHandler());

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AgriTrace AI backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Listener
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;