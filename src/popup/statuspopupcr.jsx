import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import api from '../api';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

const StatusPopupcr = ({ cr, close, update }) => {
  const [newCrStatus, setNewCrStatus] = useState(cr.hodApprovel || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const navigate = useNavigate()
  const changeStatus = async () => {
    setLoading(true);
    try {
      await axios.put(`${api.defaults.baseURL}/crs/${cr.crId}/update-hod-approval`, { hodApprovel: newCrStatus });
      close();
      update({ ...cr, hodApprovel: newCrStatus });
      navigate('/dashboard/ongoingApprovelCr');
    } catch (error) {
      setError('Error changing CR status. Please try again later.');
      console.error('Error changing CR status:', error);
    }
    setLoading(false);
  };

  return (
    <Popup
      modal
      open
      closeOnDocumentClick={false}
      onClose={close}
    >
      {(close) => (
        <div className='flex justify-center items-center h-80 bg-gray-100 w-80 rounded-lg'>
          <div>
            <label htmlFor="status" className="block mb-2 text-black">Approval of CR:</label>
            <select
              id="status"
              value={newCrStatus}
              onChange={(e) => setNewCrStatus(e.target.value)}
              className="block w-full py-2 px-4 mb-4 border rounded-md bg-slate-50 text-black focus:outline-none focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
            {error && <div className="text-red-600">{error}</div>}
            <div className="flex justify-between">
              <button onClick={changeStatus} disabled={loading} className={`inline-block w-1/2 mr-1 py-2 px-4 bg-lime-500 text-white rounded-l-md hover:bg-lime-600 focus:outline-none focus:bg-lime-900 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>Save</button>
              <button onClick={close} disabled={loading} className={`inline-block w-1/2 ml-1 py-2 px-4 bg-red-500 text-white rounded-r-md hover:bg-red-600 focus:outline-none focus:bg-red-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default StatusPopupcr;
