
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function Registration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    // Name validation
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }

    // Email validation
    if (!email.includes("@") || !email.includes(".")) {
      setError("Invalid email");
      return;
    }

    // Phone validation
    if (phone.length !== 10 || isNaN(phone)) {
      setError("Phone must be 10 digits");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, 'users'), {
        name: name.trim(),
        email: email.trim(),
        phone: phone,
        timestamp: serverTimestamp()
      });

      setMessage('Registration successful!');

      setName('');
      setEmail('');
      setPhone('');

    } catch (err) {
      console.error('Error adding document:', err);
      setError('Error submitting form. Please try again.');
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
              id="name"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="text"
              name="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="form-control"
              placeholder="Enter 10 digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength="10"
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
                Submitting...
              </>
            ) : (
              'Register Now →'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;