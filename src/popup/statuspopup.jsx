import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import api from '../api';
import axios from 'axios';


const customModalClass = {
  content: 'max-w-lg mx-auto bg-gray-800 text-white rounded-md p-6 shadow-lg', 
  overlay: 'fixed inset-0 bg-gray-900 bg-opacity-75 z-50',
};

function StatusPopup({ close, user, updateUser }) {
  const [newStatus, setNewStatus] = useState(user.status);

  // Function to handle status change
  const changeStatus = async () => {
    try {
      // Update the user status in the database
      await axios.put(`${api.defaults.baseURL}/users/${user.userId}`, { status: newStatus });
      close();
      updateUser({ ...user, status: newStatus });
    } catch (error) {
      console.error('Error changing user status:', error);
    }
  };

  return (
    // Popup component
    <Popup
      modal
      open
      closeOnDocumentClick={false}
      onClose={close}
      contentStyle={customModalClass}
    >
      {(close) => (
        <div className='flex justify-center items-center h-80 bg-gray-100 w-80 rounded-lg'>
          <div>
            <label htmlFor="status" className="block mb-2 text-black">New Status:</label>
            <select
              id="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="block w-full py-2 px-4 mb-4 border rounded-md bg-gray-700 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
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
}

export default StatusPopup;
