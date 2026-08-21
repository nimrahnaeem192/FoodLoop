import { useEffect, useState } from "react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [page, setPage] = useState("home");
  const [dashboard, setDashboard] = useState(null);
  const [food, setFood] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [message, setMessage] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

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

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

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

  const signup = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const role = e.target.role.value;

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful. Please login.");
        e.target.reset();
        setPage("login");
      } else {
        setMessage(data.error || "Registration failed.");
      }
    } catch {
      setMessage("Could not connect to FoodLoop API.");
    }
  };

  const claimFood = async (foodListingId) => {
    if (!token) {
      setMessage("Please login first.");
      setPage("login");
      return;
    }

    try {
      const res = await fetch(`${API}/api/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          foodListingId,
          organizationId: "6a87c03187cc9a9f383a02e4",
          quantity: 1
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Food claim submitted successfully.");
        loadData();
      } else {
        setMessage(data.error || "Failed to submit claim.");
      }
    } catch {
      setMessage("Could not connect to FoodLoop API.");
    }
  };

  const askAI = async (e) => {
    e.preventDefault();

    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    setAiAnswer("");

    try {
      const res = await fetch(`${API}/api/ai/advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: aiQuestion
        })
      });

      const data = await res.json();

      if (res.ok && data.answer) {
        setAiAnswer(data.answer);
      } else {
        setAiAnswer(data.error || "AI could not generate an answer.");
      }
    } catch {
      setAiAnswer("Could not connect to FoodLoop AI.");
    } finally {
      setAiLoading(false);
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
          <button onClick={() => setPage("ai")}>
            AI Advisor
          </button>
          <button onClick={() => setPage("create")}>
            Donate Food
          </button>

          {!token ? (
            <>
              <button className="nav-login" onClick={() => setPage("login")}>
                Login
              </button>
              <button className="nav-login" onClick={() => setPage("signup")}>
                Sign Up
              </button>
            </>
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
            {message}
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
                  defaultValue=""
                  required
                />

                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  defaultValue=""
                  required
                />

                <button className="primary-btn" type="submit">
                  Login
                </button>
              </form>
            </div>
          </section>
        )}

        {page === "signup" && (
          <section className="form-page">
            <div className="form-card">
              <div className="form-icon">FOOD</div>
              <h1>Create your account</h1>
              <p>Join FoodLoop and help reduce food waste.</p>

              <form onSubmit={signup}>
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                />

                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />

                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                />

                <label>Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                />

                <label>Account Type</label>
                <select name="role" defaultValue="donor">
                  <option value="donor">Food Donor</option>
                  <option value="organization">Organization</option>
                </select>

                <button className="primary-btn" type="submit">
                  Create Account
                </button>
              </form>

              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="nav-login"
                  onClick={() => setPage("login")}
                >
                  Login
                </button>
              </p>
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
                  {token && (
                    <button
                      className="primary-btn"
                      onClick={() => claimFood(item._id)}
                    >
                      Claim Food
                    </button>
                  )}

                  <div className="quantity">
                    <strong>{item.quantity}</strong>
                    <span>units available</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "ai" && (
          <section className="form-page">
            <div className="form-card wide">
              <div className="form-icon">AI</div>
              <p className="eyebrow">GEMINI AI</p>
              <h1>FoodLoop AI Advisor</h1>
              <p>
                Ask FoodLoop AI for practical advice about food waste,
                donations, community impact, and food redistribution.
              </p>

              <form onSubmit={askAI}>
                <label>Your Question</label>
                <textarea
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="e.g. Give me 3 practical ways FoodLoop can reduce food waste."
                  rows="4"
                  required
                />

                <button
                  className="primary-btn"
                  type="submit"
                  disabled={aiLoading}
                >
                  {aiLoading ? "Thinking..." : "Ask FoodLoop AI"}
                </button>
              </form>

              {aiAnswer && (
                <div className="message" style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
                  <strong>FoodLoop AI:</strong>
                  <p>{aiAnswer}</p>
                </div>
              )}
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










