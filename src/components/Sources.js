import { useEffect, useMemo, useRef } from "react";
import { fileIcon, toRelevance, extractCitedNumbers } from "../sourceUtils";

function Sources({ answer = "", sources = [], scrollTarget = null }) {
    const sourceRefs = useRef({});

    const citedNumbers = useMemo(() => extractCitedNumbers(answer), [answer]);

    const sortedSources = useMemo(
        () => [...sources].sort((a, b) => (a.score ?? 1) - (b.score ?? 1)),
        [sources]
    );

    const uniqueFiles = useMemo(
        () => new Set(sources.map((s) => s.file_name)).size,
        [sources]
    );

    // Scroll to a card when a citation chip is clicked on the left panel.
    useEffect(() => {
        if (!scrollTarget) return;
        const node = sourceRefs.current[scrollTarget.citation];
        if (node) {
            node.scrollIntoView({ behavior: "smooth", block: "center" });
            node.classList.add("source-card--flash");
            const timer = setTimeout(() => node.classList.remove("source-card--flash"), 1100);
            return () => clearTimeout(timer);
        }
    }, [scrollTarget]);

    if (sources.length === 0) {
        return null;
    }

    return (
        <section className="sources" aria-label="Sources and evidence">
            <div className="sources__header">
                <span>Sources &amp; Evidence</span>
                <small>
                    {sources.length} passage{sources.length > 1 ? "s" : ""} · {uniqueFiles} doc
                    {uniqueFiles > 1 ? "s" : ""}
                </small>
            </div>

            <ol className="sources__list">
                {sortedSources.map((source) => {
                    const relevance = toRelevance(source.score);
                    const isCited = citedNumbers.has(source.citation);
                    return (
                        <li
                            key={source.citation}
                            ref={(node) => {
                                sourceRefs.current[source.citation] = node;
                            }}
                            className={`source-card${isCited ? " source-card--cited" : ""}`}
                        >
                            <div className="source-card__rail">
                                <span className="source-card__badge">{source.citation}</span>
                                <span className="source-card__filetype">{fileIcon(source.file_type)}</span>
                            </div>

                            <div className="source-card__body">
                                <div className="source-card__top">
                                    <strong className="source-card__name" title={source.file_name}>
                                        {source.file_name}
                                    </strong>
                                    {isCited && <span className="source-card__cited">Cited</span>}
                                </div>

                                <div className="source-card__tags">
                                    <span className="source-tag">
                                        {(source.file_type || "file").replace(".", "").toUpperCase()}
                                    </span>
                                    {source.page != null && (
                                        <span className="source-tag">Page {source.page}</span>
                                    )}
                                    {relevance != null && (
                                        <span className="source-tag source-tag--score">{relevance}% match</span>
                                    )}
                                </div>

                                {relevance != null && (
                                    <div
                                        className="relevance-bar"
                                        role="meter"
                                        aria-valuenow={relevance}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={`Relevance ${relevance}%`}
                                    >
                                        <span style={{ width: `${relevance}%` }} />
                                    </div>
                                )}

                                {source.snippet && (
                                    <p className="source-card__snippet">“{source.snippet.trim()}…”</p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}

export default Sources;
