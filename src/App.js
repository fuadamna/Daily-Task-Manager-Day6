import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useLocation
} from 'react-router-dom';

import Home from './components/Home';
import Registration from './components/Registration';
import About from './components/About';
import UserList from './components/UserList';
import './App.css';

function Layout() {

  const location = useLocation();
  const isAdminPage = location.pathname === '/users';

  return (
    <div className="d-flex flex-column min-vh-100">

      {/* Navbar */}
      <nav className="navbar navbar-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            📋 Daily Task Manager
          </Link>

          {!isAdminPage && (
            <div>
              <Link className="nav-link-custom" to="/">Home</Link>
              <Link className="nav-link-custom" to="/registration">Registration</Link>
              <Link className="nav-link-custom" to="/about">About</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="text-center text-white p-3"
        style={{ background: '#172b4d' }}>
        Developed by Amna Fuad | 2026
      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
