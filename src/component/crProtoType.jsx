import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CrProtoType({ crId }) {
  const [description, setDescription] = useState('');

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/cr-prototype', { description });
      // Optionally, handle success (e.g., show a success message)
      console.log(response.data); // Log the response for debugging
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error saving data:', error);
      toast.error('Failed to save data');
    }
  };

  return (
    <div>
      <h1>CR Proto Types</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='description'>Description:</label>
          <input 
            type='text' 
            id='description' 
            name='description' 
            value={description} 
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
