import React from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  { key: "admin", label: "Admin", color: "bg-primary" },
  { key: "doctor", label: "Doctor", color: "bg-accent" },
  { key: "receptionist", label: "Receptionist", color: "bg-warn" },
  { key: "staff", label: "Other Staff", color: "bg-info" },
];

export default function Home() {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    // Pass role as query param for login page
    navigate(`/login?role=${role}`);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-8 text-primary">Welcome to EHR Privacy Dashboard</h1>

      {/* Login buttons */}
     {/*} <div className="grid grid-cols-2 gap-8 mb-12">
        {roles.map(r => (
          <button
            key={r.key}
            className={`${r.color} text-white font-semibold px-10 py-8 rounded-lg shadow-lg text-2xl hover:scale-105 duration-200`}
            onClick={() => handleRoleClick(r.key)}
          >
            Login as {r.label}
          </button>
        ))}
      </div>*/}

      {/* --- NEW BUTTONS FOR DISCHARGE SUMMARY FEATURES --- */}
      <div className="grid grid-cols-1 gap-6 w-full max-w-lg mb-12">
        <button
  className="bg-purple-700 text-white py-6 rounded-lg text-xl font-semibold shadow hover:bg-purple-900 transition"
  onClick={() => navigate("/add-discharge-manual")}
>
  Add Discharge Summary Manually
</button>

        <button
          className="bg-pink-600 text-white py-6 rounded-lg text-xl font-semibold shadow hover:bg-pink-800 transition"
          onClick={() => navigate("/add-discharge-upload")}
        >
          Upload Scanned/Photo Discharge Summary
        </button>
      </div>

      <div className="mt-4 text-info text-lg font-medium">
        Secure, privacy-preserving electronic health records
      </div>
    </section>
  );
}
