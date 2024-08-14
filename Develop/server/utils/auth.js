const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure the correct path to your User model

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  authMiddleware: async function ({ req }) {
    // Allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return { user: null };
    }

    try {
      // Verify token and extract user data
      const { data } = jwt.verify(token, secret);
      
      // Find the user by ID (if you need to access user details)
      const user = await User.findById(data._id).select('-__v');

      return { user };
    } catch (err) {
      console.error('Invalid token', err);
      return { user: null };
    }
  },
  signToken: function ({ firstName, email, _id }) {
    const payload = { firstName, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
