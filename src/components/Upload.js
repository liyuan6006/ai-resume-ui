import { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config";

function formatSize(bytes) {
    if (!bytes && bytes !== 0) {
        return "";
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const units = ["KB", "MB", "GB"];
    let size = bytes / 1024;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function Upload({ onUploaded = () => {} }) {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    const selectFile = (nextFile) => {
        if (!nextFile) {
            return;
        }

        setFile(nextFile);
        setMessage("");
    };

    const clearFile = () => {
        setFile(null);
        setMessage("");
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        selectFile(event.dataTransfer.files?.[0]);
    };

    const uploadFile = async () => {
        if (!file || isUploading) {
            return;
        }
        const API_URL = ENDPOINTS.upload;

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        setMessage("");

        try {
            await axios.post(API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            onUploaded();
            setFile(null);
            setMessage("Uploaded! Your AI has learned from this material and it's ready for questions.");
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
                    <p className="section-kicker">Build your knowledge base</p>
                    <h2>Upload Your Materials</h2>
                </div>
                <span className={file ? "status-pill status-pill--ready" : "status-pill"}>
                    {file ? "Ready" : "Waiting"}
                </span>
            </div>

            {file ? (
                <div className="file-card">
                    <span className="file-card__icon" aria-hidden="true">▣</span>
                    <span className="file-card__meta">
                        <strong title={file.name}>{file.name}</strong>
                        <small>{formatSize(file.size)} · ready to upload</small>
                    </span>
                    <button
                        type="button"
                        className="file-card__remove"
                        onClick={clearFile}
                        disabled={isUploading}
                        aria-label="Remove selected file"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <label
                    className={isDragging ? "dropzone dropzone--active" : "dropzone"}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(event) => selectFile(event.target.files[0])}
                    />
                    <span className="dropzone__icon" aria-hidden="true">↑</span>
                    <span className="dropzone__text">
                        <strong>Drop a file or click to browse</strong>
                        <small>Resumes, project notes, awards, or testimonials — PDF, Word, or text. Our AI instantly learns from everything you add.</small>
                    </span>
                </label>
            )}

            <button
                className="primary-button"
                onClick={uploadFile}
                disabled={!file || isUploading}
            >
                {isUploading ? "Uploading…" : "Upload content"}
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
