# World IQ Backend

## Overview
This backend powers the Nonstem Games application, providing a RESTful API for user management, quiz gameplay, and question management. It is built with Node.js, Express, and PostgreSQL, and follows a modular architecture for scalability and maintainability.

---

## Architecture
- **Express.js**: Handles HTTP requests and routing.
- **PostgreSQL**: Stores users, games, questions, and game results.
- **Models**: Encapsulate database logic for Users, Games, and Questions.
- **Controllers**: Contain business logic for each endpoint.
- **Middleware**: Includes authentication (JWT) and request logging.
- **Routes**: Define API endpoints for users, games, and questions.

### Directory Structure
- `models/` — Database models (Users, Games, Questions)
- `controllers/` — Request handlers for each resource
- `routes/` — Express routers for API endpoints
- `middleware/` — Auth and logger middleware
- `database/` — DB connection, setup, and seed scripts
- `assets/` — API documentation and database schema

---

## Database
- **Tables**: `users`, `games`, `questions`, `game_questions`
- **Setup**: Run `database/setup.js` to create tables and seed questions (see `database/seed_questions.sql`).
- **Schema**: See `assets/db_schema.png` for an ER diagram.
- **Seeding**: 50+ questions (80% multiple choice, 20% short answer) are seeded for Geography and History.

---

## Key Functionality

### User Management
- **Register/Login**: Secure password hashing (bcrypt), JWT authentication
- **Profile**: Fetch, update, or delete user data
- **Results**: Aggregate all games played by a user, including detailed question breakdowns

### Game Flow
- **Start Game**: Create a new game, randomly select questions by category
- **Submit Results**: Update game and question results, calculate score as a percentage
- **High Score**: User's best score is tracked and updated automatically

### Question Management
- **CRUD**: Create, read, update, and delete questions
- **Quiz Generation**: Random selection of questions for each game

### Middleware
- **Logger**: Logs each request with method, endpoint, and timestamp
- **Auth**: Protects sensitive endpoints using JWT

---

## API Endpoints
See [`assets/endpoints_guide.md`](./assets/endpoints_guide.md) for a full list of endpoints, request/response formats, and authentication requirements.


### Users
- `POST /users/register` — Register a new user
- `POST /users/login` — Login and receive JWT
- `GET /users/:id` — Get user profile
- `PATCH /users/update` — Update username (auth required)
- `DELETE /users/delete` — Delete user (auth required)
- `GET /users/results` — Get all game results for the authenticated user (auth required)

### Games (all require authentication)
- `POST /games/start` — Start a new game
- `PATCH /games/:game_id/submit` — Submit results for a game

### Questions
- `GET /questions/` — List all questions
- `GET /questions/:id` — Get a specific question by ID
- `POST /questions/` — Add a new question
- `PATCH /questions/:id` — Update a question
- `DELETE /questions/:id` — Delete a question

---

## Running the Server
1. Install dependencies: `npm install`
2. Set up environment variables in `.env` (see `.env.example`)
3. Set up the database: `npm run setup-db` (runs `database/setup.js`)
4. Start the server: `npm start`

---

## Testing
- Automated tests are in `__tests__/` (Jest)
- Run tests: `npm test`

---

## Additional Resources
- **Endpoints Guide**: [`assets/endpoints_guide.md`](./assets/endpoints_guide.md)
- **Database Schema**: [`assets/db_schema.png`](./assets/db_schema.png)

---

## Contact
For questions or issues, please contact the project maintainer on github @tom-corley.
