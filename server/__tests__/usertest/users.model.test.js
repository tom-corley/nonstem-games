const db = require('../../database/connect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../../models/users');

jest.mock('../../database/connect');
jest.mock('bcrypt');               

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'dummyToken')
}));

describe('User model (mocked)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOneById()', () => {
    it('returns a User instance when user exists', async () => {
      const mockUserRow = { id: 1, username: 'alice', is_admin: false };
      db.query.mockResolvedValueOnce({ rows: [mockUserRow] });

      const user = await Users.getOneById(1);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1", [1]);
      expect(user).toBeInstanceOf(Users);
      expect(user.username).toBe('alice');
    });

    it('throws an error when user not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(Users.getOneById(999)).rejects.toThrow('Unable to locate user.');
    });
  });

  describe('authenticate()', () => {
    it('authenticates and returns token and user on success', async () => {
      const mockUserRow = {
        id: 2,
        username: 'bob',
        is_admin: false,
        password_hash: 'hashedpassword',
      };

      db.query.mockResolvedValueOnce({ rows: [mockUserRow] });
      bcrypt.compare.mockResolvedValueOnce(true);

      const result = await Users.authenticate('bob', 'correctpassword');

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE username = $1'), ['bob']);
      expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');

      // Here we expect jwt.sign called with secret undefined, matching your real code
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUserRow.id, username: mockUserRow.username, is_admin: mockUserRow.is_admin },
        undefined,
        { expiresIn: '1h' }
      );

      expect(result).toEqual({
        token: 'dummyToken',
        user: expect.any(Object),
      });
    });

    it('throws an error if username not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(Users.authenticate('nonexistent', 'pass')).rejects.toThrow('Unable to locate user.');
    });

    it('throws an error if password is incorrect', async () => {
      const mockUserRow = {
        id: 3,
        username: 'charlie',
        is_admin: false,
        password_hash: 'hashedpassword',
      };

      db.query.mockResolvedValueOnce({ rows: [mockUserRow] });
      bcrypt.compare.mockResolvedValueOnce(false);

      await expect(Users.authenticate('charlie', 'wrongpassword')).rejects.toThrow('Incorrect Password');
    });
  });


});
