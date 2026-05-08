//client/src/components/doctor/DischargeSummary.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function DischargeSummary() {
  const { admissionId } = useParams();
  const navigate = useNavigate();

  // All fields
  const [fatherOrSpouse, setFatherOrSpouse] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [atDischarge, setAtDischarge] = useState("");
  const [adviceRows, setAdviceRows] = useState([{ medication: "", instruction: "" }]);
  const [presentingComplaints, setPresentingComplaints] = useState("");
  const [onExamination, setOnExamination] = useState("");
  const [investigations, setInvestigations] = useState("");
  const [courseInHospital, setCourseInHospital] = useState("");
  const [nextAppointment, setNextAppointment] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [summary, setSummary] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
const [patientName, setPatientName] = useState("");
const [patientDOB, setPatientDOB] = useState("");
const [patientSex, setPatientSex] = useState("");
const [patientAddress, setPatientAddress] = useState("");
const [admitDate, setAdmitDate] = useState("");
  // Admission-based fetch
  useEffect(() => {
    if (admissionId) {
      api
        .get(`/doctor/admission/${admissionId}/discharge-summary`)
        .then((res) => {
          setSummary(res.data);
          setFatherOrSpouse(res.data?.patient?.fatherName || "");
          setDischargeDate(
            res.data?.admission?.dischargeDate
              ? res.data.admission.dischargeDate.slice(0, 10)
              : new Date().toISOString().slice(0, 10)
          );
          setDiagnosis(res.data?.admission?.diagnosis || "");
          setPresentingComplaints(res.data?.admission?.presentingComplaints || "");
          setOnExamination(res.data?.admission?.onExamination || "");
          setInvestigations(res.data?.admission?.investigations || "");
          setCourseInHospital(res.data?.admission?.courseInHospital || "");
          setAtDischarge(res.data?.admission?.atDischarge || "");
          setAdviceRows(
            res.data?.admission?.adviceOnDischarge?.length
              ? res.data.admission.adviceOnDischarge
              : [{ medication: "", instruction: "" }]
          );
          setNextAppointment(res.data?.admission?.nextAppointment || "");
        })
        .catch(() => setSummary(false));
    }
  }, [admissionId]);

  function isValid() {
    return (
      fatherOrSpouse.trim() &&
      dischargeDate &&
      atDischarge.trim() &&
      presentingComplaints.trim() &&
      onExamination.trim() &&
      investigations.trim() &&
      courseInHospital.trim() &&
      adviceRows.length > 0 &&
      adviceRows.every((row) => row.medication.trim() && row.instruction.trim()) &&
      diagnosis.trim()
    );
  }

  function handleAdviceChange(idx, field, value) {
    const updated = adviceRows.map((row, i) =>
      i === idx ? { ...row, [field]: value } : row
    );
    setAdviceRows(updated);
  }
  function addAdviceRow() {
    setAdviceRows([...adviceRows, { medication: "", instruction: "" }]);
  }
  function removeAdviceRow(idx) {
    if (adviceRows.length === 1) return;
    setAdviceRows(adviceRows.filter((_, i) => i !== idx));
  }

  function handleSave() {
    setTouched(true);
    if (!isValid()) {
      setError(
        "All required fields (Father/Spouse, Discharge Date, text areas, advice rows, and diagnosis) must be filled."
      );
      return;
    }
    setLoading(true);
    const payload = {
      fatherOrSpouse,
      dischargeDate,
      presentingComplaints,
      onExamination,
      investigations,
      courseInHospital,
      atDischarge,
      adviceRows,
      nextAppointment,
      diagnosis
    };

    if (admissionId) {
      api.post(`/doctor/discharge-summary/${admissionId}`, payload)
        .then(() => {
          setError("");
          alert("Discharge summary saved!");
        })
        .catch(() => {
          setError("Failed to save summary. Please try again.");
        })
        .finally(() => setLoading(false));
    } else {
      // Manual entry, privacy preserving summary generation
     fetch("http://localhost:5000/api/summary/manual", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    patientName,
    patientDOB,
    patientSex,
    patientAddress,
    admitDate,
    fatherOrSpouse,
    dischargeDate,
    diagnosis,
    presentingComplaints,
    onExamination,
    investigations,
    courseInHospital,
    atDischarge,
    adviceRows,
    nextAppointment
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.privacyPreservedText) {
      navigate("/admin/summary-viewer", {
        state: { summary: data.privacyPreservedText }
      });
    } else {
      setResult(data.error || "Error occurred.");
      setError(data.error || "Error occurred.");
    }
  })
  .catch(() => {
    setResult("Request failed.");
    setError("Request failed.");
  })
  .finally(() => setLoading(false))

        .then(res => res.json())
        .then(data => {
  if (data.privacyPreservedText) {
    navigate("/admin/summary-viewer", { 
      state: {
        summary: data.privacyPreservedText
      }
    });
  } else {
    setResult(data.error || "Error occurred.");
    setError(data.error || "Error occurred.");
  }
})


        .catch(() => {
          setError("Failed to generate summary. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }

  // ---- MANUAL DATA ENTRY (NO ADMISSIONID) ----
  if (!admissionId) {
    return (
      <div
        style={{
          maxWidth: 950,
          margin: "40px auto",
          background: "#fff",
          borderRadius: 13,
          padding: 32,
          boxShadow: "0 4px 32px #dbe7fdc0",
          fontFamily: "'Segoe UI',Arial",
        }}
      >
        <h2 style={{
          fontWeight: 800, fontSize: 30, color: "#17275d",
          textAlign: "center", letterSpacing: 1.2, marginBottom: 30
        }}>
          Add Discharge Summary Manually
        </h2>
<div style={{ marginTop: 8 }}>
  <b>Patient Name:</b>
  <input
    type="text"
    required
    value={patientName}
    onChange={e => setPatientName(e.target.value)}
    style={{
      width: "99%",
      marginTop: 5,
      marginBottom: 10,
      border: !patientName && touched ? "2px solid #f33" : "1px solid #c4d0fc",
      borderRadius: 6,
      fontSize: 16,
      padding: 6,
    }}
    placeholder="Full Name"
  />
</div>
<div style={{ marginTop: 8 }}>
  <b>Date of Birth:</b>
  <input
    type="date"
    required
    value={patientDOB}
    onChange={e => setPatientDOB(e.target.value)}
    style={{
      fontSize: 16,
      borderRadius: 6,
      border: !patientDOB && touched ? "2px solid #f33" : "1px solid #c4d0fc",
      padding: 6,
      width: 225,
      marginLeft: 8
    }}
  />
</div>
<div style={{ marginTop: 8 }}>
  <b>Sex:</b>
  <select
    required
    value={patientSex}
    onChange={e => setPatientSex(e.target.value)}
    style={{
      fontSize: 16,
      borderRadius: 6,
      border: !patientSex && touched ? "2px solid #f33" : "1px solid #c4d0fc",
      padding: 6,
      width: 140,
      marginLeft: 8
    }}
  >
    <option value="">Select</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>
<div style={{ marginTop: 8 }}>
  <b>Address:</b>
  <input
    type="text"
    required
    value={patientAddress}
    onChange={e => setPatientAddress(e.target.value)}
    style={{
      width: "99%",
      marginTop: 5,
      marginBottom: 10,
      border: !patientAddress && touched ? "2px solid #f33" : "1px solid #c4d0fc",
      borderRadius: 6,
      fontSize: 16,
      padding: 6,
    }}
    placeholder="Full Address"
  />
</div>
<div style={{ marginTop: 8 }}>
  <b>Admit Date:</b>
  <input
    type="date"
    required
    value={admitDate}
    onChange={e => setAdmitDate(e.target.value)}
    style={{
      fontSize: 16,
      borderRadius: 6,
      border: !admitDate && touched ? "2px solid #f33" : "1px solid #c4d0fc",
      padding: 6,
      width: 225,
      marginLeft: 8
    }}
  />
</div>

        <div style={{ marginTop: 18 }}>
          <b>Father/Spouse:</b>
          <input
            type="text"
            required
            value={fatherOrSpouse}
            onChange={e => setFatherOrSpouse(e.target.value)}
            style={{
              width: "99%",
              marginTop: 5,
              marginBottom: 10,
              border: !fatherOrSpouse && touched ? "2px solid #f33" : "1px solid #c4d0fc",
              borderRadius: 6,
              fontSize: 16,
              padding: 6,
            }}
            placeholder="Father/Spouse Name"
          />
        </div>
        <div style={{ marginTop: 18 }}>
          <b>Discharge Date:</b>
          <input
            type="date"
            required
            value={dischargeDate}
            onChange={e => setDischargeDate(e.target.value)}
            style={{
              fontSize: 16,
              borderRadius: 6,
              border: !dischargeDate && touched ? "2px solid #f33" : "1px solid #c4d0fc",
              padding: 6,
              width: 225,
              marginLeft: 8
            }}
          />
        </div>
        <div style={{ marginTop: 18 }}>
          <b>Diagnosis:</b>
          <input
            type="text"
            value={diagnosis}
            onChange={e => setDiagnosis(e.target.value)}
            required
            style={{
              width: "99%",
              marginTop: 5,
              marginBottom: 10,
              border: !diagnosis && touched ? "2px solid #f33" : "1px solid #c4d0fc",
              borderRadius: 6,
              fontSize: 16,
              padding: 6,
              display: "block"
            }}
            placeholder="Diagnosis (e.g. Malaria, Pneumonia, Term pregnancy)"
          />
        </div>
        <div style={{ margin: "15px 0 0 0" }}>
          <b>Presenting Complaints:</b>
          <textarea
            value={presentingComplaints}
            onChange={(e) => setPresentingComplaints(e.target.value)}
            onBlur={() => setTouched(true)}
            required
            rows={3}
            style={{
              width: "99%",
              marginTop: 5,
              marginBottom: 5,
              resize: "vertical",
              border: !presentingComplaints && touched ? "2px solid #f33" : "1px solid #c4d0fc",
              borderRadius: 6,
              fontSize: 16,
              padding: 6,
            }}
            placeholder="List complaints, one per line (e.g. Fever 3 days&#10;Abdominal pain&#10;...)"
          />
        </div>
        <div style={{ marginTop: 18 }}>
          <b>On Examination:</b>
          <textarea
            value={onExamination}
            onChange={(e) => setOnExamination(e.target.value)}
            onBlur={() => setTouched(true)}
            required
            rows={3}
            style={{
              width: "99%",
              marginTop: 5,
              marginBottom: 5,
              resize: "vertical",
              border: !onExamination && touched ? "2px solid #f33" : "1px solid #c4d0fc",
              borderRadius: 6,
              fontSize: 16,
              padding: 6,
            }}
            placeholder="Brief examination notes and findings"
          />
        </div>
        <div style={{ marginTop: 18 }}>
          <b>Investigations:</b>
          <textarea
            value={investigations}
            onChange={(e) => setInvestigations(e.target.value)}
            onBlur={() => setTouched(true)}
            required
            rows={3}
            style={{
              width: "99%",
              marginTop: 5,
              marginBottom: 5,
              resize: "vertical",
              border: !investigations && touched ? "2px solid #f33" : "1px solid #c4d0fc",
              borderRadius: 6,
              fontSize: 16,
              padding: 6,
            }}
            placeholder="List lab results and findings"
          />
        </div>
        <div style={{ marginTop: 18 }}>
          <b>Course in Hospital:</b>
          <textarea
            value={courseInHospital}
            onChange={(e) => setCourseInHospital(e.target.value)}
            onBlur={() => setTouched(true)}
            required
            rows={3}
            style={{
              width: "99%",
              marginTop: 5,
              marginBottom: 5,
              resize: "vertical",
              border: !courseInHospital && touched ? "2px solid #f33" : "1px solid #c4d0fc",
              borderRadius: 6,
              fontSize: 16,
              padding: 6,
            }}
            placeholder="Summary of events/findings during admission"
          />
        </div>
        <div style={{ marginTop: 18 }}>
          <b>At discharge:</b>
          <textarea
            value={atDischarge}
            onChange={(e) => setAtDischarge(e.target.value)}
            onBlur={() => setTouched(true)}
            required
            rows={2}
            style={{
              width: "99%",
              marginTop: 5,
              marginBottom: 5,
              resize: "vertical",
              border: !atDischarge && touched ? "2px solid #f33" : "1px solid #c4d0fc",
              borderRadius: 6,
              fontSize: 16,
              padding: 6,
            }}
            placeholder="Enter patient's condition and key findings..."
          />
        </div>
        <div style={{ marginTop: 24 }}>
          <b>Advice on Discharge:</b>
          <table
            style={{
              width: "100%",
              fontSize: 16,
              margin: "8px 0",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#f6f9ff" }}>
                <th style={{ width: 50 }}>SL.No</th>
                <th>Medication</th>
                <th>Instruction</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {adviceRows.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "center" }}>{idx + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={row.medication}
                      required
                      onChange={(e) =>
                        handleAdviceChange(idx, "medication", e.target.value)
                      }
                      style={{
                        width: "97%",
                        padding: 4,
                        borderRadius: 4,
                        border:
                          !row.medication && touched
                            ? "2px solid #f33"
                            : "1px solid #ccc",
                      }}
                      placeholder="Enter medicine name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.instruction}
                      required
                      onChange={(e) =>
                        handleAdviceChange(idx, "instruction", e.target.value)
                      }
                      style={{
                        width: "98%",
                        padding: 4,
                        borderRadius: 4,
                        border:
                          !row.instruction && touched
                            ? "2px solid #f33"
                            : "1px solid #ccc",
                      }}
                      placeholder="e.g. 1-0-1 x 5 days"
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {adviceRows.length > 1 && (
                      <button
                        type="button"
                        style={{
                          background: "#f55",
                          border: "none",
                          color: "#fff",
                          borderRadius: 6,
                          width: 28,
                          height: 28,
                          cursor: "pointer",
                        }}
                        onClick={() => removeAdviceRow(idx)}
                      >
                        &minus;
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addAdviceRow}
            style={{
              background: "#1da855",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              borderRadius: 8,
              padding: "7px 16px",
              marginTop: 2,
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            + Add Row
          </button>
        </div>
        <div style={{ marginTop: 18 }}>
          <b>Next Visit Date / Next Appointment:</b>
          <input
            type="date"
            value={nextAppointment}
            onChange={(e) => setNextAppointment(e.target.value)}
            style={{
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #c4d0fc",
              padding: 6,
              marginLeft: 8,
              width: 210,
            }}
          />
          {nextAppointment && (
            <div style={{ fontSize: 16, marginTop: 6 }}>
              Next Visit/Appointment: <b>{nextAppointment}</b>
            </div>
          )}
        </div>
        {error && (
          <div style={{ color: "#f22", fontWeight: 600, marginTop: 14 }}>
            {error}
          </div>
        )}
        <div style={{ marginTop: 32, display: "flex", gap: 18 }}>
          <button
            onClick={handleSave}
            disabled={!isValid() || loading}
            style={{
              background: isValid() ? "#225de7" : "#9ab2f5",
              color: "#fff",
              fontWeight: 800,
              fontSize: 19,
              border: "none",
              borderRadius: 8,
              padding: "12px 36px",
              cursor: isValid() ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Processing..." : "Generate Privacy-Preserved Summary"}
          </button>
        </div>
        {result &&
          <div style={{ background: "#f0f0f0", padding: 18, borderRadius: 8, marginTop: 30 }}>
            <h4 className="font-bold mb-2">Privacy-Preserved Summary:</h4>
            <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
          </div>
        }
      </div>
    );
  }

  // ---- ADMISSION-BASED SUMMARY (unchanged) ----
  if (summary === false) {
    return <div style={{ margin: 64, color: "red" }}>Summary not found.</div>;
  }
  if (!summary) {
    return <div style={{ margin: 64 }}>Loading summary...</div>;
  }

  const { patient, admission, doctor, opdHistory } = summary;

  return (
    <div
      style={{
        maxWidth: 950,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 13,
        padding: 32,
        boxShadow: "0 4px 32px #dbe7fdc0",
        fontFamily: "'Segoe UI',Arial",
      }}
    >
      <h2
        style={{
          fontWeight: 800,
          fontSize: 30,
          color: "#17275d",
          textAlign: "center",
          letterSpacing: 1.2,
        }}
      >
        DISCHARGE SUMMARY
      </h2>
      <table
        style={{
          width: "100%",
          margin: "24px 0 16px",
          borderCollapse: "collapse",
          fontSize: 17,
        }}
      >
        <tbody>
          <tr>
            <td>
              <b>Patient Name:</b> {patient.name}
            </td>
            <td>
              <b>Age / Sex:</b>{" "}
              {patient.dob
                ? Math.floor(
                    (Date.now() - new Date(patient.dob).getTime()) /
                      31536000000
                  )
                : "-"}{" "}
              / {patient.gender}
            </td>
            <td>
              <b>Admission Date:</b>{" "}
              {admission.admissionDate
                ? admission.admissionDate.slice(0, 16).replace("T", " ")
                : ""}
            </td>
          </tr>
          <tr>
            <td>
              <b>Date of Birth:</b> {patient.dob ? patient.dob.slice(0, 10) : "-"}
            </td>
            <td>
              <b>IP Number:</b> {admission._id}
            </td>
          </tr>
          <tr>
            <td>
              <b>Father / Spouse:</b>
              <input
                type="text"
                value={fatherOrSpouse}
                onChange={(e) => setFatherOrSpouse(e.target.value)}
                style={{
                  fontSize: 16,
                  borderRadius: 6,
                  border: !fatherOrSpouse && touched ? "2px solid #f33" : "1px solid #c4d0fc",
                  padding: 4,
                  marginLeft: 8,
                  width: 170,
                }}
                required
                placeholder="Enter name"
              />
            </td>
            <td>
              <b>Consultant:</b> {doctor?.name || "-"}
            </td>
            <td>
              <b>Discharge Date:</b>
              <input
                type="date"
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
                style={{
                  fontSize: 16,
                  borderRadius: 6,
                  border: !dischargeDate && touched ? "2px solid #f33" : "1px solid #c4d0fc",
                  padding: 4,
                  marginLeft: 8,
                }}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <b>Department:</b> {admission.department || "-"}
            </td>
            <td>
              <b>Room:</b> {admission.roomNumber}
            </td>
            <td>
              <b>Address:</b> {patient.address || "-"}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 18 }}>
        <b>Diagnosis:</b>
        <input
          type="text"
          value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          required
          style={{
            width: "99%",
            marginTop: 5,
            marginBottom: 10,
            border: !diagnosis && touched ? "2px solid #f33" : "1px solid #c4d0fc",
            borderRadius: 6,
            fontSize: 16,
            padding: 6,
            display: "block"
          }}
          placeholder="Diagnosis (e.g. Malaria, Pneumonia, Term pregnancy)"
        />
      </div>
      <div style={{ margin: "15px 0 0 0" }}>
        <b>Pre-admission (OPD) History</b>
        {opdHistory.length === 0 ? (
          <div style={{ color: "#aaa", fontSize: 15 }}>
            (No OPD history found)
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              fontSize: 15,
              marginTop: 6,
              marginBottom: 10,
              background: "#fafbfc",
            }}
          >
            <thead>
              <tr style={{ background: "#e9f0fc" }}>
                <th>Date</th>
                <th>Symptoms</th>
                <th>Medicine</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {opdHistory.map((opd, idx) => (
                <tr key={idx}>
                  <td>{opd.date ? opd.date.slice(0, 10) : "-"}</td>
                  <td>{opd.symptoms || "-"}</td>
                  <td>{opd.medicine || "-"}</td>
                  <td>{opd.remarks || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: 18 }}>
        <b>Presenting Complaints:</b>
        <textarea
          value={presentingComplaints}
          onChange={(e) => setPresentingComplaints(e.target.value)}
          onBlur={() => setTouched(true)}
          required
          rows={3}
          style={{
            width: "99%",
            marginTop: 5,
            marginBottom: 5,
            resize: "vertical",
            border: !presentingComplaints && touched ? "2px solid #f33" : "1px solid #c4d0fc",
            borderRadius: 6,
            fontSize: 16,
            padding: 6,
          }}
          placeholder="List complaints, one per line (e.g. Fever 3 days&#10;Abdominal pain&#10;...)"
        />
      </div>
      <div style={{ marginTop: 18 }}>
        <b>On Examination:</b>
        <textarea
          value={onExamination}
          onChange={(e) => setOnExamination(e.target.value)}
          onBlur={() => setTouched(true)}
          required
          rows={3}
          style={{
            width: "99%",
            marginTop: 5,
            marginBottom: 5,
            resize: "vertical",
            border: !onExamination && touched ? "2px solid #f33" : "1px solid #c4d0fc",
            borderRadius: 6,
            fontSize: 16,
            padding: 6,
          }}
          placeholder="Brief examination notes and findings"
        />
      </div>
      <div style={{ marginTop: 18 }}>
        <b>Investigations:</b>
        <textarea
          value={investigations}
          onChange={(e) => setInvestigations(e.target.value)}
          onBlur={() => setTouched(true)}
          required
          rows={3}
          style={{
            width: "99%",
            marginTop: 5,
            marginBottom: 5,
            resize: "vertical",
            border: !investigations && touched ? "2px solid #f33" : "1px solid #c4d0fc",
            borderRadius: 6,
            fontSize: 16,
            padding: 6,
          }}
          placeholder="List lab results and findings"
        />
      </div>
      <div style={{ marginTop: 18 }}>
        <b>Course in Hospital:</b>
        <textarea
          value={courseInHospital}
          onChange={(e) => setCourseInHospital(e.target.value)}
          onBlur={() => setTouched(true)}
          required
          rows={3}
          style={{
            width: "99%",
            marginTop: 5,
            marginBottom: 5,
            resize: "vertical",
            border: !courseInHospital && touched ? "2px solid #f33" : "1px solid #c4d0fc",
            borderRadius: 6,
            fontSize: 16,
            padding: 6,
          }}
          placeholder="Summary of events/findings during admission"
        />
        {courseInHospital.trim() && (
          <div
            style={{ marginTop: 4, marginBottom: 8, fontSize: 16 }}
          >
            {courseInHospital
              .split("\n")
              .map((x, i) => <div key={i}>{x.trim()}</div>)}
          </div>
        )}
      </div>
      <div style={{ marginTop: 18 }}>
        <b>At discharge:</b>
        <textarea
          value={atDischarge}
          onChange={(e) => setAtDischarge(e.target.value)}
          onBlur={() => setTouched(true)}
          required
          rows={2}
          style={{
            width: "99%",
            marginTop: 5,
            marginBottom: 5,
            resize: "vertical",
            border: !atDischarge && touched ? "2px solid #f33" : "1px solid #c4d0fc",
            borderRadius: 6,
            fontSize: 16,
            padding: 6,
          }}
          placeholder="Enter patient's condition and key findings..."
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <b>Advice on Discharge:</b>
        <table
          style={{
            width: "100%",
            fontSize: 16,
            margin: "8px 0",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f6f9ff" }}>
              <th style={{ width: 50 }}>SL.No</th>
              <th>Medication</th>
              <th>Instruction</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {adviceRows.map((row, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "center" }}>{idx + 1}</td>
                <td>
                  <input
                    type="text"
                    value={row.medication}
                    required
                    onChange={(e) =>
                      handleAdviceChange(idx, "medication", e.target.value)
                    }
                    style={{
                      width: "97%",
                      padding: 4,
                      borderRadius: 4,
                      border:
                        !row.medication && touched
                          ? "2px solid #f33"
                          : "1px solid #ccc",
                    }}
                    placeholder="Enter medicine name"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.instruction}
                    required
                    onChange={(e) =>
                      handleAdviceChange(idx, "instruction", e.target.value)
                    }
                    style={{
                      width: "98%",
                      padding: 4,
                      borderRadius: 4,
                      border:
                        !row.instruction && touched
                          ? "2px solid #f33"
                          : "1px solid #ccc",
                    }}
                    placeholder="e.g. 1-0-1 x 5 days"
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  {adviceRows.length > 1 && (
                    <button
                      type="button"
                      style={{
                        background: "#f55",
                        border: "none",
                        color: "#fff",
                        borderRadius: 6,
                        width: 28,
                        height: 28,
                        cursor: "pointer",
                      }}
                      onClick={() => removeAdviceRow(idx)}
                    >
                      &minus;
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addAdviceRow}
          style={{
            background: "#1da855",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            borderRadius: 8,
            padding: "7px 16px",
            marginTop: 2,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          + Add Row
        </button>
      </div>
      <div style={{ marginTop: 18 }}>
        <b>Next Visit Date / Next Appointment:</b>
        <input
          type="date"
          value={nextAppointment}
          onChange={(e) => setNextAppointment(e.target.value)}
          style={{
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #c4d0fc",
            padding: 6,
            marginLeft: 8,
            width: 210,
          }}
        />
        {nextAppointment && (
          <div style={{ fontSize: 16, marginTop: 6 }}>
            Next Visit/Appointment: <b>{nextAppointment}</b>
          </div>
        )}
      </div>
      {error && (
        <div style={{ color: "#f22", fontWeight: 600, marginTop: 14 }}>
          {error}
        </div>
      )}
      <div style={{ marginTop: 32, display: "flex", gap: 18 }}>
        <button
          onClick={handleSave}
          disabled={!isValid()}
          style={{
            background: isValid() ? "#225de7" : "#9ab2f5",
            color: "#fff",
            fontWeight: 800,
            fontSize: 19,
            border: "none",
            borderRadius: 8,
            padding: "12px 36px",
            cursor: isValid() ? "pointer" : "not-allowed",
          }}
        >
          Save
        </button>
        <button
          onClick={() => window.print()}
          style={{
            background: "#3b8c35",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            cursor: "pointer",
          }}
        >
          Download/Print
        </button>
        <button
          onClick={() => navigate("/doctor/inpatients")}
          style={{
            background: "#ef6e54",
            color: "#fff",
            fontWeight: 700,
            fontSize: 17,
            border: "none",
            borderRadius: 8,
            padding: "12px 28px",
            marginLeft: 16,
            cursor: "pointer",
          }}
        >
          Back to Inpatients
        </button>
      </div>
    </div>
  );
}
