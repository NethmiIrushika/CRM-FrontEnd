import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const ShowProtoDetails = () => {
    const [showModal, setShowModal] = useState(false);
    const { prId } = useParams();
    const [pr, setPr] = useState(null);

    const navigate = useNavigate(); // Import useNavigate and initialize it

    useEffect(() => {
        const fetchCrDetails = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get(`${api.defaults.baseURL}/crprototype/${prId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setPr(response.data);
            } catch (error) {
                console.error('Error fetching CR details:', error);

            }
        };

        fetchCrDetails();
    }, [prId]);

    const handleActionClick = async (prId) => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const response = await axios.get(`${api.defaults.baseURL}/crprototype/${prId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setPr(response.data);
          setShowModal(true);
        } catch (error) {
          console.error('Error fetching CR prototype:', error);
        }
      };

    const handleViewAttachment = () => {
        // Construct the URL to fetch the file
        const fileUrl = `${api.defaults.baseURL}/uploads/prototype/${pr.filePath}`;
        // Open the file in a new tab
        window.open(fileUrl, '_blank');
    };

    const handleAction = async (action) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            let response;
            if (action === 'approve') {
                response = await axios.put(
                    `${api.defaults.baseURL}/crprototype/${pr.prId}/approve`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
            } else if (action === 'reject') {
                const reason = prompt('Enter rejection reason:');
                response = await axios.put(
                    `${api.defaults.baseURL}/crprototype/${pr.prId}/reject`,
                    { reason },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
            }
            if (response && response.data) {
                const updatedCRPrototype = response.data;
                setPr((prevState) =>
                    prevState.map((cr) =>
                        cr.prId === updatedCRPrototype.prId ? updatedCRPrototype : cr
                    )
                );
            }
            setShowModal(false);
            navigate('/dashboard/viewcr'); // Navigate after action
        } catch (error) {
            console.error('Error updating CR prototype:', error);
        }
    };

    // if (loading) {
    //     return <div>Loading...</div>; // Show loading state
    // }

    if (!pr) {
        return <div>No PR found</div>; // Show message when PR is not found
    }
    return (
        <div className="container mx-auto  h-auto mb-4">
            <h1 className="text-2xl font-bold my-4">View Prototype Details</h1>
            <div className="p-8 grid grid-cols-2 gap-4 bg-white rounded-lg shadow-md">
                <div className="col-span-1">
                    <p className="text-xl font-bold text-stone-950 mb-3 text-left">Topic: {pr.topic}</p>
                    <p className="mb-2 text-left">Change Request ID: {pr.crId}</p>

                </div>

                <div className="col-span-2 bg-gray-200 p-4 h-auto rounded-lg">
                    <p className='mb-2 text-left'> Description:
                    <div dangerouslySetInnerHTML={{ __html: pr.description }} />
                    </p>
                </div>
                <div className="text-center my-4">
                <button onClick={handleViewAttachment} className="inline-block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
                    View attachment
                </button>
                <button onClick={() => handleActionClick(pr.prId)}  className="inline-block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
                    Get Disition
                </button>
            </div>
            </div>

            {showModal && pr && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Approve CR Prototype</h2>
            <p>CR ID: {pr.crId}, PR ID: {pr.prId}</p>
            <p>{pr.topic}</p>
            <p>{pr.description}</p>
            <div className="mt-4">
              <button onClick={() => handleAction('approve')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4">
                Approved
              </button>
              <button onClick={() => handleAction('reject')} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
            
        </div>
    );
};

export default ShowProtoDetails;
