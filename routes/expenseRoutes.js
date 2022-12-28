const router = require('express').Router();

const { createNewExpenses, getAllExpenses, deleteExpense, getStats } = require('../controllers/expenseController');

const protect = require('../middlewares/auth');



router.route('/')
  .post(protect, createNewExpenses)
  .get(protect, getAllExpenses);

router.route('/filter').get(protect, getStats);
router.route('/:id').delete(protect, deleteExpense);

module.exports = router;
