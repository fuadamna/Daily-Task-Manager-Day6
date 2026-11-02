import React from 'react';

function About() {
  return (
    <div className="about-page container">

      <div className="about-card">
        <div className="about-icon">ℹ️</div>

        <h1>About Daily Task Manager</h1>

        <p className="about-description">
          Daily Task Manager is a simple application
          designed to help users organize their daily
          activities and manage tasks efficiently.
        </p>

        <div className="about-features">
          <div>
            <span>✓</span>
            <h4>Easy to Use</h4>
            <p>Simple and user-friendly interface.</p>
          </div>

          <div>
            <span>✓</span>
            <h4>Stay Organized</h4>
            <p>Keep your daily activities organized.</p>
          </div>

          <div>
            <span>✓</span>
            <h4>Modern Design</h4>
            <p>Clean and responsive application.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;