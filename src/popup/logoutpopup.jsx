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
        <div className='flex justify-center items-center h-80 bg-gray-100 w-80 rounded-lg'>
          <div>
            <p className="text-xl font-semibold mb-4">Confirm Logout</p>
            <p className="text-lg mb-4">
              Do you want to exit the CR Management System?
            </p>
            <div className="flex justify-between">
              <button onClick={onClose} className="inline-block w-1/2 py-2 px-4 bg-yellow-300 text-white rounded-l-md hover:bg-yellow-500 focus:outline-none focus:bg-yellow-500">No</button>
              <button onClick={onConfirm} className="inline-block w-1/2 py-2 px-4 bg-red-500 text-white rounded-r-md hover:bg-red-700 focus:outline-none focus:bg-red-700">Yes</button>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
}

export default LogoutPopup;
