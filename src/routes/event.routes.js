import express from "express";
import { createEvent } from "../controllers/events.controller.js";

const router = express.Router();

router.post("/create", createEvent);

export default router;
