# API Documentation

This document describes the API endpoints for uploading, reading, and editing orders, routes, and trucks.

---

## Upload Routes

### `POST /upload-orders`
**Description:**  
Upload a CSV file of orders. Each valid row creates an order (and, if needed, a route and truck).

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: CSV file (required)

**Response:**
- `200 OK`
    ```json
    {
      "inserted": <number of orders inserted>,
      "skipped": <number of orders skipped>
    }
    ```
- `400 Bad Request` if file is not a CSV.

---

### `DELETE /clear-database`
**Description:**  
Delete all orders, routes, and trucks from the database.

**Response:**
- `200 OK`
    ```json
    {
      "message": "Database cleared"
    }
    ```
- `500 Internal Server Error` if deletion fails.

---

## Read Routes

### `GET /orders`
**Description:**  
Get all orders.

**Response:**
- `200 OK`
    ```json
    [
      {
        "id": 1,
        "campus": "University of Virginia",
        "name": "Jane Doe",
        "phone": "555-1234",
        "pronunciation": "JAYN",
        "comments": "Call Proxy John at 555-5678.",
        "pickup_date": "2025-08-24",
        "pickup_location": "Dorm A, Room 101",
        "pickup_proxy_name": "John",
        "pickup_proxy_phone": "555-5678",
        "dropoff_date": "2025-08-25",
        "dropoff_location": "Dorm B, Room 202",
        "dropoff_proxy_name": "Mary",
        "dropoff_proxy_phone": "555-8765",
        "item_count": 3,
        "items": "Box, Suitcase, Lamp",
        "route_id": 2
      },
      ...
    ]
    ```

---

### `GET /routes`
**Description:**  
Get all routes.

**Response:**
- `200 OK`
    ```json
    [
      {
        "id": 2,
        "date": "2025-08-25",
        "driver_name": "Alex Smith",
        "comments": "Auto-assigned truck 1",
        "truck_id": 1
      },
      ...
    ]
    ```

---

### `GET /trucks`
**Description:**  
Get all trucks.

**Response:**
- `200 OK`
    ```json
    [
      {
        "id": 1,
        "model": "Ford Transit",
        "comments": "Main campus truck"
      },
      ...
    ]
    ```

---

## Edit Routes

### `PATCH /orders`
**Description:**  
Edit an order.

**Request Body:**
- JSON object with at least the `id` field and any fields to update.

**Example:**
```json
{
  "id": 1,
  "name": "New Name",
  "comments": "Updated comment"
}
```

**Response:**
- `200 OK`: Updated order object.
- `404 Not Found`: If order does not exist.

---

### `PATCH /routes`
**Description:**  
Edit a route.

**Request Body:**
- JSON object with at least the `id` field and any fields to update.

**Example:**
```json
{
  "id": 2,
  "driver_name": "Jane Doe",
  "truck_id": 3
}
```

**Response:**
- `200 OK`: Updated route object.
- `404 Not Found`: If route does not exist.
- `400 Bad Request`: If the truck is already assigned to another route on the same date.

---

### `PATCH /trucks`
**Description:**  
Edit a truck.

**Request Body:**
- JSON object with at least the `id` field and any fields to update.

**Example:**
```json
{
  "id": 1,
  "model": "New Model",
  "comments": "Updated comment"
}
```

**Response:**
- `200 OK`: Updated truck object.
- `404 Not Found`: If truck does not exist.

---

## Models

### Order
- `id`: int
- `campus`: str
- `name`: str
- `phone`: str | null
- `pronunciation`: str | null
- `comments`: str | null
- `pickup_date`: date | null
- `pickup_location`: str | null
- `pickup_proxy_name`: str | null
- `pickup_proxy_phone`: str | null
- `dropoff_date`: date | null
- `dropoff_location`: str | null
- `dropoff_proxy_name`: str | null
- `dropoff_proxy_phone`: str | null
- `item_count`: int | null
- `items`: str | null
- `route_id`: int | null

### Route
- `id`: int
- `date`: date
- `driver_name`: str | null
- `comments`: str | null
- `truck_id`: int

### Truck
- `id`: int
- `model`: str | null
- `comments`: str | null

---