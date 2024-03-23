import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

function Approveprototype() {
  const [crprototype, setCrprototype] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCR, setSelectedCR] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const handleViewButtonClick = async (prId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${api.defaults.baseURL}/crprototype/${prId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSelectedCR(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching CR prototype:', error);
    }
  };

  const handleAction = async (action) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      let response;
      if (action === 'approve') {
        response = await axios.put(
          `${api.defaults.baseURL}/crprototype/${selectedCR.prId}/approve`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else if (action === 'reject') {
        const reason = prompt('Enter rejection reason:');
        response = await axios.put(
          `${api.defaults.baseURL}/crprototype/${selectedCR.prId}/reject`,
          { reason },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
      if (response && response.data) {
        const updatedCRPrototype = response.data;
        setCrprototype(prevState =>
          prevState.map(cr =>
            cr.prId === updatedCRPrototype.prId ? updatedCRPrototype : cr
          )
        );
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error updating CR prototype:', error);
    }
  };

  const fetchCrprototype = async () => {
    try {
      const userId = localStorage.getItem('userId');
      setLoggedInUserId(userId);

      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${api.defaults.baseURL}/crprototype`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCrprototype(response.data);
    } catch (error) {
      console.error('Error fetching CR prototypes:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCrPrototypes = crprototype.filter(pr => {
    if (pr && pr.topic) {
      return pr.topic.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  useEffect(() => {
    fetchCrprototype();
  }, []);

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
        {filteredCrPrototypes
        // .filter(pr => pr.cr && pr.cr.userId && pr.cr.userId.userId === loggedInUserId)
        .map((pr) => (
          <div key={pr.prId} className="bg-white rounded shadow p-4 mb-4">
            <h2 className="text-xl font-semibold">CR ID: {pr.crId}, PR ID: {pr.prId}</h2>
            <h3 className="text-lg font-semibold">{pr.topic}</h3>
            <p className="text-gray-600">{pr.description}</p>
            <p className="text-gray-600">{pr.cr.status}</p>
            {pr.cr.userId && <p><strong>UserId:</strong> {pr.cr.userId.userId}</p>}
            <button onClick={() => handleViewButtonClick(pr.prId)} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Get decision
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedCR && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Approve CR Prototype</h2>
            <p>CR ID: {selectedCR.crId}, PR ID: {selectedCR.prId}</p>
            <p>{selectedCR.topic}</p>
            <p>{selectedCR.description}</p>
            <div className="mt-4">
              <button onClick={() => handleAction('approve')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4">
                Approved
              </button>
              <button onClick={() => handleAction('reject')} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Approveprototype;
