const request = require('supertest');
const app = require('../../app');
const User = require('../../models/Users');

jest.mock('../../models/Users');

// Mock the authenticate middleware to inject req.user
jest.mock('../../middleware/auth', () => (req, res, next) => {
  req.user = { id: 1 }; // simulate logged-in user with id=1
  next();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('User Routes', () => {
  it('POST /users/register - should create a new user', async () => {
    User.create.mockResolvedValue({
      id: 2,
      username: 'new_user',
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
    User.cleanGetOneById.mockResolvedValue({
      id: 1,
      username: 'test_user',
      is_admin: false,
    });

    const response = await request(app).get('/users/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'test_user');
  });

  it('PATCH /users/update - should update the username', async () => {
    User.updateUsername.mockResolvedValue({
      id: 1,
      username: 'updateduser',
      is_admin: false,
    });

    const response = await request(app)
      .patch('/users/update')
      .send({ username: 'updateduser' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'updateduser');
  });

  it('DELETE /users/delete - should delete the user and return 204', async () => {
    User.deleteUser.mockResolvedValue();

    const response = await request(app).delete('/users/delete');

    expect(response.statusCode).toBe(204);
    expect(response.body).toEqual({});
  });

  // Error handling cases

  it('GET /users/:id - invalid id returns 500 with error', async () => {
    User.cleanGetOneById.mockRejectedValue(new Error('Unable to locate user.'));

    const response = await request(app).get('/users/9999');

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('PATCH /users/update - server error returns 500', async () => {
    User.updateUsername.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .patch('/users/update')
      .send({ username: 'any_user' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('DELETE /users/delete - server error returns 500', async () => {
    User.deleteUser.mockRejectedValue(new Error('DB delete error'));

    const response = await request(app).delete('/users/delete');

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});
