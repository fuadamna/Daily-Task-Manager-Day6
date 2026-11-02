import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">

      <section className="hero">
        <div className="hero-content">
          <h1>
            Welcome to <span>Daily Task Manager</span>
          </h1>

          <p>
            Manage your daily tasks efficiently
            and stay organized!
          </p>

          <Link to="/registration" className="btn hero-btn">
            Get Started →
          </Link>
        </div>

        <div className="hero-image">
          <div className="task-illustration">📋</div>
          <div className="clock">🕒</div>
        </div>
      </section>

      <section className="features container">
        <div className="feature-card">
          <div className="feature-icon blue">⌂</div>
          <h3>Home</h3>
          <p>Go back to the main page.</p>
          <Link to="/" className="feature-link blue-link">
            Explore →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon green">👤</div>
          <h3>Register</h3>
          <p>Create your account and start managing tasks.</p>
          <Link to="/registration" className="feature-link green-link">
            Register Now →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon purple">ⓘ</div>
          <h3>About</h3>
          <p>Learn more about our application.</p>
          <Link to="/about" className="feature-link purple-link">
            Learn More →
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;