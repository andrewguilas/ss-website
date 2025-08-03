# SS Website

## TODO

### Phase 1 – Core Backend & CSV Upload (due 8/3)
- [x] Initialize project
- [x] Set up database
- [x] Upload CSV API
- [x] Parse orders in CSV API
- [x] View orders API
- [x] Auto-generate default route for orders & default truck for routes
- [ ] Create tests for error-handling
- [ ] Ensure logging covers all critical flows & errors
- [ ] Update docs for using API
- [ ] Prep for next phase

### Phase 2 – Web UI / Frontend (due 8/6)

### Phase 3 – Maps Integration

### Phase 4 – Order Photos

### Phase 5 – Mobile Optimization

## To Setup

```
pip install -r requirements.txt
```

## To Run

```
uvicorn app.main:app --reload   
```

## To Test

```
pytest -v
```

## Notes

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
