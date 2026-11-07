import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';

function Registration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    // Check empty fields
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError('All fields are required!');
      return;
    }

    // Name validation
    if (name.trim().length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }

    // Email validation
    if (!email.includes('@') || !email.includes('.')) {
      setError('Invalid email');
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone must be 10 digits');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      // Create Firebase Authentication account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      // Save user details in Firestore using Firebase UID
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: email.trim(),
        phone: phone,
        role: 'user',
        createdAt: serverTimestamp()
      });

      setMessage('Registration successful!');

      // Clear form fields
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">

        <div className="form-icon">👤</div>

        <h2>Create Your Account</h2>

        <p className="form-subtitle">
          Register to get started with Daily Task Manager.
        </p>

        {/* Success message */}
        {message && (
          <div className="alert alert-success mt-3" role="alert">
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="text"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Enter 10 digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength="10"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                Submitting...
              </>
            ) : (
              'Register Now →'
            )}
          </button>

        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </p>

      </div>
    </div>
  );
}

export default Registration;
