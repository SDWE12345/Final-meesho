// utils/mongodb.js
import mongoose from 'mongoose';
import User from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://v4x123:v4x123@cluster0.i3hnzcs.mongodb.net/meesho";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // If already connected, return the cached connection
  if (cached.conn) {
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    console.log('🔄 Connecting to MongoDB...');

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(async(mongoose) => {
        console.log('✅ MongoDB connected successfully');
        
        const user = await User.create({
          email,
          password,
          name,
          role,
          isEmailVerified: true,
        });

        console.log("🔥 Default admin created:", user.email);
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        // Reset promise so next attempt can retry
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Failed to establish MongoDB connection:', e.message);
    throw e;
  }

  return cached.conn;
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

export default connectToDatabase;
