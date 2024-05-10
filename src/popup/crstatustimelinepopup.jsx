import Popup from 'reactjs-popup';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { format } from 'date-fns';

const customModalClass = {
    content: 'max-w-lg mx-auto bg-gray-800 text-white rounded-md p-6 shadow-lg',
    overlay: 'fixed inset-0 bg-gray-900 bg-opacity-75 z-50',
  };

function CrstatusTimelinePopup({ show, onClose, crId, prId }) {
  const [cr, setCr] = useState(null);
  const [pr, setPr] = useState(null);
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

    const fetchCrDetails_1 = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${api.defaults.baseURL}/crprototype/${prId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPr(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching CR details:', error);
        setError(error);
        setLoading(false);
      }
    };
    


      fetchCrDetails();
     // fetchCrDetails_1();
    }
  }, [show, crId]);

  if (!show || !crId || !prId) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss'); 
  };

  return (
    <Popup
      modal
      open={show}
      closeOnDocumentClick={false}
      onClose={onClose}
      contentStyle={customModalClass}
    >
      {(close) => (<div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
          
        <div className='flex justify-center items-center h-64 bg-gray-100 w-2/3 rounded-lg'>
          <div className='p-8 '>
             
            <table className='table-fixed mb-4'>
                <tr>
                    <td className="pr-4" > CR Created At</td>
                    <td className="pr-4">-</td>
                    <td className="pr-4">{cr ? formatDate(cr.createdAt) : 'No time available'}</td>
                </tr>
                <tr>
                    <td className="pr-4">HOD Approve At</td>
                    <td className="pr-4">  -</td>
                    <td className="pr-4">{cr ? formatDate(cr.hodApprovelAt) : 'No time available'}</td>
                </tr>
                <tr>
                    <td className="pr-4">Get to development by</td>
                    <td className="pr-4"> -</td>
                    <td className="pr-4">{cr.developer} </td>
                </tr>
                <tr>
                    <td className="pr-4">Department</td>
                    <td className="pr-4"> -</td>
                    <td className="pr-4">{cr ? cr.department : 'No department available'}</td>
                </tr>
            </table>
            
            <div className="flex justify-center mt-6">
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
