import axios from 'axios';
import { useAtom } from 'jotai';
import { userAtom } from '../atom'
import React, { useState, useEffect} from 'react';
import { Link, } from 'react-router-dom';
import { useNavigate } from 'react-router'
import { loadUserAPI } from '../utils/loadUser';
import setAuthToken from '../utils/setAuthToken';

const Signup = () => {
  const [currentUser, setUser] = useAtom(userAtom);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { name, email, password });
      localStorage.setItem('e_token', res.data.token);
      setAuthToken(res.data.token);
      const { user } = await loadUserAPI();
      setUser({ user, isAuthenticated: true });
      if(currentUser.isAuthenticated){
        navigate('/dashboard')
        console.log('Navigation to dash');
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log(currentUser);

  useEffect(() => {
    const checkAuth = async () => {
      if(localStorage.e_token){
        setAuthToken(localStorage.e_token);
        const { user } = await loadUserAPI();
        setUser({ user, isAuthenticated: true });
        console.log(currentUser.isAuthenticated);
        if(currentUser.isAuthenticated){
          navigate('/dashboard')
        }
      }
    }

    checkAuth();

  }, [currentUser])
  return (
    <div className='flex h-screen justify-center items-center pt-10 mb-20'>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold ">Sign Up</h2>
          <form>
            {/* email with validation */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                onChange={({ target }) => setName(target.value)}
                type="name" placeholder="You Name"
                className="input input-bordered input-secondary w-full max-w-xs" />
              <label className="label">

              </label>
            </div>
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
            {/* password with validation */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                onChange={({ target }) => setPassword(target.value)}
                type="password" placeholder="You Password"
                className="input input-bordered input-secondary w-full max-w-xs" />
              <label className="label">

              </label>
            </div>

            <input className='btn w-full btn-primary  max-w-xs text-white' type="button" onClick={onSubmit} value="Sign Up" />
          </form>
          <p>Already have account? <Link className='text-secondary' to={"/login"}>Please Login</Link></p>

        </div>
      </div>
    </div>
  );
};

export default Signup;