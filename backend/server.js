const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server;
