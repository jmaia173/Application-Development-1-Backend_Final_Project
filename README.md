# Sports League Management API

A REST API for managing recreational sports leagues, built with Node.js, Express, Sequelize, and SQLite. This project was inspired by the disorganized nature of recreational soccer leagues — schedules lost in group chats, rosters never updated, standings tracked manually. This API solves that by providing a structured backend system for managing teams, players, and games.

## Technologies Used

- Node.js / Express.js
- Sequelize ORM
- SQLite
- Jest + Supertest (testing)
- Nodemon (development)
- dotenv

## Getting Started

### Prerequisites
- Node.js installed
- npm installed

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

Tests use an in-memory SQLite database and do not affect your development data.

---

## API Endpoints

### Users

| Method | URL | Description |
|--------|-----|-------------|
| GET | /users | Get all users |
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

#### POST /users — Response (201)
```json
{
  "id": 1,
  "name": "Joao Maia",
  "email": "joao@league.com",
  "role": "admin",
  "updatedAt": "2026-04-11T00:00:00.000Z",
  "createdAt": "2026-04-11T00:00:00.000Z"
}
```

---

### Teams

| Method | URL | Description |
|--------|-----|-------------|
| GET | /teams | Get all teams (includes coach and players) |
| GET | /teams/:id | Get team by ID |
| POST | /teams | Create a new team |
| PUT | /teams/:id | Update a team |
| DELETE | /teams/:id | Delete a team |

#### POST /teams — Request Body
```json
{
  "name": "Ashland FC",
  "sport": "Soccer",
  "homeLocation": "Ashland Sports Park",
  "coachId": 2
}
```

#### POST /teams — Response (201)
```json
{
  "id": 1,
  "name": "Ashland FC",
  "sport": "Soccer",
  "homeLocation": "Ashland Sports Park",
  "coachId": 2,
  "updatedAt": "2026-04-11T00:00:00.000Z",
  "createdAt": "2026-04-11T00:00:00.000Z"
}
```

---

### Players

| Method | URL | Description |
|--------|-----|-------------|
| GET | /players | Get all players (includes team info) |
| GET | /players/:id | Get player by ID |
| POST | /players | Create a new player |
| PUT | /players/:id | Update a player |
| DELETE | /players/:id | Delete a player |

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

#### POST /players — Response (201)
```json
{
  "id": 1,
  "name": "Pedro Alves",
  "position": "Forward",
  "jerseyNumber": 9,
  "goals": 0,
  "assists": 0,
  "teamId": 1,
  "updatedAt": "2026-04-11T00:00:00.000Z",
  "createdAt": "2026-04-11T00:00:00.000Z"
}
```

---

### Games

| Method | URL | Description |
|--------|-----|-------------|
| GET | /games | Get all games (includes home and away team info) |
| GET | /games/:id | Get game by ID |
| POST | /games | Create a new game |
| PUT | /games/:id | Update a game |
| DELETE | /games/:id | Delete a game |

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

#### POST /games — Response (201)
```json
{
  "id": 1,
  "date": "2026-05-01",
  "location": "Ashland Sports Park",
  "homeScore": 0,
  "awayScore": 0,
  "homeTeamId": 1,
  "awayTeamId": 2,
  "updatedAt": "2026-04-11T00:00:00.000Z",
  "createdAt": "2026-04-11T00:00:00.000Z"
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
| 404 | Resource not found |
| 500 | Internal server error |

---

## Future Improvements

- JWT authentication and login/registration
- Role-based authorization (admin, coach, player)
- League standings calculation
- Player statistics tracking
- Cloud deployment to Render