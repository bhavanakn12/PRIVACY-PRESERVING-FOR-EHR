import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadDischargeSummary() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files)); // allow multiple files
  };

  const handleGenerateSummaries = async () => {
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }
    setLoading(true);
    const allSummaries = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch("/api/summary/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (data.privacyPreservedText) {
          allSummaries.push({
            filename: file.name,
            summary: data.privacyPreservedText,
          });
        } else {
          allSummaries.push({
            filename: file.name,
            summary: data.error || "Failed to generate summary.",
          });
        }
      } catch (err) {
        allSummaries.push({
          filename: file.name,
          summary: "Network or server error.",
        });
        console.error("Upload error:", err);
      }
    }
    setLoading(false);
    setSummaries(allSummaries);
  };

  const handleViewAllSummaries = () => {
    navigate("/admin/all-summaries");
  };

  return (
    <div
      style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: 32,
        background: "#b4c9d8ff"

      // background: "url('/images/upload.jpeg') center/cover"

 // <--- background color added here
      }}
    >
      <h2>Upload Discharge Summaries</h2>
      <input
        type="file"
        accept="application/pdf,image/*"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: 16, display: "block", background: "#ddce94ff"
 }}
      />
      <button
        onClick={handleGenerateSummaries}
        disabled={loading}
        style={{
          padding: "10px 25px",
          background: "#2856ee",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 16,
          cursor: "pointer",
          marginRight: 10,
        }}
      >
        {loading ? "Generating..." : "Generate Privacy-Preserved Summaries"}
      </button>
      <button
        onClick={handleViewAllSummaries}
        style={{
          padding: "10px 20px",
          background: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: 6,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        View All Saved Summaries
      </button>
      <div style={{ marginTop: 24 }}>
        {summaries.length > 0 && (
          <div>
            <h3>Generated Summaries:</h3>
            <ul>
              {summaries.map(({ filename, summary }, idx) => (
                <li key={idx} style={{ marginBottom: 16 }}>
                  <strong>{filename}:</strong>
                  <p>{summary}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
