const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');

const { QueryTypes } = require('sequelize')
const seq = require('../config/db');

// Protect Routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization
    && req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exits
  if (!token) {
    return res.status(401).json({ success: false, msg: 'You are not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const  user = await seq.query(
      `SELECT * FROM users WHERE id=${decoded.id}`,
      {
        nest: true,
        type: QueryTypes.SELECT
      }
    );
    if(!user.length){
      throw new Error('Invalid token');
    }
    req.user = user[0];
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, msg: 'Invalid token' });
  }
});

module.exports = protect;