import React from 'react';
import Test from './components/Test';
import './App.css';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Login from './page/Login';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
