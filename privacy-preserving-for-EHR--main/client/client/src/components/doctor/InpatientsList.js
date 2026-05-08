import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function InpatientsList() {
  const [inpatients, setInpatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/doctor/inpatients")
      .then(res => {
        setInpatients(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch inpatients.");
        setLoading(false);
      });
  }, []);

  const getAge = (dob) =>
    dob ? Math.floor((Date.now() - new Date(dob).getTime()) / 31536000000) : "-";

  if (loading) return <div style={{ margin: 32 }}>Loading...</div>;
  if (error) return <div style={{ color: "red", margin: 32 }}>{error}</div>;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(120deg, #f5f8ff 60%, #deeaff 100%)" }}>
      <div
        style={{
          background: "#3577aa",
          color: "#fff",
          fontWeight: 800,
          fontSize: 30,
          padding: "28px 40px 16px 60px",
          letterSpacing: 1,
          fontFamily: "inherit"
        }}
      >
        Inpatient List
        <button
          onClick={() => navigate("/doctor")}
          style={{
            float: "right",
            background: "#204764",
            color: "#fff",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 18,
            marginTop: 2,
            border: "none",
            cursor: "pointer"
          }}
        >
          Dashboard
        </button>
      </div>
      <div
        style={{
          maxWidth: 950,
          margin: "40px auto",
          padding: "18px 18px 12px 18px",
          borderRadius: 18,
          background: "#fff",
          boxShadow: "0 4px 18px #709cc12e"
        }}
      >
        {inpatients.length === 0 && (
          <div style={{ margin: 38, textAlign: "center", color: "#bd3d25" }}>
            No inpatients found.
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "center"
          }}
        >
          {inpatients.filter(ip => ip.patient).map((ip) => (
            <div
              key={ip.currentAdmissionId}
              style={{
                minWidth: 260,
                maxWidth: 300,
                background: "#fafcff",
                border: "2.2px solid #3076ea46",
                borderRadius: 13,
                boxShadow: "0 1.5px 6px #3077e71c",
                padding: "24px 21px",
                textAlign: "left",
                cursor: "pointer"
              }}
              onClick={() =>
                navigate(
                  `/doctor/admission/${ip.currentAdmissionId}/day/${ip.nextDay || 1}`
                )
              }
            >
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                {(ip.patient && ip.patient.name) || "-"}
              </div>
              <div>Status: <b>{ip.patient && ip.patient.status ? ip.patient.status : "-"}</b></div>
              <div>Room: <b>{ip.roomNumber || "-"}</b></div>
              <div>Gender: <b>{ip.patient && ip.patient.gender ? ip.patient.gender : "-"}</b></div>
              <div>Phone: <b>{ip.patient && ip.patient.phone ? ip.patient.phone : "-"}</b></div>
              <div>Age: <b>{ip.patient && ip.patient.dob ? getAge(ip.patient.dob) : "-"}</b></div>
              <div>Admitted: <b>
                {ip.admissionDate
                  ? new Date(ip.admissionDate).toLocaleDateString()
                  : "-"}
              </b></div>
              <div style={{ marginTop: 9, fontWeight: 500 }}>Click to update today's record &rarr;</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
