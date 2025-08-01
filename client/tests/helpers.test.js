const { storeToken, getToken } = require('../scripts/helpers/helpers.js');

// Mock localStorage
global.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(() => 'abc123')
};

// Test the storeToken function
describe('storeToken', () => {
  it('stores token in localStorage with token key', () => {
    // Call the function with a test token
    storeToken('abc123');
    // Check that localStorage.setItem was called with correct key and value
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc123');
  });
});

// Test the getToken function
describe('getToken', () => {
  it('gets token from localStorage with token key', () => {
    // Call the function and check it returns the mocked value
    expect(getToken()).toBe('abc123');
  });
});
