import React from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../atom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router'

const Navbar = () => {
  const [currentUser, _] = useAtom(userAtom);
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem('e_token');
    navigate('/login');
    window.location.reload();
  }
  return (
    // <div className="navbar bg-purple-700 text-center lg:flex">
    //     <a className="btn btn-ghost normal-case text-white text-xl ">Expense Tracker</a>
    //     <a className='btn btn-ghost normal-case text-white text-xl'>Login</a>
    // </div>
    <div className="navbar bg-purple-700 text-white px-14">
      <div className="navbar-start">

        <Link className="btn btn-ghost mr-10" to="/">Expense Tracker</Link>
      </div>
      <div className="navbar-end hidden lg:flex">
        {currentUser.isAuthenticated ?
          <>
            <p>{currentUser?.user?.email}</p>
            <button
              onClick={logOut}
              className="btn btn-sm btn-error tiny ml-3"
            >
              Logout
            </button>
          </>
          :
          <Link className="btn btn-ghost mr-10" to="/login">Login</Link>}

      </div>
      <div className="navbar-end lg:hidden">

      </div>
    </div>
  );
};

export default Navbar;