# BeatHub Index Strategy

## Phase 1: Query Pattern Identification

| ID | Description | Collection | Filter (Equality) | Sort | Range ($gt/$lt) |
|----|------------|------------|--------|------|-------|
| Q1 | Electronic Songs | Songs | genre | duration | - |
| Q2 | Recent Songs | Songs | - | releaseYear | releaseYear |
| Q3 | User Playlists | Playlists | user | - | - |
| Q4 | Artist Songs | Songs | artist | plays | - |
| Q5 | Active Users | Users | - | - | loginCount |

## Phase 2: Index Design & Justification

### Query 1: Electronic Songs by Duration
- **ESR:** Equality (genre) → Sort (duration)
- **Proposed Index:** `{ genre: 1, duration: -1 }`
- **Rationale:** Filters songs by genre first, then uses index order to return sorted results without in-memory sorting.

---

### Query 2: Recent Songs by Year
- **ESR:** Sort/Range (releaseYear)
- **Proposed Index:** `{ releaseYear: -1 }`
- **Rationale:** Same field used for filtering and sorting, so a single-field index is sufficient.

---

### Query 3: User Playlists
- **ESR:** Equality (user)
- **Proposed Index:** `{ user: 1 }`
- **Rationale:** Enables fast lookup of playlists for a specific user using foreign key indexing.

---

### Query 4: Artist Songs by Popularity
- **ESR:** Equality (artist) → Sort (plays)
- **Proposed Index:** `{ artist: 1, plays: -1 }`
- **Rationale:** Retrieves artist songs already sorted by popularity without additional processing.

---

### Query 5: High Activity Users
- **ESR:** Range (loginCount)
- **Proposed Index:** `{ loginCount: 1 }`
- **Rationale:** Efficiently filters users with loginCount greater than a threshold.

---

## Phase 3: Performance Validation
### Query 1
Before: COLLSCAN | 2000 docs
After: IXSCAN | 406 docs
Impact: Huge performance improvement

### Query 2
Before: COLLSCAN | 2000 docs
After: IXSCAN | 664 docs
Impact: Faster range query

### Query 3
Before: COLLSCAN | 400 docs
After: IXSCAN | 1 doc
Impact: Exact match optimization

### Query 4
Before: COLLSCAN | 2000 docs
After: IXSCAN | 75 docs
Impact: Sorted results without memory sort

### Query 5
Before: COLLSCAN | 200 docs
After: IXSCAN | 107 docs
Impact: Efficient filtering

---

## Phase 4: Index Risk & Trade-Off Analysis

### 1. How do these indexes impact write performance?
Each time a document is inserted, updated, or deleted, MongoDB must also update all associated indexes. This slightly slows down write operations because maintaining index structures (B-Trees) requires additional computation and storage updates.

---

### 2. Are we over-indexing?
No. The indexes are carefully designed based on real query patterns. Also, compound indexes are used efficiently to avoid redundant single-field indexes (e.g., `{ artist: 1 }` is covered by `{ artist: 1, plays: -1 }`).

---

### 3. Which index is most critical to application survival?
The `{ genre: 1, duration: -1 }` index is the most critical because it supports content discovery (core feature of BeatHub). Without it, the main feed would require scanning thousands of songs, causing severe performance issues.

---

### 4. Which index would you remove first if RAM became expensive?
The `{ loginCount: 1 }` index would be removed first because it supports analytics (secondary feature), not core user experience. Removing it has minimal impact on daily app usage.

---

## Bonus: Advanced Index Strategy

### Unique Index on Email

db.users.createIndex({ email: 1 }, { unique: true })
