import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useParams, useNavigate } from "react-router-dom";

const DevShowCrDetails = () => {
    const { crId } = useParams();
    const [cr, setCr] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCrDetails = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get(`${api.defaults.baseURL}/crs/${crId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setCr(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching CR details:', error);
                setLoading(false);
            }
        };

        fetchCrDetails();
    }, [crId]);

    const handleViewAttachment = () => {
        // Construct the URL to fetch the file
        const fileUrl = `${api.defaults.baseURL}/uploads/cr/` + cr.filePath;
        // Open the file in a new tab
        window.open(fileUrl, '_blank');
    }

    const handleButtonClickskip = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            
            // Send a PUT request to update the status
            await axios.put(
                `${api.defaults.baseURL}/crs/${crId}/status`,
                { status: 'Develop without Prototype' },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
    
            // Create CR prototype
            const userId = localStorage.getItem('userId'); // assuming userId is stored in localStorage
            const popupstatus = "Develop without Prototype";
            await axios.post(
                `${api.defaults.baseURL}/crprototype`,
                { crId, userId, popupstatus  }, // Send the crId and userId in the request body
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
    
            navigate(`/dashboard/approveORreject`); // Redirect to the dashboard
        } catch (error) {
            console.error('Error updating CR status or creating CR prototype:', error);
        }
    };
    

    const handleButtonClick = (crId, topic) => {
        console.log("CR ID:", crId);
        console.log('Topic:', topic)
        navigate(`/dashboard/crProtoType/${crId}`,{ state: { topic: topic } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!cr) {
        return <div>No CR found</div>;
    }

    return (
        <div className="container mx-auto  h-auto mb-4">
            <h1 className="text-xl font-bold my-4">View CR Details</h1>
            <div className="p-8 grid grid-cols-2 gap-2 bg-white rounded-lg shadow-md">
                <div className='col-span-2'>
                    <p className=" text-lg font-bold text-right">
                        <span className="text-black font-semibold">Status: </span>
                        {cr.status === 'Pending to get development' ? (
                            <span className="text-red-500 font-bold">{cr.status}</span>
                        ) : cr.status === 'Taken For Development' ? (
                            <span className="text-blue-700 font-bold">{cr.status}</span>
                        ) : (
                            <span>{cr.status}</span>
                        )}
                    </p>
                    <p className="text-lg font-bold text-stone-950 text-left">Topic: {cr.topic}</p>
                </div>
                <div className="col-span-1">
                    <p className="font-semibold text-left">Change Request ID: {cr.crId}</p>
                    <p className='font-semibold text-left'> Created At: {cr.createdAt}</p>
                </div>
                <div className="col-span-1">
                    <p className="font-semibold text-left">SFA User: {cr.name}</p>
                    <p className="font-semibold text-left">Department: {cr.department}</p>
                </div>
                <div className="col-span-2 ">
                    <p className='font-semibold text-left'> Description:</p>
                    <div className='bg-gray-200 p-4 h-auto rounded-lg' dangerouslySetInnerHTML={{ __html: cr.description }} />

                </div>
  <div className="flex justify-center my-4">
  <button
    onClick={handleViewAttachment}
    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300 ease-in-out"
  >
    View Attachment
  </button>
  <button
    onClick={() => handleButtonClick(cr.crId, cr.topic)}
    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-2 transition-colors duration-300 ease-in-out"
  >
    Sent Prototype
  </button>
  <button
    onClick={() => handleButtonClickskip(cr.crId, cr.topic)}
    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-2 transition-colors duration-300 ease-in-out"
  >
    Develop without Prototype
  </button>
</div>



            </div>

        </div>
    );
};

export default DevShowCrDetails;
