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

    if (capacity < 1 || capacity > 1000) {
      return res
        .status(400)
        .json({ message: "Capacity must be between 1 and 1000" });
    }

    const event = await pool.query(
      "INSERT INTO events (title, date_time, location, capacity) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, date_time, location, capacity]
    );

    return res
      .status(201)
      .json({ message: "Event created successfully", event: event.rows[0].id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getEventDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const eventResult = await pool.query("SELECT * FROM events WHERE id = $1", [
      id,
    ]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventResult.rows[0];
    const registrationIds = event.registrations || [];

    let registrations = [];
    if (registrationIds.length > 0) {
      const userIds = registrationIds.map((id) => id.id);
      const usersResult = await pool.query(
        "SELECT * FROM users WHERE id = ANY($1)",
        [userIds]
      );

      registrations = registrationIds.map((id) => {
        const user = usersResult.rows.find((user) => user.id === id.id);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          registered_at: id.registered_at,
        };
      });
    }

    return res.status(200).json({ event, registrations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const eventResult = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      id,
    ]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventResult.rows[0];

    if (new Date(event.date_time) < new Date()) {
      return res.status(400).json({ message: "Event has already started" });
    }

    const registrations = event.registrations || [];

    if (registrations.length >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    const userResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      user_id,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyRegistered = registrations.some(
      (registration) => registration.id === user_id
    );

    if (alreadyRegistered) {
      return res
        .status(400)
        .json({ message: "User is already registered for this event" });
    }

    const newRegistration = {
      id: user_id,
      registered_at: new Date().toISOString(),
    };

    registrations.push(newRegistration);

    await pool.query(`UPDATE events SET registrations = $1 WHERE id = $2`, [
      JSON.stringify(registrations),
      id,
    ]);

    return res
      .status(200)
      .json({ message: "User registered for event successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const unregisterFromEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const eventResult = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      id,
    ]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventResult.rows[0];
    const registrations = event.registrations || [];

    const registrationIndex = registrations.findIndex(
      (registration) => registration.id === user_id
    );

    if (registrationIndex === -1) {
      return res
        .status(400)
        .json({ message: "User is not registered for this event" });
    }

    registrations.splice(registrationIndex, 1);

    const updatedRegistrations =
      registrations.length > 0 ? registrations : null;

    await pool.query(`UPDATE events SET registrations = $1 WHERE id = $2`, [
      updatedRegistrations,
      id,
    ]);

    return res
      .status(200)
      .json({ message: "User unregistered from event successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
