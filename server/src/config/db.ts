import mongoose from "mongoose";
import dns from "node:dns";

// Force Node's default resolver to use Google and Cloudflare DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
