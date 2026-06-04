import { useState } from "react";
import axios from "axios";

function Upload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = async () => {
        if (!file || isUploading) {
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        setMessage("");

        try {
            await axios.post("https://api.profile-agent.com/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setMessage("Profile material uploaded and ready for questions.");
        } catch (error) {
            setMessage("Upload failed. Please check the file and try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <article className="panel upload-panel">
            <div className="panel__header">
                <div>
                    <p className="section-kicker">Source material</p>
                    <h2>Upload Profile Content</h2>
                </div>
                <span className={file ? "status-pill status-pill--ready" : "status-pill"}>
                    {file ? "Selected" : "Waiting"}
                </span>
            </div>

            <label className="dropzone">
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(event) => setFile(event.target.files[0])}
                />
                <span className="dropzone__icon" aria-hidden="true">+</span>
                <strong>{file ? file.name : "Choose a profile document"}</strong>
                <small>Resumes, project notes, awards, testimonials, PDFs, Word docs, or text files.</small>
            </label>

            <button
                className="primary-button"
                onClick={uploadFile}
                disabled={!file || isUploading}
            >
                {isUploading ? "Uploading..." : "Upload content"}
            </button>

            {message && (
                <p className={message.includes("failed") ? "message message--error" : "message"}>
                    {message}
                </p>
            )}
        </article>
    );
}

export default Upload;
