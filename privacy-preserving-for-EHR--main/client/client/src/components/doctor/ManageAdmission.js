import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function ManageAdmission() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/patients/all").then(res => {
      setPatients(res.data.filter(p => p.status === "outpatient"));
    });
  }, []);

  const handleAdmit = async e => {
    e.preventDefault();
    if (!selected) return;
    try {
      await api.post("/doctor/admit", { patientId: selected });
      setMsg("Patient admitted successfully!");
      setTimeout(() => navigate("/doctor"), 1300);
    } catch (err) {
      setMsg("Error admitting patient");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 px-6 py-8 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-6 text-primary">Admit Patient</h2>
      {msg && <div className="mb-3 text-accent">{msg}</div>}
      <form onSubmit={handleAdmit} className="space-y-4">
        <select
          required className="w-full rounded border p-2"
          value={selected}
          onChange={e => setSelected(e.target.value)}>
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>{p.name} ({p.gender})</option>
          ))}
        </select>
        <button className="w-full py-2 rounded bg-accent text-white hover:bg-green-600">Admit</button>
      </form>
    </div>
  );
}
