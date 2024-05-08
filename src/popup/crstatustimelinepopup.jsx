import Popup from 'reactjs-popup';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

const customModalClass = {
    content: 'max-w-lg mx-auto bg-gray-800 text-white rounded-md p-6 shadow-lg',
    overlay: 'fixed inset-0 bg-gray-900 bg-opacity-75 z-50',
  };

function CrstatusTimelinePopup({ show, onClose, crId }) {
  const [cr, setCr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrDetails = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${api.defaults.baseURL}/crs/${crId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCr(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching CR details:', error);
        setError(error);
        setLoading(false);
      }
    };

    if (show && crId) { 
      fetchCrDetails();
    }
  }, [show, crId]);

  if (!show || !crId) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Popup
      modal
      open={show}
      closeOnDocumentClick={false}
      onClose={onClose}
      contentStyle={customModalClass}
    >
      {(close) => (<div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
          
        <div className='flex justify-center items-center h-80 bg-gray-100 w-80 rounded-lg'>
          <div>

            <div>Topic: {cr ? cr.topic : 'No topic available'}</div>
            <div>Department: {cr ? cr.department : 'No department available'}</div>
            <div className="flex justify-center">
              <button onClick={onClose} className="inline-block  mr-1 py-2 px-4 bg-yellow-300 text-white rounded-l-md hover:bg-yellow-500 focus:outline-none focus:bg-yellow-500 text-center">Close</button>
            </div>
          </div>
        </div>
        </div>
       
      )}
    </Popup>
  );
}

export default CrstatusTimelinePopup;
