import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MongoDB URI is not defined in environment variables.");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    console.log("Using existing MongoDB connection...");
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);

    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("MongoDB connected...");
      return mongoose;
    }).catch((error) => {
      console.error("MongoDB connection failed:", error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });
  
(global as any).mongoose = cached;
