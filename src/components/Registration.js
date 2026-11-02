import React, { useState } from 'react';

function Registration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(`Registered: ${name}, ${email}`);

    setName('');
    setEmail('');
};

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-icon">👤</div>

        <h2>Create Your Account</h2>
        <p className="form-subtitle">
          Register to get started with Daily Task Manager.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn register-btn w-100">
            Register Now →
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;