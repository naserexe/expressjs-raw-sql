import axios from 'axios';
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/material_green.css";

import { useAtom } from 'jotai';
import { expensesAtom, userAtom, statsAtom } from '../atom'

const InputSection = () => {
  const [expenses, setNewExpense] = useAtom(expensesAtom);
  const [_e, setStats] = useAtom(statsAtom);
  const [currentUser, _] = useAtom(userAtom);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('all');

  const onSubmit = async () => {
    const newExpense = {
      title,
      amount: +amount,
      type,
      userId: currentUser.user.id
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/expense`, {
        ...newExpense
      });

      setNewExpense([response.data.newExpense, ...expenses])
    } catch (error) {
      console.log(error);
      alert('Failed add new expense')
    }
  }

  const handleFilterData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/expense/filter?start_date=${startDate}&end_date=${endDate}&type=${type}`);
      setNewExpense(res.data.expenses);
      setStats({expense: res.data.stats.expense, income: res.data.stats.income, remaining:  res.data.remain})
    } catch (error) {
      console.log(error);
    }
  }

  return (

    <div class="container flex flex-col w-full lg:flex-row mt-3 m-auto mb-5">
      <div class="grid flex-grow h-full card bg-base-300 rounded-box place-items-center p-5">

        <input
          className='input input-bordered input-accent w-full max-w-xs mb-3'
          type="text"
          onChange={({ target }) => setTitle(target.value)}
          placeholder="Expense Title"
        />

        <input
          className='input input-bordered input-accent w-full max-w-xs mb-3'
          type="number"
          onChange={({ target }) => setAmount(target.value)}
          placeholder="Amount"
        />

        <select
          className='input input-bordered input-accent w-full max-w-xs mb-3'
          onChange={({ target }) => setType(target.value)}
        >
          <option disabled selected>Select type</option>
          <option value='income'>Income</option>
          <option value='expense'>Expense</option>
        </select>

        <button
          className="btn btn-outline btn-success"
          onClick={onSubmit}
        >
          Add expense
        </button>

      </div>

      <div class="divider lg:divider-horizontal">|</div>

      <div class="grid flex-grow h-full card bg-base-300 rounded-box place-items-center p-5">

        <div className='w-full max-w-xs m-auto'>
          <Flatpickr
            className='input input-bordered input-accent w-full max-w-xs mb-3'
            placeholder='Start date'
            onChange={(time) => {
              setStartDate(time)
            }}
          />

          <Flatpickr
            className='input input-bordered input-accent w-full max-w-xs mb-3'
            placeholder='End date'
            onChange={(time) => {
              setEndDate(time)
            }}
          />
        </div>

        <select onChange={({ target }) => setType(target.value)} className="input input-bordered input-accent w-full max-w-xs mb-3">
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <button onClick={handleFilterData} className="btn btn-outline btn-info">Filter</button>

      </div>
    </div>
  );
};

export default InputSection;