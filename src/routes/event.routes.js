import express from "express";
import {
  createEvent,
  getEventDetails,
  getUpcomingEvents,
  registerForEvent,
  unregisterFromEvent,
} from "../controllers/events.controller.js";

const router = express.Router();

router.post("/create", createEvent);
router.get("/get-event-details/:id", getEventDetails);
router.post("/:id/register", registerForEvent);
router.delete("/:id/unregister", unregisterFromEvent);
router.get("/upcoming-events", getUpcomingEvents);

export default router;
