import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function AdmitPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [availableRoom, setAvailableRoom] = useState(null);
  const [admitting, setAdmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch patient details
    api.get(`/patients/${id}`)
      .then(res => setPatient(res.data))
      .catch(() => setError("Could not load patient."));

    // Fetch available room (auto-assigned by backend, just for info)
    api.get(`/doctor/available-room`)
      .then(res => setAvailableRoom(res.data.room))
      .catch(() => setAvailableRoom(null));
  }, [id]);

  const handleAdmit = async () => {
    setAdmitting(true);
    setError("");
    try {
      // Admit and get admissionId from backend
      const res = await api.post("/doctor/admit", { patientId: id });
      const admissionId = res.data.admissionId;
      alert(`Patient admitted to room ${res.data.roomNumber}`);
      // Redirect to Day 1 update page
      navigate(`/doctor/admission/${admissionId}/day/1`);
    } catch (err) {
      setError(err?.response?.data?.message || "Admit failed");
      setAdmitting(false);
    }
  };

  if (error) return <div style={{ color: "red", margin: 32 }}>{error}</div>;
  if (!patient) return <div style={{ margin: 32 }}>Loading patient details...</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Admit Patient</h2>
      <div className="mb-6">
        <b>Name:</b> {patient.name}<br/>
        <b>Gender:</b> {patient.gender}<br/>
        <b>Phone:</b> {patient.phone}<br/>
        <b>Status:</b> {patient.status}<br/>
        <b>Address:</b> {patient.address}<br/>
      </div>
      <div className="mb-6">
        <b>Assigned Room:</b>{" "}
        {availableRoom ? (
          <span className="font-bold text-primary">{availableRoom}</span>
        ) : (
          <span className="text-gray-500">No room available</span>
        )}
      </div>
      <button
        onClick={handleAdmit}
        disabled={admitting || !availableRoom}
        className="px-6 py-2 rounded bg-blue-700 text-white font-semibold disabled:bg-gray-400"
      >
        {admitting ? "Admitting..." : "Confirm Admission"}
      </button>
      <button onClick={() => navigate("/doctor")} className="ml-6 underline text-blue-800">
        Cancel
      </button>
    </div>
  );
}
