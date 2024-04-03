import React, { useState } from 'react';
import axios from 'axios';
import api from '../api';
import {  useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const customModalClass = {
  content: 'max-w-lg mx-auto bg-gray-800 text-white rounded-md p-6 shadow-lg ',
  overlay: 'fixed inset-0 bg-gray-900 bg-opacity-75 z-50',
};

const RejectReasonPopup = ({ prId, onReject ,onCancel}) => {
  const [reason, setReason] = useState('');
const navigate = useNavigate();
  const handleReject = async () => {
    if (reason.trim() !== '') {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.put(
          `${api.defaults.baseURL}/crprototype/${prId}/reject`,
          { reason },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
          
        );
        toast.error('You reject the prototype')
        navigate('/dashboard/viewcr')
        if (response.data) {
          onReject(reason);
        }
      } catch (error) {
        console.error('Error rejecting prototype:', error);
      }
    } else {
      alert('Please enter a rejection reason.');
    }
  };

  return (
    <div className={customModalClass.overlay}>
      <div className={customModalClass.content}>
        <h2 className="text-xl font-semibold text-center mb-4">
          Enter Rejection Reason
        </h2>
        <textarea
          className="w-full bg-gray-700 rounded-md p-2 mb-4"
          rows="4"
          placeholder="Enter reason for rejection"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-center">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectReasonPopup;