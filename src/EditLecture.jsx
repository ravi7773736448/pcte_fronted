import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditLecture() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    topic: "",
    resourcePerson: "",
    company: "",
    designation: "",
  });

  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch lecture data by ID
  useEffect(() => {
    fetch(`http://localhost:5000/api/lectures/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          topic: data.topic || "",
          resourcePerson: data.resourcePerson || "",
          company: data.company || "",
          designation: data.designation || "",
        });
        setBannerPreview(
          data.banner ? `http://localhost:5000/uploads/${data.banner}` : ""
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching lecture:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBannerFile(file);
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    for (let key in formData) {
      updatedData.append(key, formData[key]);
    }
    if (bannerFile) {
      updatedData.append("banner", bannerFile);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/lectures/${id}`, {
        method: "PUT",
        body: updatedData,
      });

      if (!res.ok) {
        throw new Error("Failed to update lecture");
      }

      alert("Lecture updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed");
    }
  };

  if (loading) {
    return <p className="p-6 text-red-700 font-bold">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-white p-10">
      <h2 className="text-3xl font-bold text-[#C10007] mb-8">
        Edit Guest Lecture
      </h2>

      <form
        onSubmit={handleSubmit}
        className="border-2 border-red-700 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded"
      >
        {/* Lecture Info */}
        <div>
          <label className="block mb-1 font-semibold">Topic:</label>
          <input
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full border p-2 mb-4"
          />

          <label className="block mb-1 font-semibold">Resource Person:</label>
          <input
            name="resourcePerson"
            value={formData.resourcePerson}
            onChange={handleChange}
            className="w-full border p-2 mb-4"
          />

          <label className="block mb-1 font-semibold">Company:</label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border p-2 mb-4"
          />

          <label className="block mb-1 font-semibold">Designation:</label>
          <input
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full border p-2 mb-4"
          />
        </div>

        {/* Banner */}
        <div>
          <label className="block mb-1 font-semibold">Banner Preview:</label>
          {bannerPreview ? (
            <img
              src={bannerPreview}
              alt="Banner"
              className="w-full h-40 object-cover mb-4"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 mb-4 flex items-center justify-center text-gray-500">
              No banner
            </div>
          )}

          <label className="block mb-1 font-semibold">Upload New Banner:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="w-full border p-2"
          />
        </div>

        <div className="col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-[#C10007] text-white px-6 py-2 rounded hover:bg-[#990005]"
          >
            Update Lecture
          </button>
        </div>
      </form>
    </div>
  );
}
