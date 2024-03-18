import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

const ShowCrDetails = ({ crId }) => {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!cr) {
        return <div>No CR found</div>;
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold my-4">View CR Details</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="mb-2"><strong>CR ID:</strong> {cr.crId}</p>
                <p className="mb-2"><strong>Name:</strong> {cr.name}</p>
                <p className="mb-2"><strong>Department:</strong> {cr.department}</p>
                <p className="mb-2"><strong>Topic:</strong> {cr.topic}</p>
                <p className="mb-2"><strong>Description:</strong> {cr.description}</p>
                <p className="mb-2"><strong>Priority:</strong> {cr.priority}</p>
                <p className="mb-2"><strong>Status:</strong> {cr.status}</p>
                <p className="mb-2"><strong>Created At:</strong> {cr.createdAt}</p>
            </div>
        </div>
    );
};

export default ShowCrDetails;
