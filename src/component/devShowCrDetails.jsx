import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useParams, useNavigate } from "react-router-dom";
import { format } from 'date-fns';


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
        window.open(fileUrl, '_blank');
    }

    const handleButtonClickskip = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.put(
                `${api.defaults.baseURL}/crs/${crId}/status`,
                { status: 'Develop without Prototype' },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const userId = localStorage.getItem('userId');
            const popupstatus = "Develop without Prototype";
            await axios.post(
                `${api.defaults.baseURL}/crprototype`,
                { crId, userId, popupstatus }, // Send the crId and userId in the request body
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
        navigate(`/dashboard/crProtoType/${crId}`, { state: { topic: topic } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!cr) {
        return <div>No CR found</div>;
    }

    const formatDate = (date) => {
        return format(new Date(date), 'dd/MM/yyyy HH:mm:ss'); 
      };

    const formatDate1 = (date) => {
    return format(new Date(date), 'dd/MM/yyyy'); 
      };

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
                    <p className="font-semibold text-left">Change Request ID: <span className='font-normal'>{cr.crId}</span></p>
                    <p className='font-semibold text-left mt-2'> Change Request Type: <span className='font-normal'>{cr.crtype}</span></p>
                    <p className="font-semibold text-left mt-2">Required Date: <span className='font-normal'>{formatDate1(cr.requiredDate)} {/* Format date */}</span></p>
                </div>
                <div className="col-span-1">
                    <p className="font-semibold text-left">SFA User: <span className='font-normal'>{cr.name}</span></p>
                    <p className="font-semibold text-left mt-2">Created At: <span className='font-normal'>{formatDate(cr.createdAt)} {/* Format date */}</span></p>
                    <p className="font-semibold text-left mt-2">Developer Name: <span className='font-normal'>{cr.developer}</span></p>
                    

                </div>
                <div className="col-span-2 ">
                    <p className='font-semibold text-left'> Description:</p>
                    <div className='bg-white-100 border border-yellow-100 p-4 h-auto rounded-lg text-left' dangerouslySetInnerHTML={{ __html: cr.description }} />

                </div>
                <div className=" my-4 col-span-2">
                    <button
                        onClick={handleViewAttachment}
                        className="w-48 inline-block text-center font-medium border border-yellow-100 bg-yellow-400 hover:bg-yellow-600 text-black px-4 py-2 rounded mt-1"
                    >
                        View Attachment
                    </button>
                    <button
                        onClick={() => handleButtonClick(cr.crId, cr.topic)}
                        className="bg-lime-500 w-48 hover:bg-lime-600 font-medium text-black py-2 px-4 rounded mt-4 ml-2 ease-in-out"
                    >
                        Sent Prototype
                    </button>
                    <button
                        onClick={() => handleButtonClickskip(cr.crId, cr.topic)}
                        className=" bg-blue-500 hover:bg-blue-700 text-black  font-medium py-2 px-4 rounded ml-2 transition-colors duration-300 ease-in-out"
                    >
                        Develop without Prototype
                    </button>
                </div>



            </div>

        </div>
    );
};

export default DevShowCrDetails;
