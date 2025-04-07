// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import newsRoutes from "./routes/news.routes";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 8000;
// const MONGO_URI = process.env.MONGO_URI || "";

// app.use(express.json());
// app.use(cors());

// app.use("/news", newsRoutes);

// console.log("MONGO_URI: ", MONGO_URI);

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(PORT, () =>
//       console.log(`Server running on http://localhost:${PORT}`)
//     );
//   })
//   .catch((err) => console.error(err));

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import newsRoutes from "./routes/news.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(express.json());
app.use(cors());

// Debugging: Ensure this path is correctly registered
console.log(newsRoutes);

app.use("/api", newsRoutes);

console.log("MONGO_URI: ", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(err));
