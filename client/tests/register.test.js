const registerUser = require('../scripts/register.js');

// Mock global browser APIs that our function uses
global.fetch = jest.fn();
global.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn()
};

describe('registerUser', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    fetch.mockClear();
    localStorage.setItem.mockClear();
  });

  // Test successful registration and login flow
  it('registers and logs in a user, storing the token', async () => {
    // Mock successful registration response
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ user: { username: 'test' } }) }) // register
      // Mock successful login response with token
      .mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'abc123', user: { username: 'test' } }) }); // login

    const result = await registerUser('test', 'pass');
    // Check that fetch was called twice (once for register, once for login)
    expect(fetch).toHaveBeenCalledTimes(2);
    // Check that token was stored in localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc123');
    // Check that the function returns the login data
    expect(result.token).toBe('abc123');
  });

});