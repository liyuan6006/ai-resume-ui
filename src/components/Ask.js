import { useState } from "react";
import axios from "axios";

const suggestedQuestions = [
    "What are the strongest themes in this profile?",
    "Summarize the most relevant projects and experience.",
    "What achievements or awards stand out most?"
];

function Ask() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isAsking, setIsAsking] = useState(false);

    const askQuestion = async () => {
        if (!question.trim() || isAsking) {
            return;
        }

        setIsAsking(true);
        setAnswer("");

        try {
            const response = await axios.post("https://api.profile-agent.com/ask", {
                question: question.trim()
            });

            setAnswer(response.data.answer);
        } catch {
            setAnswer("Error getting answer. Please try again in a moment.");
        } finally {
            setIsAsking(false);
        }
    };

    return (
        <article className="panel ask-panel">
            <div className="panel__header">
                <div>
                    <p className="section-kicker">Profile Q&amp;A</p>
                    <h2>Ask About The Profile</h2>
                </div>
            </div>

            <div className="suggestions" aria-label="Suggested questions">
                {suggestedQuestions.map((suggestion) => (
                    <button
                        className="suggestion-chip"
                        key={suggestion}
                        onClick={() => setQuestion(suggestion)}
                        type="button"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            <label className="question-field">
                <span>Your question</span>
                <textarea
                    rows="5"
                    value={question}
                    placeholder="Ask about skills, projects, background, awards, testimonials, experience, or fit for a role..."
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
                    {answer && <small>Generated from uploaded profile context</small>}
                </div>
                <p>{answer || "Answers will appear here after you ask a question."}</p>
            </section>
        </article>
    );
}

export default Ask;
