const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize')
const seq = require('../config/db');

const asyncHandler = require('../middlewares/async');

const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res
    .status(statusCode)
    .json({ success: true, token });
};

exports.register = asyncHandler(async (req, res) => {
  const user = req.body;

  if (!user.email || !user.password) throw new Error('Invalid request body');

  
  const  isUser = await seq.query(
    `SELECT * FROM users WHERE email='${user.email}'`,
    {
      nest: true,
      type: QueryTypes.SELECT
    }
  );

  if (isUser.length) throw new Error('Email already exist');

    // Generating salt for hashing password;
    const salt = await bcrypt.genSalt(10);

    // Hashing password before storing for database
    user.password = await bcrypt.hash(user.password, salt);
    user.email = user.email.toLowerCase();

    const  [results, metadata] = await seq.query(
      `INSERT INTO users (id, name, email, password, createdAt) VALUES (NULL,'${user.name}','${user.email}','${user.password}',current_timestamp())`,
      {
        nest: true,
        type: QueryTypes.INSERT
      }
    );

    const  newUser = await seq.query(
      `SELECT * FROM users WHERE id=${results}`,
      {
        nest: true,
        type: QueryTypes.SELECT
      }
    );

    sendTokenResponse(newUser[0], 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {

  const { email, password } = req.body;

  // Check for manager
  const  user = await seq.query(
    `SELECT * FROM users WHERE email='${email}'`,
    {
      nest: true,
      type: QueryTypes.SELECT
    }
  );

  if (!user.length) {
    throw new Error(`No user found!`);
  }
  const isMatch = await bcrypt.compare(password, user[0].password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  return sendTokenResponse(user[0], 200, res);
});

// get user
exports.getUser = asyncHandler(async (req, res) => {
  const  user = await seq.query(
    `SELECT * FROM users WHERE id=${req.user.id}`,
    {
      nest: true,
      type: QueryTypes.SELECT
    }
  );

  if (!user.length) {
    throw new Error(`No user found!`);
  }
  res.status(200).json({ success: true, message: 'Fetched current user', user: user[0] });
});