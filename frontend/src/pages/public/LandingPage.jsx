import React from "react";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">

          <div className="hero-badge">
            REDUCE WASTE. FEED COMMUNITIES.
          </div>

          <h1>
            Turning Surplus Food Into
            <span> Community Impact.</span>
          </h1>

          <p>
            FoodLoop connects food providers with organizations that need
            surplus food, reducing waste and helping communities.
          </p>

          <div className="hero-actions">
            <button className="btn primary">
              Explore Available Food
            </button>

            <button className="btn secondary">
              Donate Surplus Food
            </button>
          </div>

        </div>

        <div className="hero-card">
          <div className="food-icon">FOOD</div>

          <h3>Surplus Food</h3>

          <p>
            Fresh food that can make a difference.
          </p>

          <div className="impact">
            <span>[+]</span>
            Reduce food waste
          </div>

          <div className="impact">
            <span>[+]</span>
            Support local communities
          </div>

          <div className="impact">
            <span>[+]</span>
            Create measurable impact
          </div>
        </div>
      </section>

      <section className="how">
        <p className="section-label">HOW FOODLOOP WORKS</p>

        <h2>
          From surplus to impact in three simple steps.
        </h2>

        <div className="steps">

          <div className="step">
            <div className="step-number">01</div>
            <h3>Donate</h3>
            <p>
              Providers list their available surplus food.
            </p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <h3>Match</h3>
            <p>
              Organizations discover food they can use.
            </p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <h3>Claim</h3>
            <p>
              Food gets connected with communities that need it.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
