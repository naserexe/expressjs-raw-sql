const router = require('express').Router();

const { body } = require('express-validator');
const { createNewExpenses, getAllExpenses, deleteExpense } = require('../controllers/expenseController');
const validate = require('../middlewares/reqValidation');

// const { protect, authorize } = require('../middleware/auth');

// router.route('/')
//   .post(validate([
//     body('email').isEmail().withMessage('Email is required'),
//     body('name').isString().withMessage('Name is required'),
//     body('designation').isString().withMessage('Designation is required'),
//     body('department').isString().withMessage('Department is required'),
//     body('primaryPhone').isString().withMessage('Primary phone is required'),
//     body('pbx').isString().withMessage('PBX is required'),
//     body('room').isString().withMessage('Room number is required'),
//     body('details').isString().withMessage('Details is required'),
//   ]), createNewExpenses)
//   .get(getAllExpenses);

router.route('/')
  .post(createNewExpenses)
  .get(getAllExpenses);
router.route('/:id').delete(deleteExpense)
module.exports = router;