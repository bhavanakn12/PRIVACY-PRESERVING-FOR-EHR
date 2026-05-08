//client/src/components/auth/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";

export default function Login() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chosenRole = params.get("role");
    if (chosenRole) setRole(chosenRole);
  }, [location]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErr("");
  try {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("ehr_jwt", data.token);
    localStorage.setItem("ehr_role", data.user.role);

    // Redirect based on role:
    if (data.user.role === "admin") navigate("/admin");
    else if (data.user.role === "doctor") navigate("/doctor");
    else if (data.user.role === "staff") navigate("/staff");
    else if (data.user.role === "receptionist") navigate("/patients/register");
    else navigate("/dashboard");
  } catch (err) {
    setErr(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="max-w-md mx-auto mt-16 px-6 py-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-primary">Login {role ? `as ${role}` : ""}</h2>
      {err && <div className="mb-4 text-warn">{err}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" autoFocus required
          className="w-full rounded border p-2"
          value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required
          className="w-full rounded border p-2"
          value={password} onChange={e => setPassword(e.target.value)} />
        {/* If a role is provided, show it; else, let user pick */}
        {role ? (
          <input type="text" value={role} disabled className="w-full rounded border p-2 bg-gray-100 text-gray-600" />
        ) : (
          <select required className="w-full rounded border p-2" value={role} onChange={e => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="staff">Other Staff</option>
          </select>
        )}
        <button type="submit" className="w-full py-2 rounded bg-primary text-white hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
}
