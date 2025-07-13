import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import "./PlaygroundPage.css";

export default function Playground() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [explanation, setExplanation] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const mermaidRef = useRef(null);

  useEffect(() => {
    if (mermaidCode && mermaidRef.current) {
      mermaid.initialize({ startOnLoad: false, theme: "dark" });

      mermaidRef.current.innerHTML = "";

      const element = document.createElement("div");
      element.className = "mermaid";
      element.innerHTML = mermaidCode;

      mermaidRef.current.appendChild(element);

      try {
        mermaid.init(undefined, element);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        mermaidRef.current.innerHTML = "⚠️ Invalid Mermaid code.";
      }
    }
  }, [mermaidCode]);

  const handleExplain = () => {
    setExplanation(`🧠 This code checks for prime numbers from 2 to n...`);
  };

  const handleGenerateFlowchart = () => {
    const dummyCode = `
      graph TD
      A[Start] --> B{Is n <= 1?}
      B -- Yes --> C[Return false]
      B -- No --> D[Loop from 2 to n-1]
      D --> E{n % i == 0?}
      E -- Yes --> F[Return false]
      E -- No --> G[Return true]
    `;
    setMermaidCode(dummyCode.trim());
  };

  return (
    <div className="playground-container">
      <h1 className="title">Launch Playground</h1>

      <div className="code-section">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
        />

        <div className="playground-controls">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>

          <div className="button-group">
            <button className="btn primary" onClick={handleExplain}>
              Explain Code
            </button>
            <button className="btn primary" onClick={handleGenerateFlowchart}>
              Generate Flowchart
            </button>
          </div>
        </div>
      </div>

      <div className="results-section">
        <div className="result-box explanation">
          <h2>🧠 AI Explanation</h2>
          <pre>{explanation}</pre>
        </div>

        <div className="result-box flowchart">
          <h2>📈 Flowchart</h2>
          <div ref={mermaidRef}></div>
        </div>
      </div>
    </div>
  );
}
