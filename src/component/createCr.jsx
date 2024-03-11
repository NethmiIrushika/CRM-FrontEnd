import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropzone from 'react-dropzone';
import 'react-dropzone-uploader/dist/styles.css';

const Insert = () => {
  const [formData, setFormData] = useState({
    name: '',
    department: 'Select',
    topic: '',
    description: '',
    image: null,


  });

  const navigate = useNavigate();

  const [uploaded, setUploaded] = useState(false);

  const getUploadParams = () => {
    return { url: '/upload' };
  };

  const handleChangeStatus = (status, file) => {
    if (status === 'done' && file.size === 0) {
      toast.error('Invalid file type or extension. Please upload a valid image file.');
    }
    if (status === 'done' && file.size !== 0) {
      setUploaded(true);
    }
  };
  

  // Assuming you have a mechanism to retrieve userId from localStorage or context
  const userId = localStorage.getItem('userId');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleImageUpload = (acceptedFiles) => {
    // Check if any files are present
  if (acceptedFiles.length === 0) {
    // No files uploaded, return early
    return;
  }
    const imageFile = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        image: reader.result,
      });
    };
    reader.readAsDataURL(imageFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        // Handle case where access token is not available
        console.error('Access token not found.');
        return;
      }

      const response = await axios.post(`${api.defaults.baseURL}/crs/`,
        {
          ...formData,
          userId: userId, // Include userId in the data
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Data inserted successfully:', response.data);

      // Extract the crId from the response
      const { crId } = response.data;

      // Use the crId as needed
      console.log('Created CR ID:', crId);

      toast.success('You have successfully made a change request!');
      navigate('/dashboard/viewCr');


    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };




  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Full Name:</label>
              <input type="text" id="name"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department:</label>
              <select id="department" name="department" value={formData.department} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                <option value="Select">Select Department</option>
                <option value="IT">IT</option>
                <option value="Sales">Sales</option>
                <option value="SAP">SAP</option>
              </select>
            </div>
            <div>
              <label htmlFor="topic" className="block mb-2 text-sm font-medium text-gray-900 ">Topic:</label>
              <input type="text" id="topic" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Topic" value={formData.topic} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 ">
                Description:
              </label>
              <ReactQuill value={formData.description} onChange={handleDescriptionChange} />
              <Dropzone
                onDrop={handleImageUpload}
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatus}
                accept={['image/*']} // Provide accept as an array
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="mt-4">
                    <input {...getInputProps()} />
                    <p className="text-sm text-gray-600">Drop an image here, or click to select one</p>
                  </div>
                )}
              </Dropzone>


              {formData.image && (
                <img src={formData.image} alt="Uploaded" className="mt-4 max-w-full h-auto" />
              )}
            </div>
          </div>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Insert;
