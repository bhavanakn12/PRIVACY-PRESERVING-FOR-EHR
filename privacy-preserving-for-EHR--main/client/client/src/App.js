import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./components/admin/AdminDashboard";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import StaffDashboard from "./components/staff/StaffDashboard";
import RegisterStaff from "./components/admin/RegisterStaff";
import ManageAdmission from "./components/doctor/ManageAdmission";
import DischargeSummary from "./components/doctor/DischargeSummary";
import UploadDischargeSummary from "./components/doctor/UploadDischargeSummary";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Dashboard from './pages/Dashboard';
import AdmitPatient from './components/doctor/AdmitPatient';
import AdmissionDayUpdate from "./components/doctor/AdmissionDayUpdate";
import NotFound from "./pages/NotFound";
import AddPatient from "./components/reception/AddPatient";
import InpatientsList from "./components/doctor/InpatientsList";
import StaffDischargeSummary from "./components/staff/StaffDischargeSummary";
import AdminSummaryViewer from "./components/admin/AdminSummaryViewer";
// ---- ADD THIS import for the summaries list page ----
import AllSummariesViewer from "./components/admin/AllSummariesViewer";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "url('/images/upload.jpeg') center/cover",
      }}
    >
      <Router>
        <Navbar />
        <main className="max-w-screen-xl m-auto p-2">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/register-staff" element={<RegisterStaff />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/admit" element={<ManageAdmission />} />
            <Route path="/doctor/discharge-summary/:admissionId" element={<DischargeSummary />} />
            <Route path="/staff/discharge-summary/:admissionId" element={<StaffDischargeSummary />} />
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/patients/register" element={<AddPatient />} />
            <Route path="/doctor/admit/:id" element={<AdmitPatient />} />
            <Route path="/doctor/inpatients" element={<InpatientsList />} />
            <Route path="/doctor/admission/:admissionId/day/:dayNum" element={<AdmissionDayUpdate />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/admin/privacy-summary/:admissionId" element={<AdminSummaryViewer />} />
            <Route path="/add-discharge-manual" element={<DischargeSummary />} />
            <Route path="/add-discharge-upload" element={<UploadDischargeSummary />} />
            <Route path="/admin/summary-viewer" element={<AdminSummaryViewer />} />
            {/* ---- ADD THIS ROUTE FOR THE SUMMARIES LIST PAGE ---- */}
            <Route path="/admin/all-summaries" element={<AllSummariesViewer />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}


export default App;
