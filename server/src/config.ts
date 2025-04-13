// import { connect } from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// export const DB_URL: string = process.env.DB_URL || "";
// export const PORT: number = Number(process.env.PORT) || 8000;

// export const connectDataBase = async (): Promise<void> => {
//   try {
//     await connect(DB_URL);
//     console.log("✅ Database холбогдлоо");
//   } catch (err) {
//     console.error("❌ Database холболт амжилтгүй боллоо:", err);
//     process.exit(1);
//   }
// };

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

export const connectDataBase = async () => {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      console.log("MongoDB connected successfully");
    } else {
      console.log("Mongo URI is not defined in the environment file.");
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};
