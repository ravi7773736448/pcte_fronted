import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import AddLecture from "./AddLecture";
import EditLecture from "./EditLecture";
import ViewLectures from "./ViewLectures";
import Report from "./Report";
import UploadClassAttendance from "./UploadClassAttendance";

export default function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-grow overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-lecture" element={<AddLecture />} />
            <Route path="/edit-lecture" element={<EditLecture />} />
            <Route path="/edit-lecture/:id" element={<EditLecture />} />
            <Route path="/view-lectures" element={<ViewLectures />} />
            <Route path="/upload-attendance" element={<UploadClassAttendance />} />
            <Route path="/report" element={<Report />} />
           


          </Routes>
        </div>
      </div>
    </Router>
  );
}
