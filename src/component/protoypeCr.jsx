

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useNavigate } from 'react-router-dom';

import 'react-quill/dist/quill.snow.css';

function PrototypeCr() {
  const [crs, setCrs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrs = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken'); // Retrieve token from storage
        
        const response = await axios.get(`${api.defaults.baseURL}/crs`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, 
          },
        });
  
        const startingDevelopmentCRs = response.data.filter(cr => cr.status === "Starting Development");
  
        setCrs(startingDevelopmentCRs);
  
      } catch (error) {
        console.error('Error fetching crs:', error);
      }
    };
    fetchCrs();
  }, []);

  const handleButtonClick = (crId) => {
    console.log("CR ID:", crId);
    navigate(`/dashboard/crProtoType/${crId}`);
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
              Prototype
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrototypeCr;
