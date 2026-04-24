# Sports League Management API

A REST API for managing recreational sports leagues, built with Node.js, Express, Sequelize, and SQLite. Inspired by the disorganized nature of recreational soccer leagues — schedules lost in group chats, rosters never updated, standings tracked manually — this API provides a structured backend system for managing teams, players, and games securely.

## Live Deployment

**Base URL:** https://sports-league-api.onrender.com

## Technologies Used

- Node.js / Express.js
- Sequelize ORM
- SQLite3
- bcryptjs (password hashing)
- JSON Web Tokens (JWT)
- Jest + Supertest (testing)
- Nodemon (development)
- dotenv

## Getting Started

### Prerequisites
- Node.js v20+
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jmaia173/Application-Development-1-Backend_Final_Project.git
cd Application-Development-1-Backend_Final_Project
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
PORT=3000
JWT_SECRET=your_secret_key_here

4. Set up the database:
```bash
npm run setup
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The API will be running at `http://localhost:3000`.

## Running Tests

```bash
npm test
```

Tests use an in-memory SQLite database and do not affect development data. Currently 44 tests passing.

---

## User Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| **admin** | League organizer | Full access to all endpoints |
| **coach** | Team coach | Read all, manage own team and players |
| **player** | Team player | Read-only access to all resources |

---

## Authentication Guide

### Register
**POST** `/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "player"
}
```

### Login
**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Returns a JWT token. Include it in all protected requests:
Authorization: Bearer <your_token_here>

### Logout
**POST** `/auth/logout` *(requires token)*

---

## API Endpoints

### Auth (Public)

| Method | URL | Description |
|--------|-----|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and receive JWT token |
| POST | /auth/logout | Logout (client deletes token) |

---

### Users *(admin only)*

| Method | URL | Description |
|--------|-----|-------------|
| GET | /users | Get all users |
| GET | /users/me | Get current logged in user |
| GET | /users/:id | Get user by ID |
| POST | /users | Create a new user |
| PUT | /users/:id | Update a user |
| DELETE | /users/:id | Delete a user |

#### POST /users — Request Body
```json
{
  "name": "Joao Maia",
  "email": "joao@league.com",
  "password": "password123",
  "role": "admin"
}
```

---

### Teams *(authenticated)*

| Method | URL | Auth Required | Description |
|--------|-----|---------------|-------------|
| GET | /teams | Any role | Get all teams |
| GET | /teams/:id | Any role | Get team by ID |
| GET | /teams/:id/players | Any role | Get all players for a team |
| GET | /teams/:id/games | Any role | Get all games for a team |
| POST | /teams | Admin only | Create a new team |
| PUT | /teams/:id | Admin or own coach | Update a team |
| DELETE | /teams/:id | Admin only | Delete a team |

#### POST /teams — Request Body
```json
{
  "name": "Ashland FC",
  "sport": "Soccer",
  "homeLocation": "Ashland Sports Park",
  "coachId": 2
}
```

---

### Players *(authenticated)*

| Method | URL | Auth Required | Description |
|--------|-----|---------------|-------------|
| GET | /players | Any role | Get all players |
| GET | /players/:id | Any role | Get player by ID |
| GET | /players/search | Any role | Search/filter players |
| POST | /players | Admin or coach | Create a new player |
| PUT | /players/:id | Admin or own coach | Update a player |
| DELETE | /players/:id | Admin or own coach | Delete a player |

#### Search Parameters
- `/players/search?position=Forward` — filter by position
- `/players/search?teamId=1` — filter by team
- `/players/search?name=Pedro` — search by name

#### POST /players — Request Body
```json
{
  "name": "Pedro Alves",
  "position": "Forward",
  "jerseyNumber": 9,
  "goals": 0,
  "assists": 0,
  "teamId": 1
}
```

---

### Games *(authenticated)*

| Method | URL | Auth Required | Description |
|--------|-----|---------------|-------------|
| GET | /games | Any role | Get all games |
| GET | /games/:id | Any role | Get game by ID |
| GET | /games/upcoming | Any role | Get upcoming games |
| GET | /games/results | Any role | Get past game results |
| POST | /games | Admin only | Create a new game |
| PUT | /games/:id | Admin only | Update a game |
| DELETE | /games/:id | Admin only | Delete a game |

#### POST /games — Request Body
```json
{
  "date": "2026-05-01",
  "location": "Ashland Sports Park",
  "homeScore": 0,
  "awayScore": 0,
  "homeTeamId": 1,
  "awayTeamId": 2
}
```

---

## Error Handling

All errors return JSON in this format:

```json
{
  "error": "Error message here"
}
```

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation error / bad request |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient permissions |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Sample Seed Data

The seed script creates:
- 8 users (1 admin, 2 coaches, 5 players)
- 4 teams (Ashland FC, Medford United, Rogue Valley SC, Southern Oregon FC)
- 12 players across all teams
- 8 scheduled games

**Admin login:**
- Email: `carlos@league.com`
- Password: `password123`

**Coach login:**
- Email: `marco@league.com`
- Password: `password123`

---

## Future Improvements

- League standings calculation
- Player statistics dashboard
- Match bracket/tournament support
- Email notifications for game schedules
- Refresh token support