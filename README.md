# SS Website

## SECTION 1: TODO

### Phase 1 – Backend (due 8/3)
- [x] Initialize project
- [x] Set up database
- [x] Upload CSV API
- [x] Parse orders in CSV API
- [x] View orders API
- [x] Auto-generate default route for orders & default truck for routes
- [x] Create tests for error-handling. Update: Could not create tests for routers.
- [x] Ensure logging covers all critical flows & errors
- [x] Update docs for using API

### Phase 2 – Frontend (due 8/6)

### Phase 3 – Order Photos

### Phase 4 – Map Integration

### Phase 5 – Mobile Optimization

---

## SECTION 2: TO USE

### To Set Up

1. Install libraries

```
> pip install -r requirements.txt
```

2. Add secrets

```
# /.env
OPENAI_API_KEY=
```

---

### To Run

```
> uvicorn app.main:app --reload
```

In another terminal:

```
> npm run dev
```

---

### To Test

```
> pytest -v
```

---

## SECTION 3: API DOCUMENTATION

### Base URL
`/api`

### Endpoints

#### 1. GET /orders

Retrieve a list of all orders.

- **URL:** `/orders`
- **Method:** `GET`
- **Authentication:** None (add if applicable)
- **Query Parameters:** None
- **Request Body:** None
- **Response:**
  - **Status:** 200 OK
  - **Content-Type:** application/json
  - **Body:** Array of order objects, each containing:
    - `id` (int)
    - `campus` (string)
    - `name` (string)
    - `phone` (string)
    - `pronunciation` (string, optional)
    - `comments` (string, optional)
    - `pickup_date` (date)
    - `pickup_location` (string)
    - `dropoff_date` (date)
    - `dropoff_location` (string)
    - `item_count` (int)
    - `items` (string)
    - `route_id` (int, optional)
  - **Example:**
    ```json
    [
      {
        "id": 123,
        "campus": "University of Virginia",
        "name": "John Doe",
        "phone": "123-456-7890",
        "pronunciation": "jawn",
        "comments": "Call Proxy Jane at 555-1234.",
        "pickup_date": "2025-08-01",
        "pickup_location": "Dorm A, Room 101",
        "dropoff_date": "2025-08-10",
        "dropoff_location": "Apartment 5B",
        "item_count": 12,
        "items": "",
        "route_id": 10
      }
    ]
    ```
- **Errors:**  
  - 500 Internal Server Error on database failure.

#### 2. GET /routes

Retrieve a list of all routes.

- **URL:** `/routes`
- **Method:** `GET`
- **Authentication:** None (add if applicable)
- **Response:**  
  - **Status:** 200 OK  
  - **Content-Type:** application/json  
  - **Body:** Array of route objects, each containing:
    - `id` (int)
    - `date` (date)
    - `truck_id` (int)
  - **Example:**
    ```json
    [
      {
        "id": 1,
        "date": "2025-08-01",
        "truck_id": 5
      }
    ]
    ```
- **Errors:**  
  - 500 Internal Server Error on database failure.

#### 3. GET /trucks

Retrieve a list of all trucks.

- **URL:** `/trucks`
- **Method:** `GET`
- **Authentication:** None (add if applicable)
- **Response:**  
  - **Status:** 200 OK  
  - **Content-Type:** application/json  
  - **Body:** Array of truck objects, each containing:
    - `id` (int)
    - `comments` (string)
  - **Example:**
    ```json
    [
      {
        "id": 5,
        "comments": "Auto-generated for route on 2025-08-01"
      }
    ]
    ```
- **Errors:**  
  - 500 Internal Server Error on database failure.

#### 4. POST /upload-orders

Upload a CSV file containing orders to be processed and stored.

- **URL:** `/upload-orders`
- **Method:** `POST`
- **Authentication:** None (add if applicable)
- **Request:**
  - **Content-Type:** multipart/form-data
  - **Body:**
    - `file` (required): CSV file upload.
      - Must have `.csv` extension.
      - CSV must include columns like `OrderID`, `CampusName`, `ItemCount`, `FullName`, `StudentPhone`, `PickupDate`, `PickupLocation`, etc.
- **Processing:**
  - Validates file extension.
  - Parses CSV rows.
  - Skips rows where campus is not `"University of Virginia"` or `ItemCount` is zero.
  - Skips orders if `OrderID` already exists.
  - Creates orders and associated routes/trucks if needed.
- **Response:**
  - **Status:** 200 OK
  - **Content-Type:** application/json
  - **Body:** Summary of processing results:
    ```json
    {
      "inserted": 25,
      "skipped": 5
    }
    ```
- **Errors:**
  - 400 Bad Request if file is not CSV.
  - 500 Internal Server Error on parsing or database failures.
- **Logging:**
  - Warnings on duplicate orders or errors per row.
  - Info on total inserted and skipped counts.

### Notes

- All dates use ISO 8601 format: `YYYY-MM-DD`.
- Phone numbers and locations are parsed and normalized internally.
- The `pronunciation` field for names is generated via OpenAI API and may be `null`.
- The upload endpoint processes large CSVs with a progress bar visible on the backend (not to API clients).

---

## SECTION 4: OTHER NOTES

### Commit Guide
| Type | Purpose |
| ----- | ----- |
| feat | A new feature |
| fix | A bug fix |
| refactor | Code change that neither fixes a bug nor adds a feature |
| docs | Documentation only |
| style | Code formatting only (e.g., black, prettier) |
| test | Adding or updating tests |
| chore | Dev tool changes, config updates, deps — not user-facing behavior |
| perf | Performance improvements |
| ci | CI/CD pipeline changes |
| build | Changes to build scripts, Docker, etc. |
| revert | Reverts a previous commit |
