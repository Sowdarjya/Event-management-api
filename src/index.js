import express from "express";
import dotenv from "dotenv";
import pool, { initializeDB } from "./db/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

pool
  .connect()
  .then(() => {
    initializeDB();
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
