import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useParams } from 'react-router-dom';

const ShowCrDetails = () => {
    const { crId } = useParams();
    const [cr, setCr] = useState(null);
    const [loading, setLoading] = useState(true);

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
        const fileUrl = `${api.defaults.baseURL}/uploads/` + cr.filePath;
        // Open the file in a new tab
        window.open(fileUrl, '_blank');
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!cr) {
        return <div>No CR found</div>;
    }

    return (
        <div className="container mx-auto  h-auto mb-4">
            <h1 className="text-2xl font-bold my-4">View CR Details</h1>
            <div className="p-8 grid grid-cols-2 gap-4 bg-white rounded-lg shadow-md">
                <div className="col-span-1">
                    <p className="text-xl font-bold text-stone-950 mb-3 text-left">Topic: {cr.topic}</p>
                    <p className="mb-2 text-left">Change Request ID: {cr.crId}</p>
                    <p className="mb-2 text-left">SFA User {cr.name}</p>
                </div>
                <div className="col-span-1">
                    <p className="mb-2 text-xl font-bold text-yellow-400 text-left"> {cr.status}</p>
                    <p className="mb-2 text-left">Change Request Priority: {cr.priority}</p>
                    <p className="mb-2 text-left">Department: {cr.department}</p>
                </div>
                <div className="col-span-2 bg-gray-200 p-4 h-auto rounded-lg">
                    <p className='mb-2 text-left'> Description:
                    <div dangerouslySetInnerHTML={{ __html: cr.description }} />
                    </p>
                </div>
                <div className="text-center my-4">
                <button onClick={handleViewAttachment} className="inline-block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
                    View attachment
                </button>
            </div>
            </div>
            
        </div>
    );
};

export default ShowCrDetails;
