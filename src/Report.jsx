import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Report() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/lectures")
      .then((res) => res.json())
      .then((data) => {
        setLectures(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch lectures:", err);
        setLoading(false);
      });
  }, []);

  const downloadExcel = () => {
    if (lectures.length === 0) {
      alert("No lecture data to export");
      return;
    }

    // Map data to required Excel columns
    const formattedData = lectures.map((lec) => ({
      Teacher: lec.teacher || "",
      Venue: lec.venue || "",
      Class: lec.class || "",
      Time: lec.time || "",
      Strength: lec.strength || "",
      "Resource Person": lec.resourcePerson || "",
      Company: lec.company || "",
      Location: lec.location || "",
      Designation: lec.designation || "",
      Topic: lec.topic || "",
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lectures");

    // Write workbook and trigger download
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "LecturesReport.xlsx"
    );
  };

  if (loading) {
    return <p className="p-6 text-red-700 font-bold">Loading lectures...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-red-700">Lecture Reports</h1>
      <button
        onClick={downloadExcel}
        className="mb-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Download Full Lectures Report (Excel)
      </button>

      {/* Optional preview */}
      <div className="overflow-auto max-h-96 border p-4 bg-white rounded shadow">
        {lectures.length === 0 ? (
          <p>No lectures found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 px-4">Teacher</th>
                <th className="py-2 px-4">Venue</th>
                <th className="py-2 px-4">Class</th>
                <th className="py-2 px-4">Time</th>
                <th className="py-2 px-4">Strength</th>
                <th className="py-2 px-4">Resource Person</th>
                <th className="py-2 px-4">Company</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Designation</th>
                <th className="py-2 px-4">Topic</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lec) => (
                <tr key={lec._id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{lec.teacher}</td>
                  <td className="py-2 px-4">{lec.venue}</td>
                  <td className="py-2 px-4">{lec.class}</td>
                  <td className="py-2 px-4">{lec.time}</td>
                  <td className="py-2 px-4">{lec.strength}</td>
                  <td className="py-2 px-4">{lec.resourcePerson}</td>
                  <td className="py-2 px-4">{lec.company}</td>
                  <td className="py-2 px-4">{lec.location}</td>
                  <td className="py-2 px-4">{lec.designation}</td>
                  <td className="py-2 px-4">{lec.topic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
