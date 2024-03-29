import React from 'react';
import Popup from 'reactjs-popup';

const customModalClass = {
  content: 'max-w-lg mx-auto bg-gray-800 text-white rounded-md p-6 shadow-lg ',
  overlay: 'fixed inset-0 bg-gray-900 bg-opacity-75 z-50',
};

function PriorityPopup({ show, priority, onClose }) {
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
            <p className="text-xl font-semibold mb-2 text-center">Pending Approvel</p>
            <p className="text-lg text-center">
              Your CR is pending the approvel from Head of Department!!
            </p>
            <div className="flex justify-center">
            <button onClick={onClose} className="inline-block w-1/2 mr-1 py-2 px-4 bg-yellow-300 text-white rounded-l-md hover:bg-yellow-500 focus:outline-none focus:bg-yellow-500 text-center">Close</button>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
}

export default PriorityPopup;