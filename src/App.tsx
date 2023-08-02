import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Login from './page/Login';
import SignUp from './page/SignUp';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
