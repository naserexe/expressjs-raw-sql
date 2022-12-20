const { QueryTypes } = require('sequelize')
const asyncHandler = require('../middlewares/async');
const seq = require('../config/db')

exports.createNewExpenses = asyncHandler(async (req, res, next) => {

  const { title, amount, type } = req.body

  const  [results, metadata] = await seq.query(
    `INSERT INTO expense (id, title, amount, type, createdAt) VALUES (NULL, '${title}', '${amount}', '${type}', current_timestamp())`,
    {
      nest: true,
      type: QueryTypes.INSERT
    }
  );

  res.status(201).json({ success: true, message: 'Expense created successfully', results, metadata });
});

exports.getAllExpenses = asyncHandler(async (req, res, next) => {

  const  expenses = await seq.query(
    `SELECT * FROM expense`,
    {
      nest: true,
      type: QueryTypes.SELECT
    }
  );

  res.status(200).json({ success: true, message: 'All expense fetched successfully', expenses });
});