import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import ReactMarkdown from "react-markdown";

import "./PlaygroundPage.css";
import api from "../../api/api";

export default function Playground() {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [explanation, setExplanation] = useState("");
    const [mermaidCode, setMermaidCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isExplainBlockLoading, setIsExplainBlockLoading] = useState(false);
    const [isFlowchartBlockLoading, setIsFlowchartBlockLoading] = useState(false);

    const [explanationIndex, setExplanationIndex] = useState(0);
    const [flowchartIndex, setFlowchartIndex] = useState(0);

    const mermaidRef = useRef(null);

    const sampleSnippets = [
        {
            title: "Dijkstra's Algorithm (Python)",
            language: "python",
            code: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        current_distance, current_node = heapq.heappop(pq)

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))

    return distances`
        },
        {
            title: "Binary Search (JavaScript)",
            language: "javascript",
            code: `function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}`
        }
    ];

    const explanationLoadingMessages = [
        "Thinking deeply about your code...",
        "Reading line by line like a code monk...",
        "Searching for insights buried in logic...",
        "Sending thoughts to the AI mothership...",
        "Exploring functions and their meaning...",
        "Untangling logic threads with elegance...",
    ];

    const flowchartLoadingMessages = [
        "Drawing arrows and nodes...",
        "Connecting the logic DNA...",
        "Building your flowblock empire...",
        "Measuring loops and conditions...",
        "Translating control flow to visuals...",
        "Mapping logic links with precision...",
    ];

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

        let explainInterval, flowchartInterval;

        if (isLoading) {
            explainInterval = setInterval(() => {
                setExplanationIndex((prev) => (prev + 1) % explanationLoadingMessages.length);
            }, 2500);

            flowchartInterval = setInterval(() => {
                setFlowchartIndex((prev) => (prev + 1) % flowchartLoadingMessages.length);
            }, 2500);
        } else {
            setExplanationIndex(0);
            setFlowchartIndex(0);
        }

        return () => {
            clearInterval(explainInterval);
            clearInterval(flowchartInterval);
        };
    }, [mermaidCode, isLoading]);

    const handleExplain = async () => {
        if (!code.trim()) return;
        setIsLoading(true);
        setIsExplainBlockLoading(true);
        setExplanation("🧠 Generating explanation... sit tight while we decode the code!");
        try {
            const res = await api.post("/explain/explain-code", { code, language });
            setExplanation(res.data.message);
        } catch (err) {
            console.error("Explain API error:", err);
            setExplanation("⚠️ Could not fetch explanation.");
        } finally {
            setIsLoading(false);
            setIsExplainBlockLoading(false);
        }
    };

    const handleGenerateFlowchart = async () => {
        if (!code.trim()) return;
        setIsLoading(true);
        setIsFlowchartBlockLoading(true);
        setMermaidCode(`
graph TD
loading["⏳ Crafting your diagram... compiling logic into lines & arrows..."]
`);
        try {
            const res = await api.post("/explain/generate-flowchart", { code, language });
            setMermaidCode(res.data.mermaidCode);
        } catch (err) {
            console.error("Flowchart API error:", err);
            setMermaidCode("graph TD\nerror[\"⚠️ Server error\"]");
        } finally {
            setIsLoading(false);
            setIsFlowchartBlockLoading(false);
        }
    };

    return (
        <div className="playground-container">
            <h1 className="title">Playground</h1>

            {/* Sample Snippets */}
            <div className="sample-snippets">
                <h2>🚀 Try a Sample</h2>
                <div className="snippet-list">
                    {sampleSnippets.map((snippet, index) => (
                        <div key={index} className="snippet-card">
                            <h4>{snippet.title}</h4>
                            <pre>{snippet.code.split("\n").slice(0, 4).join("\n")}...</pre>
                            <button
                                className="btn secondary"
                                onClick={() => {
                                    setCode(snippet.code);
                                    setLanguage(snippet.language);
                                }}
                            >
                                Try This
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Code Editor Section */}
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
                        <option value="java">Java</option>
                    </select>

                    <div className="button-group">
                        <button className="btn primary" onClick={handleExplain} disabled={isLoading}>
                            {isExplainBlockLoading ? "Explaining..." : "Explain Code"}
                        </button>

                        <button className="btn primary" onClick={handleGenerateFlowchart} disabled={isLoading}>
                            {isFlowchartBlockLoading ? "Generating..." : "Generate Flowchart"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="results-section">
                <div className="result-box explanation">
                    <h2>🧠 AI Explanation</h2>
                    {isExplainBlockLoading ? (
                        <div className="loading-msg">{explanationLoadingMessages[explanationIndex]}</div>
                    ) : (
                        <div className="markdown">
                            <ReactMarkdown>{explanation}</ReactMarkdown>
                        </div>
                    )}
                </div>

                <div className="result-box flowchart">
                    <h2>📈 Flowchart</h2>
                    {isFlowchartBlockLoading ? (
                        <div className="loading-msg">{flowchartLoadingMessages[flowchartIndex]}</div>
                    ) : (
                        <div ref={mermaidRef}></div>
                    )}
                </div>
            </div>
        </div>
    );
}
