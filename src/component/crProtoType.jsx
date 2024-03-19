// CrProtoType.jsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrProtoType = () => {
  const { crId } = useParams(); // Extract crId from URL parameters

  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    crId:''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await api.post('/crprototype/', {
        description: formData.description,
        topic: formData.topic,
        crId: crId // Ensure crId is included here
      });
  
      console.log('Data inserted successfully:', response.data);
      toast.success('You have successfully made a change request!');
      
      setTimeout(() => {
        navigate('/dashboard/prototypeCr');
      }, 2000);
    } catch (error) {
      console.error('Error inserting data:', error);
      toast.error('Error creating change request prototype. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Change Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <input type="hidden" id="crId" value={crId} />

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Topic:
            </label>
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description:
            </label>
            <textarea
              id="description"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder-gray-400 text-gray-700"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              required
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

export default CrProtoType;
