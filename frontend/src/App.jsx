import { useEffect, useState } from "react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function App() {
  const [page, setPage] = useState("home");
  const [dashboard, setDashboard] = useState(null);
  const [food, setFood] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [d, f] = await Promise.all([
        fetch(`${API}/api/dashboard/`).then(r => r.json()),
        fetch(`${API}/api/food/`).then(r => r.json())
      ]);
      setDashboard(d);
      setFood(f);
    } catch {
      setMessage("Could not connect to FoodLoop API.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const login = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value
      })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setMessage("Login successful.");
      setPage("dashboard");
    } else {
      setMessage(data.error || "Login failed.");
    }
  };

  const createFood = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Please login first.");
      setPage("login");
      return;
    }

    const body = {
      title: e.target.title.value,
      description: e.target.description.value,
      quantity: Number(e.target.quantity.value),
      organizationId: "6a879e40a8e2c6d8de97c5d4"
    };

    const res = await fetch(`${API}/api/food/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Food listing created successfully.");
      e.target.reset();
      loadData();
      setPage("food");
    } else {
      setMessage(data.error || "Failed to create listing.");
    }
  };

  return (
    <div className="app-shell">

      <header className="navbar">
        <button className="brand" onClick={() => setPage("home")}>
          FoodLoop
        </button>

        <nav>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => { loadData(); setPage("dashboard"); }}>
            Dashboard
          </button>
          <button onClick={() => { loadData(); setPage("food"); }}>
            Available Food
          </button>
          <button onClick={() => setPage("create")}>
            Donate Food
          </button>

          {!token ? (
            <button className="nav-login" onClick={() => setPage("login")}>
              Login
            </button>
          ) : (
            <button
              className="nav-login"
              onClick={() => {
                localStorage.removeItem("token");
                setToken("");
                setPage("home");
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="app-main" style={{ flex: 1 }}>

        {message && (
          <div className="message">
            ? {message}
          </div>
        )}

        {page === "home" && (
          <section className="hero-section">
            <div className="hero-text">
              <div className="hero-badge">
                REDUCE WASTE. FEED COMMUNITIES.
              </div>

              <h1>
                Turning Surplus Food Into
                <span> Community Impact</span>
              </h1>

              <p>
                FoodLoop connects food providers with organizations that need
                surplus food, reducing waste and helping communities.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-btn"
                  onClick={() => setPage("food")}
                >
                  Explore Available Food
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => setPage("create")}
                >
                  Donate Surplus Food
                </button>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-icon">FOOD</div>
              <h2>Food shouldn't go to waste.</h2>
              <p>
                Connect surplus food with organizations and communities
                that need it.
              </p>

              <div className="impact-item">Reduce food waste</div>
              <div className="impact-item">Support local communities</div>
              <div className="impact-item">Create measurable impact</div>
            </div>
          </section>
        )}

        {page === "login" && (
          <section className="form-page">
            <div className="form-card">
              <div className="form-icon">FOOD</div>
              <h1>Welcome back</h1>
              <p>Login to continue using FoodLoop.</p>

              <form onSubmit={login}>
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="donor@test.com"
                  defaultValue="donor@test.com"
                  required
                />

                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  defaultValue="Test12345"
                  required
                />

                <button className="primary-btn" type="submit">
                  Login
                </button>
              </form>
            </div>
          </section>
        )}

        {page === "dashboard" && dashboard && (
          <section>
            <div className="page-heading">
              <div>
                <p className="eyebrow">OVERVIEW</p>
                <h1>FoodLoop Dashboard</h1>
                <p>Monitor food redistribution activity.</p>
              </div>
            </div>

            <div className="dashboard-grid">
              <Card title="Food Listings" value={dashboard.foodListings} icon="" />
              <Card title="Available Food" value={dashboard.availableFood} icon="" />
              <Card title="Organizations" value={dashboard.organizations} icon="" />
              <Card title="Claims" value={dashboard.claims} icon="" />
              <Card title="Pending Claims" value={dashboard.pendingClaims} icon="" />
              <Card title="Matches" value={dashboard.matches} icon="" />
            </div>
          </section>
        )}

        {page === "food" && (
          <section>
            <div className="page-heading">
              <div>
                <p className="eyebrow">FOOD DISCOVERY</p>
                <h1>Available Food</h1>
                <p>Browse surplus food available for community organizations.</p>
              </div>
            </div>

            <div className="food-grid">
              {food.map(item => (
                <div className="food-card" key={item._id}>
                  <div className="food-card-icon"></div>
                  <div className="food-status">{item.status}</div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <div className="quantity">
                    <strong>{item.quantity}</strong>
                    <span>units available</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "create" && (
          <section className="form-page">
            <div className="form-card wide">
              <div className="form-icon">FOOD</div>
              <h1>Donate Surplus Food</h1>
              <p>List food that could help someone in your community.</p>

              <form onSubmit={createFood}>
                <label>Food Title</label>
                <input
                  name="title"
                  placeholder="e.g. Fresh Vegetables"
                  required
                />

                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the available food..."
                  rows="4"
                  required
                />

                <label>Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  required
                />

                <button className="primary-btn" type="submit">
                  Create Food Listing
                </button>
              </form>
            </div>
          </section>
        )}

      </main>

      <footer>
        <strong>FoodLoop</strong>
        <span>Turning surplus into community impact.</span>
      </footer>

    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}







