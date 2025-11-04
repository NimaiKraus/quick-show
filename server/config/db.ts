import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URI;

export const connectDB = async () => {
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
