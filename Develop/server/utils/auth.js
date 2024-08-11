const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

const authMiddleware = ({ req }) => {
  // Check for token in the headers
  let token = req.headers.authorization || '';

  // Bearer token prefix is optional
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft();
  }

  // If no token, skip user authentication
  if (!token) {
    return { user: null };
  }

  try {
    // Decode and verify the token
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    // Find and return the user associated with the token
    const user = User.findById(data._id).exec();
    return { user };
  } catch {
    console.error('Invalid token');
    return { user: null };
  }
};

module.exports = { authMiddleware };