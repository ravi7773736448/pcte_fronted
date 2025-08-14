import React, { useState, useEffect, memo } from "react";
import { FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// --- Lecture Card ---
const LectureCard = memo(
  ({
    id,
    title,
    bannerUrl,
    instructor,
    company,
    designation,
    className,
    onDetailsClick,
    onDeleteClick,
    isDeleting,
  }) => {
    const navigate = useNavigate();

    return (
      <article
        className={`w-full max-w-xs bg-white rounded-xl border border-gray-200 shadow-sm transform transition-all duration-300 cursor-pointer flex flex-col overflow-hidden mx-auto ${
          isDeleting ? "opacity-50 pointer-events-none" : "hover:shadow-2xl hover:scale-105"
        }`}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>

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

          <div className="flex justify-between mt-auto items-center">
            <button
              className="flex items-center gap-1 text-red-600 font-semibold text-sm hover:text-red-800"
              onClick={onDetailsClick}
              type="button"
            >
              <FaInfoCircle /> Details
            </button>

            <button
              className="flex items-center gap-1 text-gray-600 font-semibold text-sm hover:text-black"
              onClick={onDeleteClick}
              type="button"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-gray-600 rounded-full" />
              ) : (
                <>
                  <FaTrash /> Delete
                </>
              )}
            </button>

            <button
              className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-800"
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
const LectureSection = ({ title, data, onDelete, deletingId }) => (
  <section className="mb-14">
    <h2 className="text-3xl font-extrabold text-red-700 border-b-4 border-red-700 pb-1 mb-6">
      {title}
    </h2>

    {/* Mobile View */}
    <div className="sm:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
      {data.map((lecture) => (
        <div key={lecture._id} className="min-w-[80%] snap-start">
          <LectureCard
            {...lectureProps(lecture)}
            onDeleteClick={() => onDelete(lecture._id, lecture.topic)}
            isDeleting={deletingId === lecture._id}
          />
        </div>
      ))}
    </div>

    {/* Desktop View */}
    <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {data.map((lecture) => (
        <div key={lecture._id} className="flex justify-center">
          <LectureCard
            {...lectureProps(lecture)}
            onDeleteClick={() => onDelete(lecture._id, lecture.topic)}
            isDeleting={deletingId === lecture._id}
          />
        </div>
      ))}
    </div>
  </section>
);

// Helper to extract props
const lectureProps = (lecture) => ({
  id: lecture._id,
  title: lecture.topic,
  bannerUrl: lecture.banner
    ? `http://localhost:5000/uploads/${lecture.banner}`
    : "",
  instructor: lecture.resourcePerson,
  company: lecture.company,
  designation: lecture.designation,
  className: lecture.class,
  onDetailsClick: () => toast.info(`Lecture: ${lecture.topic}`),
});

// --- Dashboard Component ---
export default function Dashboard() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/lectures");
      const data = await res.json();
      setLectures(data);
    } catch (error) {
      toast.error("Failed to fetch lectures.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = async (id, topic) => {
    const confirmDelete = window.confirm(`Delete lecture "${topic}"?`);
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/lectures/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete lecture");
      }

      setLectures((prev) => prev.filter((l) => l._id !== id));
      toast.success("Lecture deleted successfully.");
    } catch (error) {
      toast.error("Error deleting lecture.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <p className="text-red-700 font-bold text-xl">Loading lectures...</p>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen px-4 sm:px-8 py-6 w-full overflow-y-auto">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-red-700 mb-10 sm:mb-16 text-center">
        Dashboard
      </h1>

      <LectureSection
        title="Guest Lectures"
        data={lectures}
        onDelete={handleDeleteLecture}
        deletingId={deletingId}
      />
    </main>
  );
}
