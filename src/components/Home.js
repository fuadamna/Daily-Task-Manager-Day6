
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">

      {/* Original Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Welcome to <span>Daily Task Manager</span>
          </h1>

          <p>
            Manage your daily tasks efficiently
            and stay organized!
          </p>

          <Link to="/About" className="btn hero-btn">
            Learn More →
          </Link>
        </div>

        <div className="hero-image">
          <div className="task-illustration">📋</div>
          <div className="clock">🕒</div>
        </div>
      </section>

      {/* Centered Home and About Cards */}
      <section className="container py-5">

        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Explore Our Application</h2>
          <p className="text-secondary">
            Discover more about your Daily Task Manager.
          </p>
        </div>

        <div className="row justify-content-center g-4">

          {/* Home Card */}
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 text-center p-4">

              <div className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10"
                   style={{ width: '85px', height: '85px' }}>
                <span className="display-5 text-primary">⌂</span>
              </div>

              <h3 className="fw-bold text-dark mb-3">
                Home
              </h3>

              <p className="text-secondary mb-4">
                Go back to the main page and explore your application.
              </p>

              <Link
                to="/home"
                className="btn btn-outline-primary rounded-3 mt-auto py-2"
              >
                Explore →
              </Link>

            </div>
          </div>

          {/* About Card */}
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 text-center p-4">

              <div className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10"
                   style={{ width: '85px', height: '85px' }}>
                <span className="display-5 text-success">ⓘ</span>
              </div>

              <h3 className="fw-bold text-dark mb-3">
                About
              </h3>

              <p className="text-secondary mb-4">
                Learn more about our application and its features.
              </p>

              <Link
                to="/about"
                className="btn btn-outline-success rounded-3 mt-auto py-2"
              >
                Learn More →
              </Link>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;
