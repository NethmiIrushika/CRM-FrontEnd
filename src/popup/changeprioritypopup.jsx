import React, { useState } from 'react';

const ChangePriorityPopup = ({
  editPriority,
  selectedCr,
  currentPriority,
  updatePriority,
  closeEditPriority,
}) => {
  const [newPriority, setNewPriority] = useState(currentPriority);

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePriority(selectedCr, newPriority);
    closeEditPriority(); // Close the popup after updating the priority
  };

  const handlePriorityChange = (e) => {
    setNewPriority(e.target.value);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center ${editPriority ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="priority" className="block text-gray-700 font-bold mb-2">
              Priority
            </label>
            <input
              type="number"
              id="priority"
              value={newPriority}
              onChange={handlePriorityChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={closeEditPriority} className="mr-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePriorityPopup;