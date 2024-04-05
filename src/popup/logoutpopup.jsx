import React from 'react';
import Popup from 'reactjs-popup';

const customModalClass = {
  content: 'max-w-lg mx-auto bg-gray-800 text-white rounded-md p-6 shadow-lg',
  overlay: 'fixed inset-0 bg-gray-900 bg-opacity-75 z-50',
};

function LogoutPopup({ show, onConfirm, onClose }) {
  return (
    <Popup
      modal
      open={show}
      closeOnDocumentClick={false}
      onClose={onClose}
      contentStyle={customModalClass}
    >
      {(close) => (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-xl font-semibold mb-4 text-center">Confirm Logout</p>
            <p className="text-lg mb-4 text-center">
              Do you want to exit the CR Management System?
            </p>
            <div className="flex justify-between">
              <button onClick={onConfirm} className="inline-block w-1/2 py-2 px-4 bg-yellow-400 text-white rounded-l-md hover:bg-yellow-500 focus:outline-none mr-1">Yes </button>
              <button onClick={onClose} className="inline-block w-1/2 py-2 px-4 bg-red-400 text-white rounded-r-md hover:bg-red-500 focus:outline-none bg-red-400"> No </button>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
}

export default LogoutPopup;
