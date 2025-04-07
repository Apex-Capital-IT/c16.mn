import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const DB_URL: string = process.env.DB_URL || "";
export const PORT: number = Number(process.env.PORT) || 8000;

export const connectDataBase = async (): Promise<void> => {
  try {
    await connect(DB_URL);
    console.log("✅ Database холбогдлоо");
  } catch (err) {
    console.error("❌ Database холболт амжилтгүй боллоо:", err);
    process.exit(1);
  }
};
