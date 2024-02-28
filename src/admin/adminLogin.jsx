import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const { username, password } = formData;

    
    if (!username || !password) {
      setError('Please fill in all the fields.');
      return;
    }

    try {
      const response = await api.post('/users/login', { username, password });

      if (response && response.data) {
        const {data} = response;
        if (data.accessToken){
          localStorage.setItem('token', data.accessToken);
          toast.success('You have  successfully logged in!');
          navigate('/dashboard');
        } else {
          setError (data.message || 'login failed. Please try again');
          }
        } else {
          setError ('something went wrong. Please try again');
        }
      } catch (error){
        console.error('Error:', error);
        setError ('Login error');
      }

      
       
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
            <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </form>
        
        
      </div>
    </div>
  );
}

export default AdminLogin;
