const jwt = require('jsonwebtoken');
const path = require('path');
const auth = require(path.resolve(__dirname, '../../../middleware/auth'));

jest.mock('jsonwebtoken');

describe('auth middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('calls next() if token is valid', () => {
    const mockUser = { id: 123 };
    req.headers.authorization = 'Bearer validtoken';

    // Simulate jwt.verify calling the callback with no error
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.SECRET_TOKEN, expect.any(Function));
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  it('returns 401 if no auth header', () => {
    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token required for endpoint.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 if token is invalid', () => {
    req.headers.authorization = 'Bearer badtoken';

    // Simulate jwt.verify calling callback with an error
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });
});
