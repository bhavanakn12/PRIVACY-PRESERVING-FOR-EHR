import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function AdmissionDayUpdate() {
  const { admissionId, dayNum } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState(null);
  const [admission, setAdmission] = useState(null);
  const [history, setHistory] = useState([]);
  const [outpatientHistory, setOutpatientHistory] = useState([]);
  const [morning, setMorning] = useState({ status: "", symptoms: "", medications: "", medicineChanged: false, remarks: "" });
  const [evening, setEvening] = useState({ status: "", symptoms: "", medications: "", medicineChanged: false, remarks: "" });
  const [saving, setSaving] = useState(false);
  const [sessionDone, setSessionDone] = useState({ morning: false, evening: false });
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(`/doctor/admission/${admissionId}/day/${dayNum}`)
      .then(res => {
        setAdmission(res.data.admission);
        setDay(res.data.day);
        setOutpatientHistory(res.data.outpatientHistory || []);
        setHistory(
          (res.data.admission.days || [])
            .filter(d => d.day < parseInt(dayNum))
            .sort((a, b) => a.day - b.day)
        );
        res.data.day.sessions.forEach(session => {
          if (session.period === "morning") {
            setMorning({ ...session });
            setSessionDone(sd => ({ ...sd, morning: true }));
          }
          if (session.period === "evening") {
            setEvening({ ...session });
            setSessionDone(sd => ({ ...sd, evening: true }));
          }
        });
        setLoading(false);
      })
      .catch(() => { setError("Could not load data."); setLoading(false); });
  }, [admissionId, dayNum]);

  const saveSession = async (period, data) => {
    setSaving(true);
    setError("");
    try {
      await api.post(`/doctor/admission/${admissionId}/day/${dayNum}`, { period, ...data });
      setSessionDone(sd => ({ ...sd, [period]: true }));
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save.");
    }
    setSaving(false);
  };

  const goNextDay = () => navigate(`/doctor/admission/${admissionId}/day/${parseInt(dayNum) + 1}`);

 const discharge = async () => {
  if (!window.confirm("Are you sure you want to discharge this patient?")) return;
  try {
    await api.post(`/doctor/discharge/${admissionId}`, {}); // Add body if you want to pass appointment/remarks
    navigate(`/doctor/discharge-summary/${admissionId}`);
  } catch {
    alert("Discharge failed.");
  }
};


  if (loading) return <div style={{ margin: 32 }}>Loading...</div>;
  if (error) return <div style={{ color: "red", margin: 32 }}>{error}</div>;
  if (!admission) return null;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", maxWidth: 1200, margin: "40px auto" }}>
      {/* -- MAIN UPDATE FORM (LEFT) -- */}
      <div style={{
        maxWidth: 540,
        width: "100%",
        background: "#fff",
        boxShadow: "0 2px 14px #badeff78",
        borderRadius: 16,
        padding: "32px 24px 24px 32px",
        minHeight: 400,
      }}>
        <h2 className="text-xl font-semibold mb-4">Day {dayNum}: Morning & Evening Sessions</h2>
        <div className="mb-2">
          <b>Patient:</b> {admission.patient.name || admission.patient}
        </div>
        <form className="mb-6">
          <h3 className="font-bold mt-4">Morning Session</h3>
          <input
            className="w-full border rounded p-2 mt-2"
            placeholder="Status/Condition"
            value={morning.status}
            onChange={e => setMorning({ ...morning, status: e.target.value })}
            disabled={sessionDone.morning}
          />
          <input
            className="w-full border rounded p-2 mt-2"
            placeholder="Symptoms"
            value={morning.symptoms}
            onChange={e => setMorning({ ...morning, symptoms: e.target.value })}
            disabled={sessionDone.morning}
          />
          <input
            className="w-full border rounded p-2 mt-2"
            placeholder="Medications"
            value={morning.medications}
            onChange={e => setMorning({ ...morning, medications: e.target.value })}
            disabled={sessionDone.morning}
          />
          <label>
            <input
              type="checkbox"
              checked={!!morning.medicineChanged}
              onChange={e => setMorning({ ...morning, medicineChanged: e.target.checked })}
              disabled={sessionDone.morning}
            /> Medicine Changed
          </label>
          <input
            className="w-full border rounded p-2 mt-2"
            placeholder="Remarks"
            value={morning.remarks}
            onChange={e => setMorning({ ...morning, remarks: e.target.value })}
            disabled={sessionDone.morning}
          />
          <button
            type="button"
            className="bg-blue-700 text-white px-4 py-2 rounded mt-2"
            disabled={sessionDone.morning || saving}
            onClick={() => saveSession("morning", morning)}
          >Save Morning</button>
        </form>
        <form className="mb-6">
          <h3 className="font-bold">Evening Session</h3>
          <input
            className="w-full border rounded p-2 mt-2"
            placeholder="Status/Condition"
            value={evening.status}
            onChange={e => setEvening({ ...evening, status: e.target.value })}
            disabled={sessionDone.evening}
          />
          <input
            className="w-full border rounded p-2 mt-2"
            placeholder="Symptoms"
            value={evening.symptoms}
            onChange={e => setEvening({ ...evening, symptoms: e.target.value })}
            disabled={sessionDone.evening}
          />
          <input
            className="w-full border rounded p-2 mt-2"
            placeholder="Medications"
            value={evening.medications}
            onChange={e => setEvening({ ...evening, medications: e.target.value })}
            disabled={sessionDone.evening}
          />
          <label>
            <input
              type="checkbox"
              checked={!!evening.medicineChanged}
              onChange={e => setEvening({ ...evening, medicineChanged: e.target.checked })}
              disabled={sessionDone.evening}
            /> Medicine Changed
          </label>
          <input
            className="w-full border rounded p-2 mt-2"
            placeholder="Remarks"
            value={evening.remarks}
            onChange={e => setEvening({ ...evening, remarks: e.target.value })}
            disabled={sessionDone.evening}
          />
          <button
            type="button"
            className="bg-blue-700 text-white px-4 py-2 rounded mt-2"
            disabled={sessionDone.evening || saving}
            onClick={() => saveSession("evening", evening)}
          >Save Evening</button>
        </form>
        <div className="flex gap-4 mt-4">
          <button
  className="bg-green-600 text-white px-4 py-2 rounded"
  onClick={goNextDay}
>
  Next Day
</button>

          <button
  className="bg-red-700 text-white px-4 py-2 rounded"
  onClick={discharge}
>
  Discharge
</button>

        </div>
      </div>
      {/* -- HISTORY SIDEBAR (RIGHT) -- */}
      <div style={{
        minWidth: 300,
        maxWidth: 340,
        padding: "22px 16px 16px 24px",
        marginLeft: 36,
        background: "#f5f7fc",
        borderRadius: 13,
        boxShadow: "0 2px 10px #bcb1c366",
        minHeight: 400
      }}>
        {/* OPD/Outpatient History */}
        <div style={{ marginBottom: 18 }}>
          <h4 style={{ fontWeight: 700, fontSize: 16, color: "#3071ce", marginBottom: 7 }}>
            Pre-admission (OPD) History
          </h4>
          {outpatientHistory.length === 0 ? (
            <span style={{ color: "#aaa" }}>(No outpatient records)</span>
          ) : outpatientHistory.map((entry, idx) => (
            <div key={idx} style={{ marginBottom: 8, borderBottom: "1px solid #e2e6ed", paddingBottom: 7 }}>
              <div><b>Date:</b> {entry.date ? entry.date.split("T")[0] : "-"}</div>
              <div><b>Symptoms:</b> {entry.symptoms || "-"}</div>
              <div><b>Medicine:</b> {entry.medicine || "-"}</div>
              {entry.remarks && <div><b>Remarks:</b> {entry.remarks}</div>}
            </div>
          ))}
        </div>
        {/* Inpatient Daily History (ALWAYS BOTH PERIODS) */}
        <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, color: "#2744bd" }}>
          Previous Day History
        </h3>
        {history.length === 0 && (
          <div style={{ color: "#a1a1a1", fontStyle: "italic", marginTop: 18 }}>
            (No previous days)
          </div>
        )}
        {history.map(d => {
          const morning = d.sessions.find(s => s.period === "morning");
          const evening = d.sessions.find(s => s.period === "evening");
          return (
            <div key={d.day} style={{
              borderBottom: "1px solid #dbe3f6",
              marginBottom: 15,
              paddingBottom: 5
            }}>
              <b>Day {d.day}</b>
              <div style={{ marginLeft: 6, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: "#1594d5" }}>Morning:</span>{" "}
                {morning
                  ? <>
                      {morning.status && <>Status: {morning.status}; </>}
                      {morning.symptoms && <>Symptoms: {morning.symptoms}; </>}
                      {morning.medications && <>Medicines: {morning.medications}; </>}
                      {morning.medicineChanged && <>Medicine Changed; </>}
                      {morning.remarks && <>Remarks: {morning.remarks}</>}
                    </>
                  : <span style={{ color: "#aaa" }}>(No entry)</span>
                }
              </div>
              <div style={{ marginLeft: 6 }}>
                <span style={{ fontWeight: 600, color: "#f59c23" }}>Evening:</span>{" "}
                {evening
                  ? <>
                      {evening.status && <>Status: {evening.status}; </>}
                      {evening.symptoms && <>Symptoms: {evening.symptoms}; </>}
                      {evening.medications && <>Medicines: {evening.medications}; </>}
                      {evening.medicineChanged && <>Medicine Changed; </>}
                      {evening.remarks && <>Remarks: {evening.remarks}</>}
                    </>
                  : <span style={{ color: "#aaa" }}>(No entry)</span>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
