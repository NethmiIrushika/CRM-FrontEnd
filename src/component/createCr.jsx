import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getLoginInfo } from '../utils/LoginInfo';
import PriorityPopup from '../popup/prioritypopup.jsx';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';

const Insert = () => {
  const [formData, setFormData] = useState({
    name: getLoginInfo()?.firstname + ' ' + getLoginInfo()?.lastname,
    department: getLoginInfo()?.department,
    topic: '',
    description: '',
    status: 'Need CR Approvel',
    date: '',
    priority: 0,
    crtype: '',
    requiredDate: '',
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  }

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('User ID not found.');
      return;
    }
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found.');
        return;
      }
  
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('userId', userId);
      formDataToSend.append('crtype', formData.crtype);
      formDataToSend.append('requiredDate', requiredDate);
      const response = await axios.post(`${api.defaults.baseURL}/crs/create`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
        
     

      console.log('Data inserted successfully:', response.data);
    
      const { crId , priority } = response.data;

      setFormData(prevState => ({
        ...prevState,
        priority: priority,
      }));
      
    
      toast.success('You have successfully made a change request!');
      setShowPriorityPopup(true);
setTimeout(() => {
  navigate('/dashboard/OngoingApprovelCr');
}, 2000);
     
      
      
    } catch (error) {
      console.error('Error inserting data:', error);
    }
console.log(showPriorityPopup);
    
  };
 
  const [requiredDate, setRequiredDate] = useState(null);
  return (
    <div className={`max-w-lg mx-auto bg-white shadow-lg rounded-lg p-12 `}>
      {showPriorityPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <PriorityPopup
             show={showPriorityPopup}
             priority={formData.priority}
             onClose={() => setShowPriorityPopup(false)}
          />
        </div>
      )}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Change Request</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid gap-6">
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

          <div className="mb-4">
              <label
                htmlFor="crtype"
                className="block text-sm font-medium text-gray-700"
              >
                CR Type:
              </label>
              <select
                id="crtype"
                name="crtype"
                value={formData.crtype}
                onChange={handleChange}
                className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select CR Type</option>
                <option value="Enhancement/Report/Form Modification">Enhancement/Report/Form Modification</option>
                <option value="Update & Fix Security">Update & Fix Security</option>
                <option value="A Modification">A Modification</option>
                <option value="Security">Security</option>
              </select>
            </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description:
            </label>
            <div>
              <ReactQuill
                className="bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={handleDescriptionChange}
              />
            </div>
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
            <label htmlFor="requiredDate" className="block text-sm font-medium text-gray-700 mb-1">
              Required  Date:
            </label>
            <DatePicker
              id="requiredDate"
              selected={requiredDate}
              onChange={date => setRequiredDate(date)} 
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              dateFormat="yyyy-MM-dd" 
              placeholderText="Select required date" 
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