import express from "express";
import dotenv from "dotenv";
import pool, { initializeDB } from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/events", eventRoutes);

pool
  .connect()
  .then(() => {
    initializeDB();
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
