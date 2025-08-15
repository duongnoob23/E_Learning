// Client Home Page
import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__container">
          {/* Left Content */}
          <div className="hero__content">
            <h1 className="hero__title">
              <span className="hero__title-highlight">Studying</span> Online is
              now much easier
            </h1>
            <p className="hero__description">
              TOTC is an interesting platform that will teach you in more an
              interactive way
            </p>
            <div className="hero__actions">
              <button className="hero__btn hero__btn--primary">
                Join for free
              </button>
              <div className="hero__play-section">
                <button className="hero__play-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7z" fill="#4FD1C7" />
                  </svg>
                </button>
                <span className="hero__play-text">Watch how it works</span>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Cards and Image */}
          <div className="hero__visual">
            {/* Floating Cards - Nằm trên */}
            <div className="hero__floating-cards">
              {/* Card 1 - Assisted Student */}
              <div className="floating-card floating-card--top-left">
                <div className="floating-card__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                      fill="#4FD1C7"
                    />
                  </svg>
                </div>
                <div className="floating-card__content">
                  <span className="floating-card__text">
                    250k Assisted Student
                  </span>
                </div>
              </div>

              {/* Card 2 - Statistics */}
              <div className="floating-card floating-card--top-right">
                <div className="floating-card__icon floating-card__icon--stats">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 3 - Congratulations */}
              <div className="floating-card floating-card--middle-right">
                <div className="floating-card__icon floating-card__icon--envelope">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                      fill="#FF6B35"
                    />
                  </svg>
                </div>
                <div className="floating-card__content">
                  <span className="floating-card__text">
                    Congratulations Your admission completed
                  </span>
                </div>
              </div>

              {/* Card 4 - User Experience Class - Dịch sang phải */}
              <div className="floating-card floating-card--bottom-right">
                <div className="floating-card__avatar">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Teacher"
                    className="floating-card__avatar-img"
                  />
                </div>
                <div className="floating-card__content">
                  <span className="floating-card__text">
                    User Experience Class
                  </span>
                  <span className="floating-card__time">Today at 12.00 PM</span>
                  <button className="floating-card__join-btn">Join Now</button>
                </div>
              </div>
            </div>

            {/* Main Image - Nằm dưới */}
            <div className="hero__image-container">
              <div className="hero__image">
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Student studying"
                  className="hero__image-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curved Bottom Section */}
      <div className="home__curve">
        <svg viewBox="0 0 1440 200" fill="none">
          <path
            d="M0 200L60 180C120 160 240 120 360 110C480 100 600 120 720 130C840 140 960 140 1080 130C1200 120 1320 110 1380 105L1440 100V200H0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default Home;
