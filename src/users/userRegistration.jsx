import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import api from '../api'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '', 
    password: '',
    cpassword:'',
    userType: '',
    status: 'pending'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const { password , cpassword } = formData;
    if (password !== cpassword) {
      setError('Two different passwords. Please make sure both password are same');
      return;
    }
    try {
      const response = await api.post('/users/register/', formData);
      console.log('Data inserted successfully:', response.data);
      toast.success('You have successfully registered!');
      navigate('/userlogin');
     
    } catch (error) {
      console.error('Error inserting data:', error);
      setError('The username is already exists. Please enter a new one');

    }
  };

 

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="p-4 max-w-md w-full">
        <div className="p-6 shadow">
        <h2 className="text-2xl font-semibold mb-6">Register</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name:</label>
            <input type="text" name="firstname" id="firstname" value={formData.firstname} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name:</label>
            <input type="text" name="lastname" id="lastname" value={formData.lastname} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
            <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="cpassword" id="cpassword" value={formData.cpassword} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
              </button>
            </div>          </div>
          <div className="mb-4">
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">Usertype:</label>
            <select id="userType" name="userType" value={formData.userType} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="UserType">Select User Type </option>
              <option value="Developer">Developer </option>
              <option value="Creator">Creator</option>
              
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">Already have an account?{' '}
            <Link to="/UserLogin" className="text-blue-500 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Register;
