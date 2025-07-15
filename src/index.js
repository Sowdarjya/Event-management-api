import express from "express";
import dotenv from "dotenv";
import pool from "./db/db.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

pool
  .connect()
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
