import express from "express";
import {
  createEvent,
  getEventDetails,
  registerForEvent,
  unregisterFromEvent,
} from "../controllers/events.controller.js";

const router = express.Router();

router.post("/create", createEvent);
router.get("/get-event-details/:id", getEventDetails);
router.post("/:id/register", registerForEvent);
router.delete("/:id/unregister", unregisterFromEvent);

export default router;
