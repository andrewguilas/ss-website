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
- [x] Show orders, routes, & trucks in table
- [x] Upload .csv of raw order list
- [ ] Style website
- [x] Edit orders
  - [x] Edit order details
  - [x] Assign a route to an order
- [ ] Edit routes
  - [ ] Add routes
  - [x] Edit routes
  - [ ] Delete routes
  - [x] Assign a truck to a route
  - [ ] Reorder orders within a route
- [ ] Edit trucks
  - [ ] Add trucks
  - [x] Edit trucks
  - [ ] Delete trucks
- [] Other
  - [ ] Update API docs
  - [ ] Create tests for route_service.py and truck_service.py

### Phase 3 – Order Photos
- [ ] Separate app to connect to storagescholars.com
  - [ ] Pull orders from website
  - [ ] Download order photos
  - [ ] Set up AWS to save photos (if needed)
- [ ] Bridge ss-website.com and storagescholars.com
  - [ ] Match each order
  - [ ] Add photos for each order

### Phase 4 – Map Integration
- [ ] Show map of all the orders in a route

### Phase 5 – Mobile Optimization
- [ ] Host website on Heroku
- [ ] Add support for mobile website

---

## SECTION 2: TO USE

### To Set Up

#### 1. In terminal 1 (backend)
1.1 Create `/backend/.env`
```
# /backend/.env
OPENAI_API_KEY=
```

1.2 Install libraries
```
> cd backend
> python -m venv .venv
> ./venv/Scripts/activate
> pip install -r requirements.txt
```

#### 2. In terminal 2 (frontend)
2.1 Install libraries
```
> cd frontend
> npm install
```

---

### To Run

#### 1. In terminal 1 (backend)
```
> uvicorn main:app --reload
```

#### 2. In terminal 2 (frontend)
```
> npm run frontend
```

---

### To Test

#### 1. In terminal 1 (backend)
```
> pytest -v
```

#### 2. In terminal 2 (frontend)
```
TBD
```

---

## SECTION 3: API DOCUMENTATION

See [API.md](API.md)

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
