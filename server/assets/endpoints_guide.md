### GET users/results (auth required)
- **Headers:**
  - Authorization: Bearer <token>
- **Response:**
```json
[
  {
    "id": 1,
    "started_at": "2025-07-29T12:00:00.000Z",
    "ended_at": "2025-07-29T12:10:00.000Z",
    "category": "General Knowledge",
    "total_questions": 5,
    "score": 3,
    "correct_answers": 3,
    "questions": [
      {
        "question_id": 1,
        "was_correct": true,
        "question_order": 1,
        "category": "General Knowledge",
        "difficulty": 2,
        "question_text": "What is the capital of France?",
        "correct_answer": "Paris",
        "question_type": "short_answer",
        "choice_a": "London",
        "choice_b": "Berlin",
        "choice_c": "Madrid",
        "choice_d": "Paris",
        "image_url": null
      }
      // ...more question objects
    ]
  }
  // ...more game objects
]
```
# API Endpoints Guide

## Users

### POST users/register
- **Request Body:**
```json
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```
- **Response:**
```json
{
  "id": 1,
  "username": "exampleUser",
  "join_date": "2025-07-29T12:00:00.000Z",
  "all_time_score": 0,
  "games_played": 0,
  "high_score": 0,
  "is_admin": false
}
```

### POST users/login
- **Request Body:**
```json
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```
- **Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJwaGlsIiwiaXNfYWRtaW4iOmZhbHNlLCJpYXQiOjE3NTM4MDA0NTMsImV4cCI6MTc1MzgwNDA1M30.gIIHOOeZdd5R3aOGOsCdCSCDImUj01VALBi4n9bJjvI",
  "user": {
    "id": 1,
    "username": "phil",
    "join_date": "2025-07-29T13:44:20.597Z",
    "all_time_score": 0,
    "games_played": 0,
    "high_score": 0,
    "is_admin": false
  }
}
```

### PATCH users/update (auth required)
- **Headers:**
  - Authorization: Bearer <token>
- **Request Body:**
```json
{
  "username": "newUsername"
}
```
- **Response:**
```json
{
  "id": 1,
  "username": "newUsername",
  "join_date": "2025-07-29T12:00:00.000Z",
  "all_time_score": 100,
  "games_played": 10,
  "high_score": 50,
  "is_admin": false
}
```

### GET users/:id
- **Headers:**
  - Authorization: Bearer <token>
- **Response:**
```json
{
  "id": 1,
  "username": "exampleUser",
  "join_date": "2025-07-29T12:00:00.000Z",
  "all_time_score": 0,
  "games_played": 0,
  "high_score": 0,
  "is_admin": false
}
---

### DELETE users/delete
- **Headers:**
  - Authorization: Bearer <token>
- **Response:**
```json
{
  "message": "User deleted successfully"
}
---

## Games

### POST /games/start (auth required)
- **Headers:**
  - Authorization: Bearer <token>
- **Request Body:**
```json
{
  "user_id": 1,
  "category": "General Knowledge",
  "num_questions": 5
}
```
- **Response:**
```json
{
  "game": {
    "id": 1,
    "user_id": 1,
    "category": "General Knowledge",
    "total_questions": 5,
    "score": 0,
    "started_at": "2025-07-29T12:00:00.000Z",
    "ended_at": null,
    "correct_answers": 0
  },
  "game_questions": [
    {
      "id": 1,
      "category": "General Knowledge",
      // ...other question fields
    }
    // ...
  ]
}
```

### PATCH /:game_id/submit (auth required)
- **Headers:**
  - Authorization: Bearer <token>
- **Request Body:**
```json
[
  { "question_id": 1, "was_correct": true },
  { "question_id": 2, "was_correct": false }
]
```
- **Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "category": "General Knowledge",
  "total_questions": 5,
  "score": 3,
  "started_at": "2025-07-29T12:00:00.000Z",
  "ended_at": "2025-07-29T12:10:00.000Z",
  "correct_answers": 3
}
```

---

## Questions

### GET /questions/
- **Response:**
```json
[
  {
    "id": 1,
    "category": "General Knowledge",
    "difficulty": 2,
    "question_text": "What is the capital of France?",
    "correct_answer": "Paris",
    // ...other fields
  }
  // ...
]
```

### GET /questions/:id
- **Response:**
```json
{
  "id": 1,
  "category": "General Knowledge",
  "difficulty": 2,
  "question_text": "What is the capital of France?",
  "correct_answer": "Paris"
  // ...other fields
}
```

### POST /questions/
```json
{
  "category": "General Knowledge",
  "difficulty": 2,
  "question_text": "What is the capital of France?",
  "correct_answer": "Paris"
}
```
- **Response:**
```json
{
  "id": 2,
  "category": "General Knowledge",
  "difficulty": 2,
  "question_text": "What is the capital of France?",
  "correct_answer": "Paris"
  // ...other fields
}

### PATCH /questions/:id
- **Request Body:**
```json
{
  "question_text": "Updated question text"
}
```
- **Response:**
```json
{
  "id": 1,
  "question_text": "Updated question text"
  // ...other fields
}
```

### DELETE /questions/:id
- **Response:**
```json
{
  "message": "Question deleted"
}
```