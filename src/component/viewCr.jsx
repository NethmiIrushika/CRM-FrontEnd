import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import PriorityPopup from '../popup/prioritypopup'; // Import the PriorityPopup component

function Crview() {
  const [crs, setCrs] = useState([]);
  const [selectedCr, setSelectedCr] = useState(null);
  const [editPriority, setEditPriority] = useState(false);
  const [newPriority, setNewPriority] = useState('');

  useEffect(() => {
    const fetchCrs = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken'); // Retrieve token from storage
        
        const response = await axios.get(`${api.defaults.baseURL}/crs`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include token in the request headers
          },
        });
        // console.log(accessToken);

        setCrs(response.data);

      } catch (error) {
        console.error('Error fetching crs:', error);
      }
    };
    fetchCrs();
  }, []);


  const openEditPriority = (cr) => {
    setSelectedCr(cr);
    setEditPriority(true);
    setNewPriority(cr.priority);
  };

  const closeEditPriority = () => {
    setSelectedCr(null);
    setEditPriority(false);
  };

  const handlePriorityChange = (event) => {
    setNewPriority(parseInt(event.target.value));
  };

  const updatePriority = async () => {
    try {
      await axios.put(`${api.defaults.baseURL}/crs/${selectedCr.crId}/priority`, { priority: newPriority });
      closeEditPriority();
      const response = await axios.get(`${api.defaults.baseURL}/crs`);
      setCrs(response.data);
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">CR ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Topic</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {crs.map(cr => (
                <tr key={cr.crId} className="border-b">
                  <td className="px-4 py-2">{cr.crId}</td>
                  <td className="px-4 py-2">{cr.name}</td>
                  <td className="px-4 py-2">{cr.department}</td>
                  <td className="px-4 py-2">{cr.topic}</td>
                  <td className="px-4 py-2">{cr.description}</td>
                  <td className="px-4 py-2">
                    {editPriority && selectedCr && selectedCr.crId === cr.crId ? (
                      <input
                        type="number"
                        value={newPriority}
                        onChange={handlePriorityChange}
                        autoFocus
                      />
                    ) : (
                      cr.priority
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => openEditPriority(cr)}
                    className="bg-white hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow-md"
                    >Change priority</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
     
      <PriorityPopup
        editPriority={editPriority}
        selectedCr={selectedCr}
        newPriority={newPriority}
        handlePriorityChange={handlePriorityChange}
        updatePriority={updatePriority}
        closeEditPriority={closeEditPriority}
      />
    </div>
  );
}

export default Crview;
