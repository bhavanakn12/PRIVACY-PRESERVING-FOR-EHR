//client/src/components/admin/AdminDashboard.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function AdminDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch patient data from the API
    api.get("/admin/patients")
      .then(res => setAdmissions(res.data))
      .catch(() => setAdmissions([]));
  }, []);

  return (
    <div className="p-4"> {/* Added padding to the container */}
      <h1 className="text-2xl font-bold text-indigo-800 mb-6">Admin Dashboard</h1>
      
      <table className="min-w-full bg-white border rounded shadow-md"> {/* Added shadow for better appearance */}
        <thead>
          <tr className="bg-indigo-700 text-white text-left"> {/* Changed 'bg-primary' to a specific Tailwind color like 'bg-indigo-700' for clarity, set text-left */}
            <th className="py-3 px-4 w-12 text-center">#</th> {/* Increased padding, set width, and centered for the index */}
            <th className="py-3 px-4">Name</th> {/* Increased padding */}
            <th className="py-3 px-4">Status</th> {/* Increased padding */}
            <th className="py-3 px-4 text-center">Privacy Preserved Summary</th> {/* Increased padding, centered */}
          </tr>
        </thead>
        <tbody>
          {admissions.filter(x => x.admissionId).map((row, idx) => (
            <tr 
              key={row.admissionId} 
              className="border-b hover:bg-gray-50" // Added border-b and hover effect
            >
              <td className="py-3 px-4 text-center">{idx + 1}</td> {/* Added padding and centered */}
              <td className="py-3 px-4">{row.name || "--"}</td> {/* Added padding */}
              <td className="py-3 px-4">{row.status || "--"}</td> {/* Added padding */}
              <td className="py-3 px-4 text-center"> {/* Added padding and centered */}
                <button
                  disabled={!row.admissionId}
                  onClick={() => {
                    if (row.admissionId)
                      navigate(`/admin/privacy-summary/${row.admissionId}`);
                  }}
                  // Enhanced button styling for better visibility and consistency
                  className="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold px-4 py-2 rounded transition duration-150 ease-in-out disabled:opacity-50"
                >
                  Privacy Summary
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}