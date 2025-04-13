// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import categoryRouter from "./routes/category.routes";
// import newsRouter from "./routes/news.routes";
// import budgetRouter from "./routes/budget.routes";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/categories", categoryRouter);
// app.use("/api/news", newsRouter);
// app.use("/api/budget", budgetRouter);

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGODB_URI!)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error);
//   });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
