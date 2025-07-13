import React from "react";
import "./LandingPage.css";

export default function LandingPage() {
    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="hero">

                <div className="hero-text">
                    <h1>logicTrace.ai</h1>
                    <p>
                        AI-powered code explanations with automatic flowchart generation.
                        Instantly understand your code — visually and logically.
                    </p>
                    <div className="hero-buttons">
                        <a href="/playground" style={{"textDecoration": "none"}} className="btn primary">Try Demo</a>
                        <a href="#how-it-works" style={{"textDecoration": "none"}} className="btn secondary">How It Works</a>
                    </div>
                </div>
                <div className="hero-preview">
                    <pre>
                        {`> const isPrime = (n) => {
>   if (n <= 1) return false;
>   for (let i = 2; i < n; i++) {
>     if (n % i === 0) return false;
>   }
>   return true;
> }

[AI]: Checks if a number is prime.
[Flowchart]: Generated ✅`}
                    </pre>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works" id="how-it-works">
                <h2>How It Works</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>1. Paste Your Code</h3>
                        <p>Supports JS, Python, Java, and more.</p>
                    </div>
                    <div className="feature-card">
                        <h3>2. Click “Explain”</h3>
                        <p>AI analyzes and breaks down your logic.</p>
                    </div>
                    <div className="feature-card">
                        <h3>3. Visualize Instantly</h3>
                        <p>Get a Mermaid flowchart and step-by-step breakdown.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta">
                <h2>Ready to explore your code?</h2>
                <button className="btn primary">Launch Playground</button>
            </section>

            {/* Footer */}
            <footer>
                <p>© {new Date().getFullYear()} logicTrace.ai — Built with 💡 and 🧠</p>
            </footer>
        </div>
    );
}
