import Upload from "./components/Upload";
import Ask from "./components/Ask";
import "./App.css";

function App() {
    return (
        <main className="app-shell">
            <section className="hero">
                <div className="hero__content">
                    <p className="eyebrow">Private profile intelligence</p>
                    <h1>Personal Profile Assistant</h1>
                    <p className="hero__copy">
                        Upload resumes, projects, background notes, awards, testimonials,
                        and other profile material, then ask precise questions from one
                        focused workspace.
                    </p>
                </div>

                <div className="hero__metrics" aria-label="Workflow summary">
                    <div>
                        <span>01</span>
                        <strong>Upload</strong>
                    </div>
                    <div>
                        <span>02</span>
                        <strong>Analyze</strong>
                    </div>
                    <div>
                        <span>03</span>
                        <strong>Ask</strong>
                    </div>
                </div>
            </section>

            <section className="workspace" aria-label="Resume assistant tools">
                <Upload />
                <Ask />
            </section>
        </main>
    );
}

export default App;
