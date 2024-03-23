import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

function ApproveORreject() {

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
      if (pr && pr.popupstatus) {
        return pr.popupstatus.toLowerCase() === 'approved' || pr.popupstatus.toLowerCase() === 'rejected';
      }
      return false;
    });

    const handleChangeStatusButtonClick = async (prId) => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const response = await axios.put(
            `${api.defaults.baseURL}/crprototype/${prId}/completeTask`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response && response.data) {
            const updatedCRPrototype = response.data;
            setCrprototype(prevState =>
              prevState.map(cr =>
                cr.prId === updatedCRPrototype.prId ? updatedCRPrototype : cr
              )
            );
          }
        } catch (error) {
          console.error('Error completing task:', error);
        }
      };
  
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
          {filteredCrPrototypes.map((pr) => (
            <div key={pr.prId} className="bg-white rounded shadow p-4 mb-4">
              <h2 className="text-xl font-semibold">CR ID: {pr.crId}, PR ID: {pr.prId}</h2>
              <h3 className="text-lg font-semibold">{pr.topic}</h3>
              <p className="text-gray-600">{pr.description}</p>
              <p className="text-gray-600"><strong>Prototype Status:</strong>{pr.popupstatus}</p>
              {pr.rejectionReason && <p className="text-gray-600"><strong>Rejected reason:</strong>{pr.rejectionReason}</p>}
              {/* {pr.cr.userId && <p><strong>UserId:</strong> {pr.cr.userId.userId}</p>} */}
              <button onClick={() => handleViewButtonClick(pr.prId)} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                view CR
              </button>
              <button onClick={() => handleViewButtonClick(pr.prId)} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                view prototype
              </button>
              <button onClick={() => handleChangeStatusButtonClick(pr.prId)} className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Complete Task
              </button>
            </div>
          ))}
        </div>
  
      </div>
    );
}

export default ApproveORreject;
