import React from 'react';

const PriorityPopup = ({ editPriority, selectedCr, newPriority, handlePriorityChange, updatePriority, closeEditPriority }) => {
  return (
    <div className={editPriority ? 'fixed inset-0 flex items-center justify-center' : 'hidden'}>
      <div className="bg-white w-1/2 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl mb-4">Edit Priority</h2>
        <input
          type="number"
          className="w-full py-2 px-4 mb-4 border rounded-lg"
          value={newPriority}
          onChange={handlePriorityChange}
          autoFocus
        />
        <div className="flex justify-between">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={updatePriority}>Save</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300" onClick={closeEditPriority}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PriorityPopup;
