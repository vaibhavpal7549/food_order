import React from 'react';

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Header from './Components/layout/Header';
import Footer from './Components/layout/Footer';

function App() {

  return (
    <>
      <Router>
        <div className='App'>
          <Header />
          <div className='container container-fluids'>
            <Routes>
              <Route path='/' element={<Home />} exact />
              <Route path="/eats/stores/search/:keyword" element={<Home />} exact />
            </Routes>
          </div>
        </div>
      </Router>
      <Footer />
    </>
  )
}

export default App
