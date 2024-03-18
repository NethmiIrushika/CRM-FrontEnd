import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import api from '../api';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CrProtoType() {
  const [description, setDescription] = useState('');

  const handleChange = (value) => {
    setDescription(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(`${api.defaults.baseURL}/cr-prototype`, {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });
      // Clear the description after successful submission
      setDescription('');
      toast.success('You have successfully made a change request!');
    } catch (error) {
      console.error('Error submitting description:', error);
      
    }
  };

  return (
    <div>
      <h1>CR Proto Types</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <ReactQuill value={description} onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
