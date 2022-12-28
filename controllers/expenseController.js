const { QueryTypes } = require('sequelize')
const asyncHandler = require('../middlewares/async');
const seq = require('../config/db')

exports.createNewExpenses = asyncHandler(async (req, res, next) => {

  const { title, amount, type, userId } = req.body

  const  [results, metadata] = await seq.query(
    `INSERT INTO expense (id, title, amount, type, createdAt, user_id) VALUES (NULL, '${title}', '${amount}', '${type}', current_timestamp(), '${userId}')`,
    {
      nest: true,
      type: QueryTypes.INSERT
    }
  );
  

  const  newExpense = await seq.query(
    `SELECT * FROM expense WHERE id=${results} AND user_id='${req.user.id}'`,
    {
      nest: true,
      type: QueryTypes.SELECT
    }
  );

  res.status(201).json({ success: true, message: 'Expense created successfully', newExpense: newExpense[0]});
});

exports.getAllExpenses = asyncHandler(async (req, res, next) => {

  const  expenses = await seq.query(
    `SELECT * FROM expense WHERE user_id='${req.user.id}'`,
    {
      nest: true,
      type: QueryTypes.SELECT
    }
  );

  const stats = expenses.reduce((acc, curr) => {

    if(curr.type === 'income'){
      acc.income = acc.income + curr.amount
    }else{
      acc.expense = acc.expense  + curr.amount
    }

    return acc;
  }, {expense: 0, income: 0})

  res.status(200).json({ success: true, message: 'All expense fetched successfully', stats, expenses, remain: stats.income - stats.expense  });
});

exports.deleteExpense = asyncHandler(async (req, res, next) => {

  const  expenses = await seq.query(
    `DELETE FROM expense WHERE id=${req.params.id}`,
    {
      nest: true,
      type: QueryTypes.DELETE
    }
  );

  res.status(200).json({ success: true, message: 'All expense fetched successfully', expenses });
});

exports.getStats = asyncHandler(async (req, res, next) => {

  let {start_date, end_date, type} = req.query;

  start_date = new Date(start_date)
  end_date = new Date(end_date)

  console.log(type);


  const startDate = `${start_date.getFullYear()}-${start_date.getMonth() +1}-${start_date.getDate()}`
  const endDate = `${end_date.getFullYear()}-${end_date.getMonth()+1}-${end_date.getDate()}`

  const  expenses = await seq.query(
    `SELECT * FROM expense WHERE user_id=${req.user.id} AND ${type === 'all' ? '' : 'type='+ `'`+ type+ `'` + ' AND'} cast(createdAt as date) BETWEEN '${startDate}' AND '${endDate}'`,
    {
      nest: true,
      type: QueryTypes.SELECT
    }
  );

  const stats = expenses.reduce((acc, curr) => {

    if(curr.type === 'income'){
      acc.income = acc.income + curr.amount
    }else{
      acc.expense = acc.expense  + curr.amount
    }

    return acc;
  }, {expense: 0, income: 0})

  res.status(200).json({ success: true, message: 'Expense stats fetched successfully', stats, expenses, remain: stats.income - stats.expense });
});