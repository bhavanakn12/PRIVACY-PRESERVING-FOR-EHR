import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleRoleLogin = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {/* Register button at the top right of the dashboard */}
      <div className="w-full flex justify-end max-w-lg mb-4">
       {/*} <button
          className="px-5 py-2 bg-accent text-white rounded font-semibold hover:bg-green-700 shadow"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-10 text-primary">Main Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
        <button
          className="bg-blue-600 text-white py-6 rounded-lg text-xl font-semibold shadow hover:bg-blue-800 transition"
          onClick={() => handleRoleLogin("admin")}
        >
          Admin Dashboard
        </button>
        <button
          className="bg-green-600 text-white py-6 rounded-lg text-xl font-semibold shadow hover:bg-green-800 transition"
          onClick={() => handleRoleLogin("doctor")}
        >
          Doctor Dashboard
        </button>
        <button
          className="bg-yellow-500 text-white py-6 rounded-lg text-xl font-semibold shadow hover:bg-yellow-700 transition"
          onClick={() => handleRoleLogin("staff")}
        >
          Staff Dashboard
        </button>
        <button
          className="bg-indigo-600 text-white py-6 rounded-lg text-xl font-semibold shadow hover:bg-indigo-800 transition"
          onClick={() => handleRoleLogin("receptionist")}
        >
          Register Patient / Reception
        </button>
        {/* --- NEW BUTTONS BELOW (OPTIONAL for secondary dashboard use) --- */}
       <button
  style={{
    background: "#2856ee", // your desired shade
    color: "#fff",
    padding: "24px 0",
    borderRadius: "12px",
    fontSize: "1.25rem",
    fontWeight: 600,
    boxShadow: "0 4px 16px rgba(40,86,238,0.10)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s"
  }}
  onMouseOver={e => (e.currentTarget.style.background = "#15337c")} // hover shade
  onMouseOut={e => (e.currentTarget.style.background = "#cb26afff")}
  onClick={() => navigate("/add-discharge-manual")}
>
  Add Discharge Summary Manually
</button>


        <button
  style={{
    background: "#e040fb", // custom purple-pink shade
    color: "#fff",
    padding: "24px 0",
    borderRadius: "12px",
    fontSize: "1.25rem",
    fontWeight: 600,
    boxShadow: "0 4px 16px rgba(224,64,251,0.10)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s"
  }}
  onMouseOver={e => (e.currentTarget.style.background = "#ce7fdcff")} // hover shade
  onMouseOut={e => (e.currentTarget.style.background = "#e57c8eff")}
  onClick={() => navigate("/add-discharge-upload")}
>
  Upload Scanned/Photo Discharge Summary
</button>

        {/* ----------------------------------- */}
      </div>
     
    </div>
  );
}
