// File: server/utils/generateToken.js
// Purpose: Helper to sign JWT access tokens for authenticated users

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  // Minimal payload to keep token small; user data loaded from DB when needed
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;

