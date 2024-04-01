import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

function UserLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
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
          localStorage.setItem('accessToken',response.data.accessToken);

          localStorage.setItem('userId', data.userId);

          localStorage.setItem('userType', data.userType);

        
          toast.success('You have  successfully logged in!');
            
          if (data.userType === 'Developer' || data.userType === 'SFA_User' ) {
            navigate('/dashboard/viewCr');
          } else if (data.userType === 'Admin') {
            navigate('/dashboard/useraccount');
          } else if (data.userType === 'HOD'){
            navigate('/dashboard/OngoingApprovelCr')
          }

       
        } else {
          setError (data.message || 'login failed. Please try again');
          }
      } else {
          setError('Something went wrong. Please try again');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 403) {
          setError('Your account is still not approved');
      } else if (error.response && error.response.status === 401) {
          setError('Invalid credentials');
          setFormData({ username: '', password: '' });
      } else {
          setError('Invalid credentials');
          setFormData({ username: '', password: '' });
      }
    }
  }


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Email:</label>
            <input type="email" name="username" id="username" value={formData.username} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 p-2.5 w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-yellow-400 text-white py-2.5 rounded-md hover:bg-yellow-600 transition duration-300">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/userRegistration" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
