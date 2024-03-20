import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useParams } from 'react-router-dom';

const ShowCrDetails = () => {
    const {crId} = useParams(); 
    console.log('crId:', crId);
    const [cr, setCr] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCrDetails = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                console.log('Access Token:', accessToken);
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
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold my-4">View CR Details</h1>
            <div className="bg-white rounded-lg shadow-md p-8">
                <p className="mb-2"><strong>CR ID:</strong> {cr.crId}</p>
                <p className="mb-2"><strong>Name:</strong> {cr.name}</p>
                <p className="mb-2"><strong>Department:</strong> {cr.department}</p>
                <p className="mb-2"><strong>Topic:</strong> {cr.topic}</p>
                <div className="mb-2"><strong>Description:</strong> <div dangerouslySetInnerHTML={{ __html: cr.description }} /></div>
                <p className="mb-2"><strong>Priority:</strong> {cr.priority}</p>
                <p className="mb-2"><strong>Status:</strong> {cr.status}</p>
                <p className="mb-2"><strong>Created At:</strong> {cr.createdAt}</p>

                <button onClick={handleViewAttachment} className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
                    View attachment
                </button>
            </div>
        </div>
    );
};

export default ShowCrDetails;
