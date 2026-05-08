import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function StaffDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch patient admissions data
    api.get("/staff/admissions").then(res => setAdmissions(res.data));
  }, []);

  return (
    <div className="p-4"> {/* Added padding to the container */}
      <h1 className="text-2xl font-bold text-indigo-800 mb-6"> {/* Used specific color and bolding for emphasis */}
        Staff Dashboard: All Patient Admissions
      </h1>
      
      <table className="min-w-full bg-white border rounded shadow-md"> {/* Added min-w-full and shadow */}
        <thead>
          <tr className="bg-indigo-700 text-white text-left"> {/* Used specific indigo color for header */}
            <th className="py-3 px-4 w-12 text-center">#</th> {/* Increased padding, set width, and centered */}
            <th className="py-3 px-4">Name</th> {/* Increased padding, left-aligned */}
            <th className="py-3 px-4">Phone</th> {/* Increased padding, left-aligned */}
            <th className="py-3 px-4 text-center">Action</th> {/* Increased padding, centered */}
          </tr>
        </thead>
        <tbody>
          {admissions.map((rec, i) => (
            <tr 
              key={rec.admissionId} 
              className="border-b hover:bg-gray-50" // Added border-b and hover effect
            >
              <td className="py-3 px-4 text-center">{i + 1}</td> {/* Increased padding and centered */}
              <td className="py-3 px-4">{rec.name}</td> {/* Increased padding */}
              <td className="py-3 px-4">{rec.phone}</td> {/* Increased padding */}
              
              <td className="py-3 px-4 text-center"> {/* Increased padding and centered for the button */}
                {rec.dischargeDate ? (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition duration-150 ease-in-out" // Enhanced button styling
                    onClick={() =>
                      navigate(`/staff/discharge-summary/${rec.admissionId}`)
                    }
                    title="View Discharge Summary"
                  >
                    View Summary
                  </button>
                ) : (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition duration-150 ease-in-out" // Enhanced button styling
                    onClick={() =>
                      navigate(`/staff/inpatient-details/${rec.admissionId}`)
                    }
                    title="View Details"
                  >
                    View Details
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}