import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api.jsx';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getLoginInfo } from "../utils/LoginInfo";

const Insert = () => {
  const [formData, setFormData] = useState({
    name: getLoginInfo()?.firstname,
    department: getLoginInfo()?.department,
    topic: '',
    description: '',
    image: null,
    status: 'Pending',
    date: '',
    priority: 0,
    
  });

  const navigate = useNavigate();

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
        console.error('Access token not found.');
        return;
      }

      const response = await axios.post(
        `${api.defaults.baseURL}/crs/`,
        {
          ...formData,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Data inserted successfully:', response.data);

      const { crId } = response.data;

      console.log('Created CR ID:', crId);

      toast.success('You have successfully made a change request!');
      navigate('/dashboard/viewCr');
    } catch (error) {
      console.error('Error inserting data:', error);

    }
  };



    const handleFileUpload = async (e) => {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      try {
        
      const response = await axios.post(
        `${api.defaults.baseURL}/crs/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('File uploaded:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };
  




  return (

      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Change Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic:</label>
              <input 
                type="text" 
                id="topic" 
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder-gray-400 text-gray-700" 
                placeholder="Enter topic" 
                value={formData.topic} 
                onChange={handleChange} 
                required 
              />
            </div>
  
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
              <div>
                <ReactQuill
                  className="bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                />
              </div>
            </div>
  
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Attach File:</label>
              <input 
                type="file" 
                id="file" 
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                onChange={handleFileUpload} 
              />
            </div>
  
            <button 
              type="submit" 
              className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
            
          </div>
        </form>
      </div>

  );
  
  
  
};
export default Insert;