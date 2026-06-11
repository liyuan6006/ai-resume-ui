// Shared helpers for rendering answer citations and source metadata.

const FILE_ICONS = {
    ".pdf": "📄",
    ".docx": "📝",
    ".doc": "📝",
    ".txt": "🗒️",
    ".md": "🗒️"
};

export const fileIcon = (type) => FILE_ICONS[(type || "").toLowerCase()] || "📁";

// API score is a vector distance — lower means a closer/more relevant match.
// Convert to an intuitive 0–100% relevance for display.
export const toRelevance = (score) => {
    if (typeof score !== "number") return null;
    return Math.max(0, Math.min(100, Math.round((1 - score) * 100)));
};

// Split an answer into text + inline citation tokens like [1] or [1][2].
export const splitCitations = (text) => {
    if (!text) return [];
    const parts = [];
    const regex = /\[(\d+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
        }
        parts.push({ type: "citation", value: Number(match[1]) });
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push({ type: "text", value: text.slice(lastIndex) });
    }

    return parts;
};

// The set of citation numbers actually referenced in an answer body.
export const extractCitedNumbers = (text) => {
    const set = new Set();
    const regex = /\[(\d+)\]/g;
    let match;
    while ((match = regex.exec(text || "")) !== null) {
        set.add(Number(match[1]));
    }
    return set;
};
