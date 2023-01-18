import { atom } from 'jotai';

export const expensesAtom = atom([]);
export const userAtom = atom({ isAuthenticated: false, user: {} });
export const statsAtom = atom({ expense: 0, income: 0, remaining: 0 });