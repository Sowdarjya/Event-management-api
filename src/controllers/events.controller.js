import pool from "../db/db.js";

export const createEvent = async (req, res) => {
  try {
    const { title, date_time, location, capacity } = req.body;

    if (!title || !date_time || !location || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEvent = await pool.query(
      "SELECT * FROM events WHERE title = $1",
      [title]
    );
    if (existingEvent.rows.length > 0) {
      return res.status(400).json({ message: "Event already exists" });
    }

    const event = await pool.query(
      "INSERT INTO events (title, date_time, location, capacity) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, date_time, location, capacity]
    );

    return res
      .status(201)
      .json({ message: "Event created successfully", event: event.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
