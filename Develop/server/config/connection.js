const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/googlebooks', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    mongoose.connection.close(); // Close the connection after testing
  })
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose.connection;
