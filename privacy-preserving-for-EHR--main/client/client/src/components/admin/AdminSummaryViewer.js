import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../../utils/api";

export default function AdminSummaryViewer() {
  const { admissionId } = useParams();
  const location = useLocation();

  const navState = location.state;
  const summaryFromNav = navState && navState.summary;

  const [summary, setSummary] = useState(summaryFromNav || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (summaryFromNav) {
      setSummary(summaryFromNav);
      setError("");
      setLoading(false);
      return;
    }
    if (!admissionId || admissionId === "undefined") {
      setError("Invalid admission id");
      setSummary("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    api
      .get(`/admin/privacy-summary/${admissionId}`)
      .then((res) => setSummary(res.data.summary || "Summary not available"))
      .catch(() => setError("Summary not available"))
      .finally(() => setLoading(false));
  }, [admissionId, summaryFromNav]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc"
      }}
    >
      <div
        style={{
          maxWidth: 900,
          width: "100%",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 6px 32px #dbe7fdc0",
          padding: "48px 56px",
          margin: "0 auto"
        }}
      >
        <h2
          style={{
            fontWeight: 800,
            fontSize: 28,
            color: "#263273",
            textAlign: "center",
            marginBottom: 36
          }}
        >
          Privacy-Preserved Discharge Summary
        </h2>
        {loading && <div style={{ textAlign: "center", fontSize: 18 }}>Loading summary...</div>}
        {error && <div style={{ color: "red", textAlign: "center", fontSize: 18 }}>{error}</div>}
        {summary && (
          <div
            style={{
              fontSize: 20,
              fontFamily: "Segoe UI, Arial",
              color: "#232a38",
              textAlign: "justify",
              whiteSpace: "pre-line"
            }}
          >
            {summary}
          </div>
        )}
      </div>
    </div>
  );
}
