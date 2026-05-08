import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [medicine, setMedicine] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/doctor/patients").then(res => setPatients(res.data));
  }, []);

  const maskPhone = (phone = "") =>
    phone.length > 3
      ? "*".repeat(phone.length - 3) + phone.slice(-3)
      : phone;

  const getAge = (patient) => {
    if (patient.age) return patient.age;
    if (patient.dob) {
      return Math.floor(
        (Date.now() - new Date(patient.dob).getTime()) / 31536000000
      );
    }
    return "-";
  };

  const getName = (p) =>
    p.name ||
    [p.firstName, p.lastName].filter(Boolean).join(" ") ||
    p.firstName ||
    "-";

  const handleSelect = (patient) => {
    setSelected(patient);
    setSymptoms("");
    setMedicine("");
  };

  const handleSave = async () => {
    if (!symptoms.trim() || !medicine.trim()) {
      alert("Please enter both symptoms and medicine");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/doctor/patient/${selected._id}/add-entry`, {
        symptoms,
        medicine,
        date: new Date().toISOString().slice(0, 10)
      });
      const updated = await api.get("/doctor/patients");
      setPatients(updated.data);
      setSelected(updated.data.find(p => p._id === selected._id));
      setSymptoms("");
      setMedicine("");
      alert("Entry saved!");
    } catch {
      alert("Failed to save entry.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #ffe1cb 30%, #fae3d9 100%)"
    }}>
      <div style={{
        background: "linear-gradient(90deg, #73c8f7 0%, #4d8cf7 100%)",
        padding: "24px 32px",
        borderRadius: "0 0 25px 25px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 3px 16px 0 #9ba3b44a"
      }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: "#2d3a4a" }}>
          <img
            src="/logo192.png"
            alt="Logo"
            style={{ height: 40, display: "inline", marginRight: 18, verticalAlign: "middle" }}
          />
          Hospital Dashboard
        </span>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#fa6063",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 8,
            padding: "10px 28px",
            fontSize: 18,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 1px 8px #d04950a6"
          }}
        >Go to Previous Page</button>
      </div>

      <div style={{
        maxWidth: 900,
        margin: "36px auto",
        padding: "32px 28px 52px 28px",
        borderRadius: 28,
        boxShadow: "0 3px 16px 0 #e5b0784a",
        textAlign: "center",
        background: "#fff"
      }}>
        <div style={{ marginBottom: 24, textAlign: "right" }}>
          <button
            onClick={() => navigate("/doctor/inpatients")}
            style={{
              background: "#49ad3a",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 7,
              padding: "8px 24px",
              fontSize: 15,
              border: "none",
              cursor: "pointer",
              marginRight: 6,
              marginTop: 6
            }}
          >
            View Inpatients
          </button>
        </div>
        <h2 style={{
          color: "#bc5a1a",
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 1,
          marginBottom: 32,
          fontFamily: "inherit"
        }}>Doctor Panel</h2>
        <input
          style={{
            width: "75%",
            padding: "12px 18px",
            borderRadius: 12,
            border: "2px solid #eda65b",
            marginBottom: 40,
            fontSize: 18
          }}
          placeholder="Search patients by name, place, gender, phone..."
          // Add filtering logic if needed
        />
        <div style={{
          display: "flex",
          gap: 28,
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          {patients.map((p) => (
            <div
              key={p._id}
              style={{
                minWidth: 240,
                maxWidth: 275,
                background: "#fff",
                border: "2px solid #eda65b",
                borderRadius: 17,
                boxShadow: "0 2px 6px #ffe0bc77",
                padding: "22px 24px",
                textAlign: "left",
                marginBottom: 14,
                cursor: "pointer",
                outline: selected && selected._id === p._id ? "3px solid #4d8cf7" : "none"
              }}
              onClick={() => handleSelect(p)}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  {getName(p)}
                </div>
                <div>Address: <b>{p.address || "-"}</b></div>
                <div>Status: <b>{p.status || "-"}</b></div>
                <div>Gender: <b>{p.gender || "-"}</b></div>
                <div>Phone: <b>{maskPhone(p.phone || "-")}</b></div>
                <div>Age: <b>{p.dob ? Math.floor((Date.now() - new Date(p.dob).getTime()) / 31536000000) : "-"}</b></div>
              </div>
            </div>
          ))}
        </div>

        {/* Symptoms/Medicine Form and Admit Button (below) */}
        {selected && (
          <div style={{
            margin: "42px auto 0 auto",
            padding: 28,
            background: "#f8fafc",
            border: "2.2px solid #4d8cf773",
            borderRadius: 17,
            maxWidth: 420,
            boxShadow: "0 4px 16px #e7e5fa6b",
            textAlign: "left"
          }}>
            <h3 style={{ fontSize: 21, fontWeight: 700, color: "#3191e9", marginBottom: 16 }}>
              Add Symptom & Medicine ({getName(selected)})
            </h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 600 }}>Symptoms</label>
              <input
                style={{
                  width: "100%",
                  padding: 8,
                  marginTop: 5,
                  borderRadius: 7,
                  border: "1.5px solid #b6bac4",
                  fontSize: 16,
                  marginBottom: 9
                }}
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Enter symptoms..."
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 600 }}>Medicine</label>
              <input
                style={{
                  width: "100%",
                  padding: 8,
                  marginTop: 5,
                  borderRadius: 7,
                  border: "1.5px solid #b6bac4",
                  fontSize: 16
                }}
                value={medicine}
                onChange={e => setMedicine(e.target.value)}
                placeholder="Enter medicine..."
              />
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                marginTop: 7,
                background: "#2d7ff9",
                color: "#fff",
                fontWeight: 700,
                padding: "10px 0",
                borderRadius: 8,
                width: "100%",
                fontSize: 16,
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Saving..." : "Save Entry"}
            </button>
            {/* Admit button appears below, only if not inpatient */}
            {selected.status !== "inpatient" && (
              <button
                style={{
                  marginTop: 20,
                  width: "100%",
                  background: "linear-gradient(90deg, #fda758 0%, #f45e62 86%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 0",
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: 0.5,
                  cursor: "pointer",
                  boxShadow: "0 1px 8px #dca04c57"
                }}
                onClick={() => navigate(`/doctor/admit/${selected._id}`)}
              >
                Admit
              </button>
            )}
          </div>
        )}

        {/* OPD/Outpatient Recent History (below admit/add form) */}
        {selected && selected.entries && selected.entries.length > 0 && (
          <div style={{
            margin: "36px auto 0 auto",
            background: "#f5f7fc",
            border: "1.5px solid #adc7ef73",
            borderRadius: 15,
            maxWidth: 420,
            boxShadow: "0 2px 8px #8ea8d633",
            padding: 22,
            textAlign: "left"
          }}>
            <h4 style={{
              color: "#385ad6",
              fontWeight: 700,
              marginBottom: 10,
              fontSize: 18
            }}>Recent OPD History</h4>
            {selected.entries.slice(-5).reverse().map((entry, idx) => (
              <div key={idx} style={{
                marginBottom: 14,
                borderBottom: "1px solid #e1e9fa",
                paddingBottom: 6
              }}>
                <div><b>Date:</b> {entry.date ? entry.date.split("T")[0] : "-"}</div>
                <div><b>Symptoms:</b> {entry.symptoms || "-"}</div>
                <div><b>Medicine:</b> {entry.medicine || "-"}</div>
                {entry.remarks && <div><b>Remarks:</b> {entry.remarks}</div>}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
