// statuspopup.js

// Import necessary dependencies
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import api from '../api';
import axios from 'axios';

// Define your custom Tailwind CSS class with dark theme
const customModalClass = {
  content: 'max-w-md mx-auto bg-gray-800 text-white rounded-md p-6 shadow-lg',
  overlay: 'fixed inset-0 bg-gray-900 bg-opacity-75 z-50',
};

// Create your StatusPopup component
function StatusPopup({ close, user, updateUser }) {
  const [newStatus, setNewStatus] = useState(user.status);

  // Function to handle status change
  const changeStatus = async () => {
    try {
      // Update the user status in the database
      await axios.put(`${api.defaults.baseURL}/users/${user.userId}`, { status: newStatus });

      // Close the popup
      close();

      // Call the callback function to update the user table
      updateUser();
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
        <div>
          <label htmlFor="status" className="block mb-2 text-white">New Status:</label>
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
          <button onClick={changeStatus} className="block w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Save</button>
          <button onClick={close} className="block w-full mt-4 py-2 px-4 border rounded-md text-white hover:bg-gray-600 focus:outline-none">Cancel</button>
        </div>
      )}
    </Popup>
  );
}

export default StatusPopup;
