import React from 'react';
import Popup from 'reactjs-popup';

const customModalClass = {
  content: 'max-w-lg mx-auto bg-gray-800 text-white rounded-md p-6 shadow-lg z-50',
  overlay: 'fixed inset-0 bg-gray-900 bg-opacity-75',
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
            <p className="text-xl font-semibold mb-2">Priority Information</p>
            <p className="text-lg">The priority number of your CR is {priority}</p>
            <div className="flex justify-between">
              <button onClick={onClose} className="inline-block w-1/2 mr-1 py-2 px-4 bg-blue-800 text-white rounded-l-md hover:bg-blue-900 focus:outline-none focus:bg-blue-900">Close</button>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
}

export default PriorityPopup;
