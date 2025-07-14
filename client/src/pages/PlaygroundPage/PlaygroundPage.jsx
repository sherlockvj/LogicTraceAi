import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import ReactMarkdown from "react-markdown";

import "./PlaygroundPage.css";
import api from "../../api/api";
import { savedSnippets } from "../../util/sampleSnippets";
import { explainBlockLoadingMessages, flowchartBlockLoadingMessages } from "../../util/loadingMessages";

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

    const [selectedSample, setSelectedSample] = useState(null);

    const mermaidRef = useRef(null);

    const sampleSnippets = savedSnippets;
    const explanationLoadingMessages = explainBlockLoadingMessages;
    const flowchartLoadingMessages = flowchartBlockLoadingMessages;

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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

        if (selectedSample) {
            const isSameCode = selectedSample.code.trim() === code.trim();
            const isSameLang = selectedSample.language === language;

            if (!isSameCode || !isSameLang) {
                setSelectedSample(null);
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
    }, [mermaidCode, isLoading, code, language]);

    const handleExplain = async () => {
        if (!code.trim()) return;

        setIsLoading(true);
        setIsExplainBlockLoading(true);
        setExplanation("🧠 Generating explanation... sit tight while we decode the code!");

        const isSampleUnchanged =
            selectedSample &&
            selectedSample.code.trim() === code.trim() &&
            selectedSample.language === language &&
            selectedSample.explanation;

        if (isSampleUnchanged) {
            await delay(3000);
            setExplanation(selectedSample.explanation);
            setIsLoading(false);
            setIsExplainBlockLoading(false);
            return;
        }


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

        const isSampleUnchanged =
            selectedSample &&
            selectedSample.code.trim() === code.trim() &&
            selectedSample.language === language &&
            selectedSample.mermaidCode;

        if (isSampleUnchanged) {
            await delay(3000);
            setMermaidCode(selectedSample.mermaidCode);
            setIsLoading(false);
            setIsFlowchartBlockLoading(false);
            return;
        }

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
                                    setSelectedSample(snippet);
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
