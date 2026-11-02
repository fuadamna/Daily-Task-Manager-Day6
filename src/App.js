
import React from 'react';

import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from 'react-router-dom';

import Home from './components/Home';
import Registration from './components/Registration';
import About from './components/About';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            📋 Daily Task Manager
          </Link>

          <div>
            <Link className="nav-link-custom" to="/">Home</Link>
            <Link className="nav-link-custom" to="/registration">Registration</Link>
            <Link className="nav-link-custom" to="/about">About</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <footer className="text-center text-white p-3" style={{ background: '#172b4d' }}>
        Developed by Amna Fuad | 2026
      </footer>
    </BrowserRouter>
  );
}

export default App;