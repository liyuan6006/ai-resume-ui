import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config";
import { splitCitations } from "../sourceUtils";

const questionPrompt =
    "Hi, I am Yuan. I am happy to talk to you. Ask anything about me, my background, my skills, my projects, or my experience.";

function Ask({ onAnswered = () => {}, onResult = () => {}, onCitationClick = () => {} }) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [sourceCount, setSourceCount] = useState(0);
    const [isAsking, setIsAsking] = useState(false);
    const [typedPrompt, setTypedPrompt] = useState("");

    useEffect(() => {
        let currentIndex = 0;

        const typingTimer = setInterval(() => {
            currentIndex += 1;
            setTypedPrompt(questionPrompt.slice(0, currentIndex));

            if (currentIndex >= questionPrompt.length) {
                clearInterval(typingTimer);
            }
        }, 34);

        return () => clearInterval(typingTimer);
    }, []);

    const answerParts = useMemo(() => splitCitations(answer), [answer]);

    const askQuestion = async () => {
        if (!question.trim() || isAsking) {
            return;
        }

        setIsAsking(true);
        setAnswer("");
        setSourceCount(0);
        onResult("", [], null);

        try {
            const response = await axios.post(ENDPOINTS.ask, {
                question: question.trim()
            });

            const nextAnswer = response.data.answer || "";
            const nextSources = Array.isArray(response.data.sources) ? response.data.sources : [];
            const nextUsage = response.data.usage || null;

            setAnswer(nextAnswer);
            setSourceCount(nextSources.length);
            onResult(nextAnswer, nextSources, nextUsage);
            onAnswered();
        } catch {
            setAnswer("Error getting answer. Please try again in a moment.");
            setSourceCount(0);
            onResult("", [], null);
        } finally {
            setIsAsking(false);
        }
    };

    return (
        <article className="panel ask-panel">
            <div className="panel__header">
                <div>
                    <p className="section-kicker">Profile Q&amp;A</p>
                    <h2>Ask Yuan Anything</h2>
                </div>
            </div>

            <label className="question-field">
                <span>Your question</span>
                <textarea
                    rows="5"
                    value={question}
                    placeholder={typedPrompt}
                    onChange={(event) => setQuestion(event.target.value)}
                />
            </label>

            <button
                className="primary-button"
                onClick={askQuestion}
                disabled={!question.trim() || isAsking}
            >
                {isAsking ? "Searching resume..." : "Ask assistant"}
            </button>

            <section className="answer-box" aria-live="polite">
                <div className="answer-box__header">
                    <span>Answer</span>
                    {answer && !isAsking && (
                        <small>
                            {sourceCount > 0
                                ? "Evidence shown in the panel on the right →"
                                : "Generated from uploaded profile context"}
                        </small>
                    )}
                </div>

                {isAsking ? (
                    <div className="thinking" aria-label="Assistant is thinking">
                        <span></span>
                        <span></span>
                        <span></span>
                        <em>Analyzing profile context…</em>
                    </div>
                ) : answer ? (
                    <p className="answer-text">
                        {answerParts.map((part, index) =>
                            part.type === "citation" ? (
                                <button
                                    key={index}
                                    type="button"
                                    className="citation-chip"
                                    title={`Jump to source [${part.value}]`}
                                    onClick={() => onCitationClick(part.value)}
                                >
                                    {part.value}
                                </button>
                            ) : (
                                <span key={index}>{part.value}</span>
                            )
                        )}
                    </p>
                ) : (
                    <p>Answers will appear here after you ask a question.</p>
                )}
            </section>
        </article>
    );
}

export default Ask;
