import React, { useState, useEffect } from "react";

export default function UploadClassAttendance() {
  const [lectures, setLectures] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState("");
  const [attendance, setAttendance] = useState({}); // classId -> boolean
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Fetch lectures once on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/lectures")
      .then((res) => res.json())
      .then(setLectures)
      .catch(console.error);
  }, []);

  // Fetch classes when selectedLecture changes
  useEffect(() => {
    if (!selectedLecture) {
      setClasses([]);
      setAttendance({});
      return;
    }

    setLoadingClasses(true);
    // Fetch classes excluding those already marked attended for this lecture
    fetch(`http://localhost:5000/api/classes?excludeAttendedForLecture=${selectedLecture}`)
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setAttendance({});
        setLoadingClasses(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingClasses(false);
      });
  }, [selectedLecture]);

  const toggleClassAttendance = (classId) => {
    setAttendance((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  const submitAttendance = () => {
    if (!selectedLecture) {
      alert("Please select a lecture.");
      return;
    }

    const attendedClasses = Object.entries(attendance)
      .filter(([_, isPresent]) => isPresent)
      .map(([classId]) => classId);

    if (attendedClasses.length === 0) {
      alert("Please select at least one class.");
      return;
    }

    fetch("http://localhost:5000/api/class-attendance/mark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lectureId: selectedLecture,
        attendedClasses,
        date: new Date(),
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Attendance marked successfully!");

          // Remove attended classes from local state
          setClasses((prevClasses) =>
            prevClasses.filter((cls) => !attendedClasses.includes(cls._id))
          );

          setAttendance({});
        } else {
          alert("Failed to submit.");
        }
      })
      .catch(() => alert("Something went wrong."));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Upload Class Attendance</h1>

      {/* Lecture Dropdown */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">Select Lecture</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedLecture}
          onChange={(e) => setSelectedLecture(e.target.value)}
        >
          <option value="">-- Select Lecture --</option>
          {lectures.map((lec) => (
            <option key={lec._id} value={lec._id}>
              {lec.topic} - {lec.class}
            </option>
          ))}
        </select>
      </div>

      {/* Classes List */}
      <div>
        <label className="font-semibold block mb-2">Mark Classes Attended</label>
        {loadingClasses ? (
          <p>Loading classes...</p>
        ) : classes.length === 0 ? (
          <p>No classes to mark attendance for.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-2">
            {classes.map((cls) => (
              <li key={cls._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`cls-${cls._id}`}
                  checked={attendance[cls._id] || false}
                  onChange={() => toggleClassAttendance(cls._id)}
                />
                <label htmlFor={`cls-${cls._id}`}>{cls.name}</label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={submitAttendance}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        disabled={loadingClasses || classes.length === 0}
      >
        Submit Attendance
      </button>
    </div>
  );
}
