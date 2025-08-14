import React, { useState, useEffect, memo } from "react";
import { FaInfoCircle, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// --- Lecture Card ---
const LectureCard = memo(
  ({
    id,
    title,
    bannerUrl,
    instructor,
    company,
    designation,
    className, // 👈 Added
    onDetailsClick,
  }) => {
    const navigate = useNavigate();

    return (
      <article
        tabIndex={0}
        className="w-full max-w-xs bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
      >
        <div className="relative overflow-hidden rounded-t-xl">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt={title}
              className="w-full h-40 object-cover transition-transform duration-500 ease-in-out hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
              No Banner
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-1">
            <strong>Guest:</strong> {instructor}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            <strong>Company:</strong> {company}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            <strong>Designation:</strong> {designation}
          </p>

          <p className="text-sm text-gray-600 mb-4">
            <strong>Class:</strong> {className || "N/A"}
          </p>

          <div className="flex justify-between mt-auto">
            <button
              className="flex items-center gap-1 text-red-600 font-semibold text-xs hover:text-red-800"
              onClick={onDetailsClick}
              type="button"
            >
              <FaInfoCircle /> Details
            </button>

            <button
              className="flex items-center gap-1 text-blue-600 font-semibold text-xs hover:text-blue-800"
              onClick={() => navigate(`/edit-lecture/${id}`)}
              type="button"
            >
              <FaEdit /> Edit
            </button>
          </div>
        </div>
      </article>
    );
  }
);

// --- Lecture Section ---
const LectureSection = ({ title, data }) => (
  <section className="mb-14">
    <h2 className="text-3xl font-extrabold text-red-700 border-b-4 border-red-700 pb-1 mb-6">
      {title}
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {data.map((lecture, index) => (
        <LectureCard
          key={lecture._id || index}
          id={lecture._id}
          title={lecture.topic}
          bannerUrl={
            lecture.banner
              ? `http://localhost:5000/uploads/${lecture.banner}`
              : ""
          }
          instructor={lecture.resourcePerson}
          company={lecture.company}
          designation={lecture.designation}
          className={lecture.class} // 👈 this is your class string
          onDetailsClick={() => alert(`Lecture: ${lecture.topic}`)}
        />
      ))}
    </div>
  </section>
);

// --- Dashboard Component ---
export default function Dashboard() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/lectures")
      .then((res) => res.json())
      .then((data) => {
        setLectures(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch lectures:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen p-8 w-full flex items-center justify-center">
        <p className="text-red-700 font-bold text-xl">Loading lectures...</p>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen p-8 w-full overflow-y-auto">
      <h1 className="text-5xl font-extrabold text-red-700 mb-16 text-center">Dashboard</h1>
      <LectureSection title="Guest Lectures" data={lectures} />
    </main>
  );
}
