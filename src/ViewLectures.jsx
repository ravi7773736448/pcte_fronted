import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewLectures = () => {
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/lectures');
        setLectures(res.data);
      } catch (err) {
        console.error('Error fetching lectures:', err);
      }
    };

    fetchLectures();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-red-700 select-none">
        View Guest Lectures
      </h2>

      {lectures.length === 0 ? (
        <p className="text-gray-600">No lectures available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {lectures.map((lecture, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col"
            >
              <h3 className="text-2xl font-semibold text-red-700 mb-4">{lecture.topic}</h3>

              <div className="space-y-2 flex-grow text-gray-800">
                <p>
                  <span className="font-semibold">Teacher:</span> {lecture.teacher}
                </p>
                <p>
                  <span className="font-semibold">Venue:</span> {lecture.venue}
                </p>
                <p>
                  <span className="font-semibold">Class:</span> {lecture.class}
                </p>
                <p>
                  <span className="font-semibold">Time:</span> {lecture.time}
                </p>
                <p>
                  <span className="font-semibold">Strength:</span> {lecture.strength}
                </p>
                <p>
                  <span className="font-semibold">Speaker:</span> {lecture.resourcePerson} ({lecture.designation})
                </p>
                <p>
                  <span className="font-semibold">Company:</span> {lecture.company}
                </p>
                <p>
                  <span className="font-semibold">Location:</span> {lecture.location}
                </p>
              </div>

              {/* Images */}
              {lecture.images && (
                <div className="mt-6">
                  <p className="font-semibold mb-2">Image:</p>
                  <img
                    src={`http://localhost:5000/uploads/${lecture.images}`}
                    alt="Lecture"
                    className="w-full h-48 object-cover rounded-md border border-gray-300 shadow-sm"
                  />
                </div>
              )}

              {lecture.banner && (
                <div className="mt-6">
                  <p className="font-semibold mb-2">Banner:</p>
                  <img
                    src={`http://localhost:5000/uploads/${lecture.banner}`}
                    alt="Banner"
                    className="w-full h-48 object-cover rounded-md border border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewLectures;
