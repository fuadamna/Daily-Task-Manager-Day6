
import React, { useEffect, useState } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from './firebase';

import Login from './components/Login';
import Home from './components/Home';
import Registration from './components/Registration';
import About from './components/About';
import UserList from './components/UserList';

import './App.css';


function ProtectedRoute({ user, role, loading, allowedRole, children }) {

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    if (role === 'admin') {
      return <Navigate to="/users" replace />;
    }

    if (role === 'user') {
      return <Navigate to="/home" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}


function Layout() {

  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      setLoading(true);
      setCurrentUser(user);
      setRole('');

      try {

        if (user) {

          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (userDoc.exists()) {
            setRole(userDoc.data().role || '');
          }

        }

      } catch (error) {

        console.error('User role error:', error);

      } finally {

        setLoading(false);

      }

    });

    return () => unsubscribe();

  }, []);


  const handleLogout = async () => {

    try {

      await signOut(auth);
      setCurrentUser(null);
      setRole('');
      navigate('/login', { replace: true });

    } catch (error) {

      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');

    }

  };


  const isRegistrationPage = location.pathname === '/registration';


  return (

    <div className="d-flex flex-column min-vh-100">

      <nav className="navbar navbar-dark">

        <div className="container d-flex align-items-center justify-content-between">

          <Link
            className="navbar-brand mb-0"
            to={
              !currentUser
                ? '/login'
                : role === 'admin'
                ? '/users'
                : '/home'
            }
          >
            📋 Daily Task Manager
          </Link>


          <div className="d-flex align-items-center gap-3">

            {currentUser && role === 'user' && !isRegistrationPage && (
              <>
                <Link className="nav-link-custom" to="/home">
                  Home
                </Link>

                <Link className="nav-link-custom" to="/about">
                  About
                </Link>
              </>
            )}

            {currentUser && !loading && (
              <span
                className="nav-link-custom"
                style={{ cursor: 'pointer' }}
                onClick={handleLogout}
              >
                Logout
              </span>
            )}

          </div>

        </div>

      </nav>


      <main className="flex-grow-1">

        <Routes>

          <Route
            path="/"
            element={
              loading ? (
                <div className="text-center p-5">Loading...</div>
              ) : currentUser ? (
                role === 'admin' ? (
                  <Navigate to="/users" replace />
                ) : role === 'user' ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />


          <Route
            path="/login"
            element={
              loading ? (
                <div className="text-center p-5">Loading...</div>
              ) : currentUser ? (
                role === 'admin' ? (
                  <Navigate to="/users" replace />
                ) : role === 'user' ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Login />
                )
              ) : (
                <Login />
              )
            }
          />


          <Route
            path="/registration"
            element={
              loading ? (
                <div className="text-center p-5">Loading...</div>
              ) : currentUser ? (
                role === 'admin' ? (
                  <Navigate to="/users" replace />
                ) : role === 'user' ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Registration />
                )
              ) : (
                <Registration />
              )
            }
          />


          <Route
            path="/home"
            element={
              <ProtectedRoute
                user={currentUser}
                role={role}
                loading={loading}
                allowedRole="user"
              >
                <Home />
              </ProtectedRoute>
            }
          />


          <Route
            path="/about"
            element={
              <ProtectedRoute
                user={currentUser}
                role={role}
                loading={loading}
                allowedRole="user"
              >
                <About />
              </ProtectedRoute>
            }
          />


          <Route
            path="/users"
            element={
              <ProtectedRoute
                user={currentUser}
                role={role}
                loading={loading}
                allowedRole="admin"
              >
                <UserList />
              </ProtectedRoute>
            }
          />


          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>

      </main>


      <footer
        className="text-center text-white p-3"
        style={{ background: '#172b4d' }}
      >
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
