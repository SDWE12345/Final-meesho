// utils/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://v4x123:v4x123@cluster0.i3hnzcs.mongodb.net/meesho";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Extend the global type cache for HMR safety in Next.js dev mode
let cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise so the next call retries the connection
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
