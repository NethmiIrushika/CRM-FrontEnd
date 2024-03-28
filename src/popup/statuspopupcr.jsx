import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import api from '../api';
import axios from 'axios';

const StatusPopupcr = ({ cr, close, updateCr }) => {
  const [newcrStatus, setNewStatus] = useState(cr.hodApprovel);

  const changeStatus = async () => {
    try {
      await axios.put(`${api.defaults.baseURL}/crs/${cr.crId}`, { hodApprovel: newcrStatus });
      close();
      updateCr({ ...cr, hodApprovel: newcrStatus });
    } catch (error) {
      console.error('Error changing CR status:', error);
    }
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
            <label htmlFor="status" className="block mb-2 text-black">Approvel of Cr:</label>
            <select
              id="status"
              value={newcrStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="block w-full py-2 px-4 mb-4 border rounded-md bg-gray-700 text-white focus:outline-none focus:border-blue-500"
            >
                <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              
            </select>
            <div className="flex justify-between">
              <button onClick={changeStatus} className="inline-block w-1/2 mr-1 py-2 px-4 bg-blue-800 text-white rounded-l-md hover:bg-blue-900 focus:outline-none focus:bg-blue-900">Save</button>
              <button onClick={close} className="inline-block w-1/2 ml-1 py-2 px-4 bg-blue-300 text-blue-900 rounded-r-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default StatusPopupcr;
