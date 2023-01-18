import React, { useEffect } from 'react';
import moment from 'moment'
import axios from 'axios';
import { useAtom } from 'jotai'
import { expensesAtom, statsAtom } from '../atom'

const TableSection = () => {
  const [expenses, setExpenses] = useAtom(expensesAtom);
  const [stats, setStats] = useAtom(statsAtom);

  const getExpenses = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/expense`);
    setExpenses(response?.data?.expenses);
    setStats({expense: response.data.stats.expense, income: response.data.stats.income, remaining:  response.data.remain})
  }

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/expense/${id}`);

    } catch (error) {
      alert('Failed to delete expense')
    }
    setExpenses(expenses.filter(item => item.id !== id));
  }

  console.log(stats);

  useEffect(() => {
    getExpenses();
  }, [])

  return (
    <div class="overflow-x-auto px-16">
      <table class="table w-full border-2 rounded-sm">
        <thead>
          <tr>
            <th>Sl</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date added</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          {expenses?.map((item, idx) => (
            <tr class="hover">
              <th>{idx + 1}</th>
              <td>{item.title}</td>
              <td>{item.amount}</td>
              <td>{
                item.type === 'income' ?
                <p className='badge badge-success'>{item.type}</p>
                :
                <p className='badge badge-error'>{item.type}</p>
              }</td>
              <td>{moment(item.createdAt).format("MMM Do YY,  h:mm")}</td>
              <td>
                <button
                  onClick={() => deleteExpense(item.id)}
                  className="btn btn-sm btn-error tiny"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='text-right'>
        <p>Total Expenses: <b className='text-rose-500'>{stats.expense}</b></p>
        <p>Total Income: <b className='text-teal-500'>{stats.income}</b></p>
        <p>Remaining balance: <b className={stats.remaining < 0 ? 'text-rose-500' : 'text-teal-600'}>{stats.remaining}</b></p>
      </div>
    </div>
  );
};

export default TableSection;