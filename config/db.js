const dns = require('dns');
const mongoose = require('mongoose');

// Configure reliable DNS servers to resolve MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  // Ignore in environments where overriding DNS is restricted
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_management';

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'school_management'
    });
    console.log(`MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    if (uri.includes('mongodb+srv')) {
      console.error('Atlas Tip: Ensure your current IP is whitelisted in MongoDB Atlas Network Access and credentials are valid.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
