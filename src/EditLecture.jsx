import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditLecture() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    teacher: "",
    venue: "",
    class: "",
    time: "",
    strength: "",
    resourcePerson: "",
    company: "",
    location: "",
    designation: "",
    topic: "",
  });

  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);

  const [imagesPreview, setImagesPreview] = useState("");
  const [imagesFile, setImagesFile] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/lectures/${id}`);
        if (!res.ok) throw new Error("Failed to fetch lecture");
        const data = await res.json();

        setFormData({
          teacher: data.teacher || "",
          venue: data.venue || "",
          class: data.class || "",
          time: data.time || "",
          strength: data.strength || "",
          resourcePerson: data.resourcePerson || "",
          company: data.company || "",
          location: data.location || "",
          designation: data.designation || "",
          topic: data.topic || "",
        });

        setBannerPreview(
          data.banner ? `http://localhost:5000/uploads/${data.banner}` : ""
        );

        setImagesPreview(
          data.images ? `http://localhost:5000/uploads/${data.images}` : ""
        );
      } catch (err) {
        console.error("Error fetching lecture:", err);
        toast.error("Failed to load lecture data");
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
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

  const handleImagesChange = (e) => {
    const file = e.target.files[0];
    setImagesFile(file);
    if (file) {
      setImagesPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    for (const key in formData) {
      updatedData.append(key, formData[key]);
    }

    if (bannerFile) updatedData.append("banner", bannerFile);
    if (imagesFile) updatedData.append("images", imagesFile);

    try {
      const res = await fetch(`http://localhost:5000/api/lectures/${id}`, {
        method: "PUT",
        body: updatedData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update lecture");
      }

      toast.success("Lecture updated successfully!");
      setTimeout(() => navigate("/"), 2000); // Delay to let user see toast
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed: " + error.message);
    }
  };

  if (loading) {
    return <p className="p-6 text-red-700 font-bold">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-white p-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold text-[#C10007] mb-8">Edit Guest Lecture</h2>
      <form
        onSubmit={handleSubmit}
        className="border-2 border-red-700 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded"
      >
        <div>
          <label className="block mb-1 font-semibold">Teacher:</label>
          <input name="teacher" value={formData.teacher} onChange={handleChange} className="w-full border p-2 mb-4" required />
          <label className="block mb-1 font-semibold">Venue:</label>
          <input name="venue" value={formData.venue} onChange={handleChange} className="w-full border p-2 mb-4" />
          <label className="block mb-1 font-semibold">Class:</label>
          <input name="class" value={formData.class} onChange={handleChange} className="w-full border p-2 mb-4" />
          <label className="block mb-1 font-semibold">Time:</label>
          <input name="time" value={formData.time} onChange={handleChange} className="w-full border p-2 mb-4" />
          <label className="block mb-1 font-semibold">Strength:</label>
          <input name="strength" type="number" value={formData.strength} onChange={handleChange} className="w-full border p-2 mb-4" />
          <label className="block mb-1 font-semibold">Resource Person:</label>
          <input name="resourcePerson" value={formData.resourcePerson} onChange={handleChange} className="w-full border p-2 mb-4" />
          <label className="block mb-1 font-semibold">Company:</label>
          <input name="company" value={formData.company} onChange={handleChange} className="w-full border p-2 mb-4" />
          <label className="block mb-1 font-semibold">Location:</label>
          <input name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 mb-4" />
          <label className="block mb-1 font-semibold">Designation:</label>
          <input name="designation" value={formData.designation} onChange={handleChange} className="w-full border p-2 mb-4" />
          <label className="block mb-1 font-semibold">Topic:</label>
          <input name="topic" value={formData.topic} onChange={handleChange} className="w-full border p-2 mb-4" required />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Event Banner (Main image):</label>
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner Preview" className="w-full h-40 object-cover mb-4 rounded" />
          ) : (
            <div className="w-full h-40 bg-gray-100 mb-4 flex items-center justify-center text-gray-500 rounded">No banner uploaded</div>
          )}
          <input type="file" accept="image/*" onChange={handleBannerChange} className="w-full border p-2 mb-6" />

          <label className="block mb-1 font-semibold">Additional Photo (e.g. event capture):</label>
          {imagesPreview ? (
            <img src={imagesPreview} alt="Additional Images Preview" className="w-full h-40 object-cover mb-4 rounded" />
          ) : (
            <div className="w-full h-40 bg-gray-100 mb-4 flex items-center justify-center text-gray-500 rounded">No additional photo uploaded</div>
          )}
          <input type="file" accept="image/*" onChange={handleImagesChange} className="w-full border p-2" />
        </div>

        <div className="col-span-2 text-center mt-4">
          <button type="submit" className="bg-[#C10007] text-white px-6 py-2 rounded hover:bg-[#990005]">
            Update Lecture
          </button>
        </div>
      </form>
    </div>
  );
}
