import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../atom';
import { useNavigate } from 'react-router'
import { loadUserAPI } from '../utils/loadUser';
import { Link } from 'react-router-dom';
import setAuthToken from '../utils/setAuthToken';
import axios from 'axios';

const Login = () => {
  const [currentUser, setUser] = useAtom(userAtom);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('e_token', res.data.token);
      setAuthToken(res.data.token);
      const { user } = await loadUserAPI();
      setUser({ user, isAuthenticated: true });
      if(currentUser.isAuthenticated){
        navigate('/dashboard')
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.e_token) {
        setAuthToken(localStorage.e_token);
        const { user } = await loadUserAPI();
        setUser({ user, isAuthenticated: true });
        if (currentUser.isAuthenticated) {
          navigate('/dashboard')
        }
      }
    }

    checkAuth();

  }, [currentUser]);

  return (
    <div className='flex h-screen justify-center items-center mb-28'>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold ">Login</h2>
          <form>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                onChange={({ target }) => setEmail(target.value)}
                type="email" placeholder="You email"
                className="input input-bordered input-secondary w-full max-w-xs" />
              <label className="label">

              </label>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                onChange={({ target }) => setPassword(target.value)}
                type="password" placeholder="You Password"
                className="input input-bordered input-secondary w-full max-w-xs" />

            </div>

            <input className='btn w-full  max-w-xs btn-secondary text-white mt-8' type="button" onClick={onSubmit} value="Login" />
          </form>
          <p>New to Expense Tracker? <Link className='text-secondary' to={"/signup"}>Create new account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;