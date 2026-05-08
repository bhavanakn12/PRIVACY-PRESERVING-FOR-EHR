import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function StaffDischargeSummary() {
  const { admissionId } = useParams();
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/doctor/admission/${admissionId}/discharge-summary`)
      .then(res => setSummary(res.data))
      .catch(() => setSummary(false));
  }, [admissionId]);

  if (summary === false)
    return <div style={{ margin: 64, color: "red" }}>Summary not found.</div>;
  if (!summary) return <div style={{ margin: 64 }}>Loading summary...</div>;
  const { patient, admission, doctor } = summary;

  return (
    <div style={{
      maxWidth: 950, margin: "40px auto", background: "#fff", borderRadius: 13,
      padding: 32, boxShadow: "0 4px 32px #dbe7fdc0", fontFamily: "'Segoe UI',Arial"
    }}>
      <h2 style={{
        fontWeight: 800, fontSize: 30, color: "#17275d", textAlign: "center"
      }}>
        DISCHARGE SUMMARY (Read Only)
      </h2>
      <table style={{ width: "100%", margin: "24px 0 16px", borderCollapse: "collapse", fontSize: 17 }}>
        <tbody>
          <tr>
            <td><b>Patient Name:</b> {patient.name}</td>
            <td><b>Age / Sex:</b> {patient.dob ? Math.floor((Date.now() - new Date(patient.dob).getTime()) / 31536000000) : "-"} / {patient.gender}</td>
            <td><b>Admission Date:</b> {admission.admissionDate ? admission.admissionDate.slice(0, 16).replace("T", " ") : ""}</td>
          </tr>
          <tr>
            <td><b>Date of Birth:</b> {patient.dob ? patient.dob.slice(0, 10) : "-"}</td>
            <td><b>PR Number:</b> {patient.prNumber || "-"}</td>
            <td><b>IP Number:</b> {admission._id}</td>
          </tr>
          <tr>
            <td><b>Father / Spouse:</b> {patient.fatherName || "-"}</td>
            <td><b>Consultant:</b> {doctor?.name || "-"}</td>
            <td><b>Discharge Date:</b> {admission.dischargeDate ? admission.dischargeDate.slice(0, 16).replace("T", " ") : ""}</td>
          </tr>
          <tr>
            <td><b>Department:</b> {admission.department || "-"}</td>
            <td><b>Room:</b> {admission.roomNumber}</td>
            <td><b>Address:</b> {patient.address || "-"}</td>
          </tr>
        </tbody>
      </table>

      <div>
        <b>Presenting Complaints:</b>
        <div style={{ whiteSpace: "pre-line", fontFamily: "inherit" }}>
          {admission.presentingComplaints || "-"}
        </div>
      </div>
      <div>
        <b>On Examination:</b>
        <div style={{ whiteSpace: "pre-line", fontFamily: "inherit" }}>
          {admission.onExamination || "-"}
        </div>
      </div>
      <div>
        <b>Investigations:</b>
        <div style={{ whiteSpace: "pre-line", fontFamily: "inherit" }}>
          {admission.investigations || "-"}
        </div>
      </div>
      <div>
        <b>Course in Hospital:</b>
        <div style={{ whiteSpace: "pre-line", fontFamily: "inherit" }}>
          {admission.courseInHospital || "-"}
        </div>
      </div>
      <div>
        <b>At Discharge:</b>
        <div style={{ whiteSpace: "pre-line", fontFamily: "inherit" }}>
          {admission.atDischarge || "-"}
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <b>Advice on Discharge:</b>
        <table style={{ width: "100%", fontSize: 16, margin: "8px 0", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f6f9ff" }}>
              <th style={{ width: 50 }}>SL.No</th>
              <th>Medication</th>
              <th>Instruction</th>
            </tr>
          </thead>
          <tbody>
            {(admission.adviceOnDischarge || []).map((row, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "center" }}>{idx + 1}</td>
                <td>{row.medication}</td>
                <td>{row.instruction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 18 }}>
        <b>Next Appointment Date:</b> {admission.nextAppointment || "--"}
      </div>
      <div style={{ marginTop: 32 }}>
        <button
          onClick={() => navigate("/staff/dashboard")}
          style={{
            background: "#ef6e54", color: "#fff", fontWeight: 700,
            fontSize: 17, border: "none", borderRadius: 8, padding: "12px 28px"
          }}
        >Back to Staff Dashboard</button>
      </div>
    </div>
  );
}
