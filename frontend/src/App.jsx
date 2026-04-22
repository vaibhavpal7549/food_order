import React, { useEffect } from 'react';

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Header from './Components/layout/Header';
import Footer from './Components/layout/Footer';
import Menu from './Components/Menu';
import { loadUser } from './redux/actions/userActions';
import store from './redux/store';
import Login from './Components/user/Login';
import Register from './Components/user/Register';
import Profile from './Components/user/Profile';
import UpdateProfile from './Components/user/UpdateProfile';
import ForgotPassword from './Components/user/ForgotPassword';
import NewPassword from './Components/user/NewPassword';
import Cart from './Components/cart/Cart';
import OrderSuccess from './Components/cart/OrderSuccess';

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <>
      <ToastContainer />
      <Router>
        <div className='App'>
          <Header />
          <div className='container container-fluids'>
            <Routes>
              <Route path='/' element={<Home />} exact />
              <Route path="/eats/stores/search/:keyword" element={<Home />} exact />
            
            {/* login */}
              <Route path='/users/login' element={<Login />} exact />
              <Route path='/users/signup' element={<Register />} exact />
              <Route path='/users/me' element={<Profile />} exact />
              <Route path='/users/me/update' element={<UpdateProfile />} exact />
              <Route path='/users/forgetPassword' element={<ForgotPassword />} exact />
              <Route path='/users/resetPassword/:token' element={<NewPassword />} exact />

              <Route path="/eats/stores/:id" element={<Menu />} exact />
              <Route path="/eats/stores/:id/menus" element={<Menu />} exact />
              <Route path="/cart" element={<Cart />} exact />
              <Route path="/success" element={<OrderSuccess />} exact />
            </Routes>
          </div>
        </div>
      </Router>
      <Footer />
    </>
  )
}

export default App
