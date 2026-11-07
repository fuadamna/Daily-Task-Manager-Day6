import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

import { Link, useNavigate } from 'react-router-dom';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    setError('');

    try {

      setLoading(true);

      // Login using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      // Get user details from Firestore
      const userRef = doc(db, 'users', user.uid);

      const userDoc = await getDoc(userRef);

      console.log('Logged-in UID:', user.uid);
      console.log('Document exists:', userDoc.exists());
      console.log('User details:', userDoc.data());

      if (userDoc.exists()) {

        const userData = userDoc.data();

        if (userData.role === 'admin') {

          navigate('/users', { replace: true });

        } else if (userData.role === 'user') {

          navigate('/home', { replace: true });

        } else {

          await signOut(auth);
          setError('Invalid user role.');

        }

      } else {

        await signOut(auth);
        setError('User details not found in database.');

      }

    } catch (err) {

      console.error('Login error:', err);

      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'permission-denied') {
        setError('You do not have permission to access user details. Check Firestore rules.');
      } else {
        setError(err.message);
      }

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="form-page">

      <div className="form-card">

        <div className="form-icon">🔐</div>

        <h2>Welcome Back!</h2>

        <p className="form-subtitle">
          Login to your Daily Task Manager account.
        </p>

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="mb-3">

            <label className="form-label">
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          <div className="mb-4">

            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

          <button
            type="submit"
            className="btn register-btn w-100"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </>
            ) : (
              'Login →'
            )}

          </button>

        </form>

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/registration">
            Register here
          </Link>
        </p>

      </div>

    </div>

  );
}

export default Login;
