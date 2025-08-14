import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const AddLecture = () => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const navigate = useNavigate();
  const [selectedBannerName, setSelectedBannerName] = React.useState('No file chosen');

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append text fields except banner
    for (const key in data) {
      if (key !== 'banner') {
        formData.append(key, data[key]);
      }
    }

    // Append banner file if selected
    const bannerFile = document.getElementById('bannerUpload').files[0];
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/lectures', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add lecture');
      }

      alert('Lecture added successfully!');
      reset();
      setSelectedBannerName('No file chosen');

      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error adding lecture');
    }
  };

  return (
    <div className="min-h-screen bg-white p-10">
      <h2 className="text-3xl font-bold text-[#C10007] mb-8">Add Guest Lectures</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 border-red-700 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded"
      >
        {/* Lecture Details */}
        <div>
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Lecture Details</h3>
          <input {...register('teacher')} placeholder="Teacher" className="w-full border p-2 mb-4" />
          <input {...register('venue')} placeholder="Venue" className="w-full border p-2 mb-4" />
          <input {...register('class')} placeholder="Class" className="w-full border p-2 mb-4" />
          <input {...register('time')} placeholder="Time" className="w-full border p-2 mb-4" />
          <input {...register('strength')} placeholder="Strength" className="w-full border p-2 mb-4" />
        </div>

        {/* Guest Details */}
        <div>
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Guest Details</h3>
          <input {...register('resourcePerson')} placeholder="Resource Person" className="w-full border p-2 mb-4" />
          <input {...register('company')} placeholder="Company" className="w-full border p-2 mb-4" />
          <input {...register('location')} placeholder="Location" className="w-full border p-2 mb-4" />
          <input {...register('designation')} placeholder="Designation" className="w-full border p-2 mb-4" />
          <input {...register('topic')} placeholder="Topic" className="w-full border p-2 mb-4" />

          {/* Upload Banner */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Upload Banner:</label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="bannerUpload"
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded cursor-pointer"
              >
                Choose File
              </label>
              <input
                id="bannerUpload"
                type="file"
                accept="image/*"
                className="hidden"
                {...register('banner')}
                onChange={(e) => setSelectedBannerName(e.target.files[0]?.name || 'No file chosen')}
              />
              <span className="text-sm text-gray-600">{selectedBannerName}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-[#C10007] text-white px-6 py-2 rounded hover:bg-[#990005]"
          >
            Add Lecture
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLecture;
