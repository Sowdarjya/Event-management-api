# **Event Management API**

## **Setup Instructions**

1. Clone the repository: `git clone https://github.com/Sowdarjya/Event-management-api.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following environment variables:
   - `PORT`
   - `DB_USER`
   - `DB_HOST`
   - `DB_NAME`
   - `DB_PASSWORD`
   - `DB_PORT`
4. Run the application: `npm run dev`

## **API Description**

The Event Management API provides endpoints for creating, retrieving, and managing events and users. The API uses a PostgreSQL database to store event and user data.

### Endpoints

#### Users

- **Create User**: `POST /api/users/create`
  - Request Body: `{ name, email }`
  - Response: `{ id, name, email }`

#### Events

- **Create Event**: `POST /api/events/create`
  - Request Body: `{ title, date_time, location, capacity }`
  - Response: `{ id, title, date_time, location, capacity }`
- **Get Event Details**: `GET /api/events/get-event-details/:id`
  - Request Parameters: `id` (event ID)
  - Response: `{ event, registrations }`
- **Get Upcoming Events**: `GET /api/events/upcoming-events`
  - Response: `[ { id, title, date_time, location, capacity } ]`
- **Get Event Stats**: `GET /api/events/get-event-stats/:id`
  - Request Parameters: `id` (event ID)
  - Response: `{ total_registrations, remaining_capacity, percentage_used }`

#### Registrations

- **Register for Event**: `POST /api/events/:id/register`
  - Request Parameters: `id` (event ID)
  - Request Body: `{ user_id }`
  - Response: `{ message }`
- **Unregister from Event**: `DELETE /api/events/:id/unregister`
  - Request Parameters: `id` (event ID)
  - Request Body: `{ user_id }`
  - Response: `{ message }`

## **Example Requests/Responses**

### Create User

Request:

```bash
curl -X POST \
  http://localhost:3000/api/users/create \
  -H 'Content-Type: application/json' \
  -d '{"name": "John Doe", "email": "john.doe@example.com"}'
```

Response:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### Create Event

Request:

```bash
curl -X POST \
  http://localhost:3000/api/events/create \
  -H 'Content-Type: application/json' \
  -d '{"title": "Example Event", "date_time": "2023-03-01T14:00:00", "location": "Example Location", "capacity": 100}'
```

Response:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Example Event",
  "date_time": "2023-03-01T14:00:00",
  "location": "Example Location",
  "capacity": 100
}
```

### Get Event Details

Request:

```bash
curl -X GET \
  http://localhost:3000/api/events/get-event-details/123e4567-e89b-12d3-a456-426614174000
```

Response:

```json
{
  "event": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Example Event",
    "date_time": "2023-03-01T14:00:00",
    "location": "Example Location",
    "capacity": 100
  },
  "registrations": []
}
```
