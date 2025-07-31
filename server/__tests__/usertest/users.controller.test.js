const request = require('supertest');
const app = require('../../app');
const Users = require('../../models/users');

jest.mock('../../models/users');

// Mock the authenticate middleware to inject req.user
jest.mock('../../middleware/auth', () => (req, res, next) => {
  req.user = { id: 1 }; // simulate logged-in user with id=1
  next();
});

const testUserId = 1;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('User Routes', () => {
  // SUCCESS CASES

  it('POST /users/register - should create a new user', async () => {
    Users.create.mockResolvedValue({
      id: 2,
      username: 'new_user',
      all_time_score: 0,
      games_played: 0,
      high_score: 0,
      is_admin: false,
    });

    const response = await request(app)
      .post('/users/register')
      .send({ username: 'new_user', password: 'password123' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('new_user');
  });

  it('GET /users/:id - should return a single user by ID', async () => {
    Users.cleanGetOneById.mockResolvedValue({
      id: testUserId,
      username: 'test_user',
      all_time_score: 10,
      games_played: 5,
      high_score: 7,
      is_admin: false,
    });

    const response = await request(app).get(`/users/${testUserId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'test_user');
  });

  it('PATCH /users/update - should update the username', async () => {
    Users.updateUsername.mockResolvedValue({
      id: testUserId,
      username: 'updateduser',
      all_time_score: 10,
      games_played: 5,
      high_score: 7,
      is_admin: false,
    });

    const response = await request(app)
      .patch('/users/update')
      .send({ username: 'updateduser' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'updateduser');
  });

  it('DELETE /users/delete - should delete the user and return 204', async () => {
    Users.deleteUser.mockResolvedValue({ message: 'User deleted successfully.' });

    const response = await request(app).delete('/users/delete');

    expect(response.statusCode).toBe(204);
  });

  // ERROR HANDLING CASES

  it('GET /users/:id - invalid id should return 500 with error message', async () => {
    Users.cleanGetOneById.mockRejectedValue(new Error('Unable to locate user.'));

    const response = await request(app).get('/users/9999');

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('PATCH /users/update - server error returns 500', async () => {
    Users.updateUsername.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .patch('/users/update')
      .send({ username: 'any_user' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('DELETE /users/delete - server error returns 500', async () => {
    Users.deleteUser.mockRejectedValue(new Error('DB delete error'));

    const response = await request(app).delete('/users/delete');

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});
