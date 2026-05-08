import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function RegisterStaff() {
  const [fields, setFields] = useState({
    name: "", email: "", password: "", role: ""
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/admin/register_staff", fields);
      navigate("/admin");
    } catch (err) {
      setErr(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-6 py-8 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-6 text-primary">Register New Staff</h2>
      {err && <div className="mb-4 text-warn">{err}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" required className="w-full rounded border p-2"
          value={fields.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" required className="w-full rounded border p-2"
          value={fields.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required className="w-full rounded border p-2"
          value={fields.password} onChange={handleChange} />
        <select name="role" required className="w-full rounded border p-2"
          value={fields.role} onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="doctor">Doctor</option>
          <option value="receptionist">Receptionist</option>
          <option value="staff">Staff (Other)</option>
        </select>
        <button type="submit" className="w-full py-2 rounded bg-accent text-white hover:bg-green-600">Register</button>
      </form>
    </div>
  );
}
