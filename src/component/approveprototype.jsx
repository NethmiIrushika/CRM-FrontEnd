import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';

function Approveprototype() {
  const [crprototype, setCrprototype] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCR, setSelectedCR] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigate = useNavigate();

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
          
        );navigate('/dashboard/viewcr');
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
        );navigate('/dashboard/viewcr');
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
      return pr.topic.toLowerCase().includes(searchTerm.toLowerCase()) &&
             (pr.popupstatus === null || pr.popupstatus === undefined || pr.popupstatus.trim() === '');
    }
    return false;
  });


  // const filteredCrPrototypes = crprototype.filter(pr => {
  //   if (pr && pr.topic) {
  //     return pr.topic.toLowerCase().includes(searchTerm.toLowerCase());
  //   }
  //   return false;
  // });
  

  useEffect(() => {
    fetchCrprototype();
  }, []);

  const handleActionClick = (prId) => {
    console.log('cr Id:', prId);
    navigate(`/dashboard/showprotoDetails/${prId}`);
  };

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

      <div className="container mx-auto  h-auto mb-4">
        {filteredCrPrototypes
        // .filter(pr => pr.cr && pr.cr.userId && pr.cr.userId.userId === loggedInUserId)
        .map((pr) => (
          
          <div key={pr.prId} className='bg-white rounded-lg shadow-md' >
            <h2 className="text-lg font-semibold text-center">Topic: {pr.topic}</h2>
            <div className="p-8 grid grid-cols-2 gap-4 bg-white rounded-lg shadow-md">
            <div className='col-span-1'>
              <p className="mb-2 text-left">CR ID: {pr.crId}</p>
              {pr.cr.userId && <p className='mb-2 text-left'>UserId: {pr.cr.userId.userId}</p>}
            </div>
            <div className='col-span-1'>
              <p className="mb-2 text-xl font-bold text-yellow-400 text-left">Status: {pr.cr.status}</p>
              {pr.cr && <p className="mb-2 text-left">name: {pr.cr.name}</p>}
            </div>
            <div className="col-span-2 bg-gray-200 p-4 h-auto rounded-lg">
              <p className="text-gray-600 mb-2 text-left"> Descriptin :
              <div>{pr.description}</div></p>
            </div>
            <button onClick={() => handleViewButtonClick(pr.prId)} className=" mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Get decision
            </button>
            <button onClick={() => handleActionClick(pr.prId)} className=" mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View
            </button>
            
          </div>
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
