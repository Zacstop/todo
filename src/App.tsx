import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Login from './page/Login';
import SignUp from './page/SignUp';
import './App.css';
import ErrorPage404 from 'page/404';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/*" element={<ErrorPage404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
