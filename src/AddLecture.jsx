import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const AddLecture = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [selectedBannerName, setSelectedBannerName] = React.useState('No file chosen');

  const onSubmit = async (data) => {
    const formData = new FormData();

    for (const key in data) {
      if (key !== 'banner') {
        formData.append(key, data[key]);
      }
    }

    const bannerFile = document.getElementById('bannerUpload').files[0];
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/lectures', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add lecture');

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
    <div className="min-h-screen bg-white px-4 py-10 md:px-10 pt-24 md:pt-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-[#C10007] mb-8 text-center md:text-left">
          Add Guest Lectures
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-2 border-red-700 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded"
        >
          {/* Lecture Details */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Lecture Details</h3>
            <input
              {...register('teacher')}
              placeholder="Teacher"
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              {...register('venue')}
              placeholder="Venue"
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              {...register('class')}
              placeholder="Class"
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              {...register('time')}
              placeholder="Time"
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              {...register('strength')}
              placeholder="Strength"
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Guest Details */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Guest Details</h3>
            <input
              {...register('resourcePerson')}
              placeholder="Resource Person"
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              {...register('company')}
              placeholder="Company"
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              {...register('location')}
              placeholder="Location"
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              {...register('designation')}
              placeholder="Designation"
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              {...register('topic')}
              placeholder="Topic"
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            {/* Banner Upload */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-700">Upload Banner:</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label
                  htmlFor="bannerUpload"
                  className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded cursor-pointer text-center"
                >
                  Choose File
                </label>
                <input
                  id="bannerUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register('banner')}
                  onChange={(e) =>
                    setSelectedBannerName(e.target.files[0]?.name || 'No file chosen')
                  }
                />
                <span className="text-sm text-gray-600 break-all">{selectedBannerName}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#C10007] text-white px-6 py-2 rounded hover:bg-[#990005] transition-all"
            >
              Add Lecture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLecture;
