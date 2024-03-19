import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

function Approveprototype() {
  const [crprototype, setCrprototype] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCrprototype = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${api.defaults.baseURL}/crprototype`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCrprototype(response.data);
      } catch (error) {
        console.error('Error fetching crs:', error);
      }
    };
    fetchCrprototype();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCrPrototypes = crprototype.filter((cr) =>
    cr.topic.toLowerCase().includes(searchTerm.toLowerCase())
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

      <div className="mt-4">
        {filteredCrPrototypes.map((cr) => (
          <div key={cr.crId} className="bg-white rounded shadow p-4 mb-4">
            <h2 className="text-xl font-semibold">{cr.topic}</h2>
            <p className="text-gray-600">{cr.description}</p>
            <button onClick={() => handleViewButtonClick(cr.crId)} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Approveprototype;
