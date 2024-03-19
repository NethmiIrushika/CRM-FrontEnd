import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';

function PrototypeCr() {
  const [crs, setCrs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCrs = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken'); // Retrieve token from storage
        
        const response = await axios.get(`${api.defaults.baseURL}/crs`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include token in the request headers
          },
        });
  
        // Filter CRs based on status "Starting Development"
        const startingDevelopmentCRs = response.data.filter(cr => cr.status === "Starting Development");
  
        setCrs(startingDevelopmentCRs);
  
      } catch (error) {
        console.error('Error fetching crs:', error);
      }
    };
    fetchCrs();
  }, []);

  const handleButtonClick = (crId) => {
    // Handle button click, you can navigate or perform any action with crId
    console.log("CR ID:", crId);
  };

  const handleSendPrototype = (crId) => {
    // Handle sending prototype for the specific CR
    console.log("Sending prototype for CR ID:", crId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCRs = crs.filter(cr =>
    Object.values(cr).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto full">
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="px-4 py-2 border border-gray-500 rounded"
        />
      </div>

      <div className="my-4">
        {filteredCRs.map(cr => (
          <div key={cr.crId} className="border rounded p-4 mb-4">
            <p><strong>CR ID:</strong> {cr.crId}</p>
            <p><strong>Name:</strong> {cr.name}</p>
            <p><strong>Department:</strong> {cr.department}</p>
            <p><strong>Topic:</strong> {cr.topic}</p>
            <p><strong>Description:</strong> {cr.description}</p>
            <button onClick={() => handleButtonClick(cr.crId)}>
              <Link to={'/dashboard/crPrototype'}>Prototype</Link>
            </button>
            <button onClick={() => handleSendPrototype(cr.crId)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Send Prototype
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrototypeCr;
