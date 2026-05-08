//client/src/components/common/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLogged, setIsLogged] = React.useState(!!localStorage.getItem("ehr_jwt"));
  const navigate = useNavigate();

  const handleGoDashboard = () => {
    navigate("/dashboard");
  };

  React.useEffect(() => {
    setIsLogged(!!localStorage.getItem("ehr_jwt"));
  }, []);

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-primary shadow mb-4 rounded-b-lg">
      <Link to="/" className="text-white text-xl font-bold tracking-wide">EHR Dashboard</Link>
      <div className="flex items-center space-x-4">
        {!isLogged && (
          <>
            <Link to="/login" className="text-white hover:underline">Login</Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-accent text-white rounded hover:bg-green-600 font-semibold shadow"
            >
              Register
            </Link>
          </>
        )}
        {isLogged && (
          <button
            onClick={handleGoDashboard}
            className="bg-white text-primary px-4 py-1 rounded font-bold uppercase hover:bg-accent hover:text-white transition"
          >
            Back to Dashboard
          </button>
        )}
      </div>
    </nav>
  );
}
