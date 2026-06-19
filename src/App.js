import { useEffect, useRef, useState } from "react";
import Upload from "./components/Upload";
import Ask from "./components/Ask";
import Sources from "./components/Sources";
import "./App.css";

const workflowStatsKey = "profileAssistantWorkflowStats";
const defaultWorkflowStats = {
    uploads: 0,
    analyses: 0,
    asks: 0
};

// Render token counts with thousands separators; "—" when not available yet.
function formatNum(value) {
    return typeof value === "number" ? value.toLocaleString() : "—";
}

function loadWorkflowStats() {
    try {
        const savedStats = JSON.parse(localStorage.getItem(workflowStatsKey));

        return {
            ...defaultWorkflowStats,
            ...savedStats
        };
    } catch {
        return defaultWorkflowStats;
    }
}

function App() {
    const [workflowStats, setWorkflowStats] = useState(loadWorkflowStats);
    const [result, setResult] = useState({ answer: "", sources: [], usage: null });
    const [scrollTarget, setScrollTarget] = useState(null);
    const scrollNonce = useRef(0);

    useEffect(() => {
        localStorage.setItem(workflowStatsKey, JSON.stringify(workflowStats));
    }, [workflowStats]);

    const recordResult = (answer, sources, usage) => {
        setResult({ answer, sources, usage: usage || null });
    };

    const handleCitationClick = (citation) => {
        scrollNonce.current += 1;
        setScrollTarget({ citation, nonce: scrollNonce.current });
    };

    const recordUpload = () => {
        setWorkflowStats((currentStats) => ({
            ...currentStats,
            uploads: currentStats.uploads + 1,
            analyses: currentStats.analyses + 1
        }));
    };

    const recordAsk = () => {
        setWorkflowStats((currentStats) => ({
            ...currentStats,
            asks: currentStats.asks + 1
        }));
    };

    return (
        <main className="app-shell">
            <div className="grid-overlay" aria-hidden="true"></div>
            <div className="orbs" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <section className="hero">
                <div className="hero__content">
                    <div className="hero__intro">
                        <p className="eyebrow">Your private AI knowledge base</p>
                        <h2 className="hero__title">
                            Turn your own data, materials, and documents into an intelligent assistant.
                        </h2>
                        <p className="hero__lede">
                            Our AI model reads, understands, transforms, and computes your data —
                            then remembers all of your materials. Ask anything about your work or
                            projects and our AI acts like a super-agent, chatting through it with
                            you and pointing to the exact evidence and citations behind every
                            answer.
                        </p>

                        <ol className="hero__steps">
                            <li>
                                <span className="hero__step-num">1</span>
                                <span className="hero__step-text">
                                    <strong>Upload your materials</strong>
                                    Drop your files in the upload section below.
                                </span>
                            </li>
                            <li>
                                <span className="hero__step-num">2</span>
                                <span className="hero__step-text">
                                    <strong>Ask any question</strong>
                                    Get instant, sourced answers from your own content.
                                </span>
                            </li>
                        </ol>
                    </div>

                    <Ask
                        onAnswered={recordAsk}
                        onResult={recordResult}
                        onCitationClick={handleCitationClick}
                    />
                    <Upload onUploaded={recordUpload} />
                </div>

                <aside className="ai-console" aria-label="AI workflow summary">
                    <div className="ai-console__inner">
                    <div className="ai-console__header">
                        <span className="ai-console__status">Model online</span>
                        <span className="ai-console__pulse" aria-hidden="true"></span>
                    </div>

                    {result.sources.length > 0 ? (
                        <Sources
                            answer={result.answer}
                            sources={result.sources}
                            scrollTarget={scrollTarget}
                        />
                    ) : (
                        <>
                            <div className="neural-map" aria-hidden="true">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <p className="ai-console__copy">
                                Your assistant is ready. Ask anything about the materials you've
                                uploaded — background, skills, projects, experience, and more.
                                Every answer comes with the sources and evidence behind it, shown
                                right here.
                            </p>
                        </>
                    )}

                    <div className="hero__metrics hero__metrics--three">
                        <div>
                            <span>{workflowStats.asks}</span>
                            <strong>Asks</strong>
                            <small>Questions answered</small>
                        </div>
                        <div>
                            <span>{formatNum(result.usage?.input_tokens)}</span>
                            <strong>Input</strong>
                            <small>Prompt tokens</small>
                        </div>
                        <div>
                            <span>{formatNum(result.usage?.output_tokens)}</span>
                            <strong>Output</strong>
                            <small>Completion tokens</small>
                        </div>
                    </div>

                    <div className="token-total">
                        <span>Total tokens</span>
                        <small>· last answer</small>
                        <strong>{formatNum(result.usage?.total_tokens)}</strong>
                    </div>

                    {result.sources.length === 0 && (
                        <div className="ai-console__trace" aria-hidden="true">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                    </div>
                </aside>
            </section>

        </main>
    );
}

export default App;
