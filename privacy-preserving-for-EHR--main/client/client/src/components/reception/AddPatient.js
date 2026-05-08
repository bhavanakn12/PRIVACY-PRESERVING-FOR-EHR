import React, { useState } from "react";
import api from "../../utils/api";

const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

export default function AddPatient() {
  const [fields, setFields] = useState({
    name: "", dob: "", gender: "", phone: "", address: "", bloodGroup: ""
  });
  const [msg, setMsg] = useState("");
  const [age, setAge] = useState(""); // Just for display, not sending to backend

  // Calculate age from DOB
  const handleDOBChange = (e) => {
    const dob = e.target.value;
    setFields(f => ({ ...f, dob }));
    let calculated = "";
    if (dob) {
      const dobDate = new Date(dob);
      const today = new Date();
      let years = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        years--;
      }
      calculated = years > 0 ? String(years) : "";
    }
    setAge(calculated);
  };

  const handleChange = e => setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/patients/register", fields); // Do not send age!
      setMsg("Patient registered successfully!");
      setFields({ name: "", dob: "", gender: "", phone: "", address: "", bloodGroup: "" });
      setAge("");
    } catch (err) {
      setMsg("Error: Could not register patient.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 px-6 py-8 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-6 text-primary">Register New Patient</h2>
      {msg && <div className="mb-4 text-accent">{msg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Patient Name" required className="w-full rounded border p-2"
          value={fields.name} onChange={handleChange} />

        <label className="block text-sm font-semibold">Date of Birth</label>
        <input
          name="dob"
          type="date"
          required
          className="w-full rounded border p-2"
          value={fields.dob}
          onChange={handleDOBChange}
          max={new Date().toISOString().split("T")[0]}
        />

        {/* Age is only for display. Do not POST it to backend! */}
        <input
          name="age"
          placeholder="Age"
          className="w-full rounded border p-2 bg-gray-100 text-gray-500"
          value={age}
          readOnly
          tabIndex={-1}
        />

        <select
          name="gender" required className="w-full rounded border p-2"
          value={fields.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <select
          name="bloodGroup" required className="w-full rounded border p-2"
          value={fields.bloodGroup} onChange={handleChange}>
          <option value="">Select Blood Group</option>
          {BLOOD_GROUPS.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <input name="phone" type="text" placeholder="Phone Number" required className="w-full rounded border p-2"
          value={fields.phone} onChange={handleChange} />

        <input name="address" placeholder="Address" required className="w-full rounded border p-2"
          value={fields.address} onChange={handleChange} />

        <button type="submit" className="w-full py-2 rounded bg-primary text-white hover:bg-blue-700">
          Register Patient
        </button>
      </form>
    </div>
  );
}
