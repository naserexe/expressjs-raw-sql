import { Route, Routes } from 'react-router';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
// import InputSection from './components/InputSection';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import PrivateRoute from './PrivateRoute';
// import TableSection from './components/TableSection';

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <Routes>
          <Route path='/dashboard' element={
            <PrivateRoute>
              <Home/>
            </PrivateRoute>
          }></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
      </Routes>
    </div>
  );
}

export default App;
