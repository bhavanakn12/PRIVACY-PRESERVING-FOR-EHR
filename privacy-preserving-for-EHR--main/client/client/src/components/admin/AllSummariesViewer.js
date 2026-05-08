import React, { useEffect, useState } from "react";

export default function AllSummariesViewer() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummaries() {
      try {
        const res = await fetch("/api/summary/all-summaries");
        const data = await res.json();
        setSummaries(data);
      } catch (err) {
        alert("Failed to fetch summaries");
        setSummaries([]);
      }
      setLoading(false);
    }
    fetchSummaries();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h2>All Uploaded Discharge Summaries</h2>
      {loading ? (
        <p>Loading...</p>
      ) : summaries.length > 0 ? (
        <ul>
          {summaries.map(s => (
            <li key={s._id} style={{
              marginBottom: 24,
              padding: 18,
              border: "1px solid #ddd",
              borderRadius: 7,
              background: "#fafaff"
            }}>
              <b>File:</b> {s.filename}<br />
              <b>Uploaded:</b> {new Date(s.uploadedAt).toLocaleString()}<br />
              <b>Summary:</b>
              <div style={{
                marginTop: 4,
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                color: "#2a2a3d"
              }}>{s.summaryText}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No summaries found.</p>
      )}
    </div>
  );
}
