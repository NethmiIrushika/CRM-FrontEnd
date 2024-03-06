import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import StatusPopup from '../popup/statuspopup';
import ViewPopup from '../popup/viewpopup';
import api from '../api';

function UserAccount() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewPopupOpen, setViewPopupOpen] = useState(false);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken'); // Retrieve token from storage
      console.log(accessToken);
      const response = await axios.get(`${api.defaults.baseURL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include token in the request headers
        },
      });
      setUsers(response.data);

      console.log(response.data);

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  fetchUsers();
}, []);


  const handleStatusPopupOpen = (user) => {
    setSelectedUser(user);
  };

  const handleViewPopupOpen = (user) => {
    setSelectedUser(user);
    setViewPopupOpen(true);
  };

  const handleStatusChange = async (status) => {
    try {
      await axios.post(`${api.defaults.baseURL}/users/approve/${selectedUser.userId}`);
      updateUserList();
      closeStatusPopup();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const closeStatusPopup = () => {
    setSelectedUser(null);
  };

  const closeViewPopup = () => {
    setSelectedUser(null);
    setViewPopupOpen(false);
  };

  const updateUserList = async () => {
    try {
      const response = await axios.get(`${api.defaults.baseURL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error updating users:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">User Table</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">User Type</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} className="border-b">
                <td className="px-4 py-2">{user.userId}</td>
                <td className="px-4 py-2">{user.firstname}</td>
                <td className="px-4 py-2">{user.lastname}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.userType}</td>
                <td className="px-4 py-2">{user.status}</td>
                <td>
                  <button onClick={() => handleStatusPopupOpen(user)} className="btn">Change Status</button>
                  <Popup open={viewPopupOpen} closeOnDocumentClick onClose={closeViewPopup}>
                    <ViewPopup user={selectedUser} close={closeViewPopup} />
                  </Popup>
                </td>
                <td>
                  <button onClick={() => handleViewPopupOpen(user)} className="btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <StatusPopup close={closeStatusPopup} user={selectedUser} updateUser={updateUserList} />
      )}
    </div>
  );
}

export default UserAccount;