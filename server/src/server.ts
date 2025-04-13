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
import signUpRouter from "./routes/signUpRouter";
import loginRouter from "./routes/loginRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(express.json());
app.use(cors());

// app.use("/api", newsRoutes);

app.use("/api", signUpRouter);
app.use("/api", loginRouter);
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
