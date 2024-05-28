import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';

const OtherPr = () => {
  const { crId } = useParams(); 
  const {state} = useLocation();
  const [formData, setFormData] = useState({
    topic: state?.topic ||'',
    description: '', estimatedDate: '',
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
  
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  }

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    if (crId && state?.topic) {
      setFormData(prevState => ({
        ...prevState,
        topic: state.topic,
      }));
    }
  }, [state?.topic, crId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('description', formData.description);
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('crId', crId);
      formDataToSend.append('file', file);
      formDataToSend.append('estimatedDate', estimatedDate);
  
      const response = await api.post('/crprototype/', formDataToSend);
  
      console.log('Data inserted successfully:', response.data);
      
      // Update CR status
      await api.put(`/crs/${crId}/status`, { status: 'Need Approvel For Second Prototype' });
      toast.success('You have successfully sent a change request prototype!');
      
      setTimeout(() => {
        navigate('/dashboard/viewCr');
      });
    } catch (error) {
      console.error('Error inserting data:', error);
      toast.error('Error creating change request prototype. Please try again.');
    }
  };

  const [estimatedDate, setEstimatedDate] = useState(null);

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Change Request ProtoType </h2>
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
              required
            />
          </div>

          <div>
  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
    Description:
  </label>
  <ReactQuill
    id="description"
    value={formData.description}
    onChange={value => setFormData(prevState => ({ ...prevState, description: value }))}
    className="quill-editor" 
  />
</div>

<div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Attach File:
            </label>
            <input
              type="file"
              id="file"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              onChange={handleFileUpload}
            />
          </div>
          <div>
            <label htmlFor="estimatedDate" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Date:
            </label>
            <DatePicker
              id="estimatedDate"
              selected={estimatedDate}
              onChange={date => setEstimatedDate(date)} 
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              dateFormat="yyyy-MM-dd" 
              placeholderText="Select Estimated Date" 
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

export default OtherPr;
