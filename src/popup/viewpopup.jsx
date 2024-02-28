import React from 'react';
import PropTypes from 'prop-types';

const ViewPopup = ({ close, user }) => {
  return (
    <div className="popup-full" style={{ background: 'linear-gradient(to bottom right, #f0f0f0, #ffffff)' }}>
      <div className="popup-full_inner" style={{ boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.2)', padding: '20px', borderRadius: '20px' }}>
        <h1 style={{ fontFamily: 'Roboto', fontSize: '24px', marginBottom: '20px' }}>View Popup</h1>
        <p style={{ fontFamily: 'Roboto', fontSize: '16px', marginBottom: '8px' }}>View Details of {user.username}</p>
        <p style={{ fontFamily: 'Roboto', fontSize: '14px', marginBottom: '4px' }}>ID: {user.userId}</p>
        <p style={{ fontFamily: 'Roboto', fontSize: '14px', marginBottom: '4px' }}>First Name: {user.firstname}</p>
        <p style={{ fontFamily: 'Roboto', fontSize: '14px', marginBottom: '4px' }}>Last Name: {user.lastname}</p>
        <p style={{ fontFamily: 'Roboto', fontSize: '14px', marginBottom: '4px' }}>User Type: {user.userType}</p>
        <p style={{ fontFamily: 'Roboto', fontSize: '14px', marginBottom: '20px' }}>Status: {user.status}</p>
        <button onClick={close} className="btn" style={{ fontFamily: 'Roboto', fontSize: '16px', padding: '10px 20px', borderRadius: '4px', backgroundColor: '#007bff', color: '#ffffff', border: 'none' }}>Close</button>
      </div>
    </div>
  );
};

ViewPopup.propTypes = {
  close: PropTypes.func.isRequired,
  user: PropTypes.shape({
    userId: PropTypes.number,
    username: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    userType: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

export default ViewPopup;