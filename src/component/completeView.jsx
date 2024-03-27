import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const CompleteView = () => {
    const { crId, prId } = useParams();
    const [cr, setCr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pr, setPr] = useState(null);
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
            } catch (error) {
                console.error('Error fetching CR details:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchProtoDetails = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get(`${api.defaults.baseURL}/crprototype/${prId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setPr(response.data);
            } catch (error) {
                console.error('Error fetching prototype details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCrDetails();
        fetchProtoDetails();
    }, [crId, prId]);

    const handleViewAttachment = () => {
        if (cr && cr.filePath) {
            const fileUrl = `${api.defaults.baseURL}/uploads/cr/${cr.filePath}`;
            window.open(fileUrl, '_blank');
        }
    };

    const handleProtoViewAttachment = () => {
        if (pr && pr.filePath) {
            const fileUrl = `${api.defaults.baseURL}/uploads/prototype/${pr.filePath}`;
            window.open(fileUrl, '_blank');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!cr) {
        return <div>No CR found</div>;
    }


    return (
        <div className="container mx-auto  h-auto mb- ">
            <h1 className="text-2xl font-bold my-4">View CR Details</h1>
            <div className="p-8 grid grid-cols-2 gap-4 bg-white rounded-lg shadow-md4">
                <div className="col-span-2 ">
                    <p className="mb-2 text-xl font-bold text-right">
                        <span className="text-black">Status: </span>
                        {cr.status === 'Pending' ? (
                            <span className="text-red-500">{cr.status}</span>
                        ) : cr.status === 'Start Development' ? (
                            <span className="text-green-500">{cr.status}</span>
                        ) : (
                            <span>{cr.status}</span>
                        )}
                    </p>

                    <p className="text-xl font-bold text-stone-950 mb-2 text-left">Topic: {cr.topic}</p>
                </div>
                <div className="col-span-1">
                    <p className="mb-2 text-left">Change Request ID: {cr.crId}</p>
                    <p className="mb-2 text-left">SFA User:  {cr.name}</p>
                    
                </div>
                <div className="col-span-1">


                    <p className="mb-2 text-left">Department: {cr.department}</p>
                </div>
                
                <div className="col-span-2 ">
                    <p className='mb-2 text-left'> Description:</p>
                    <div className='bg-gray-200 p-4 h-auto rounded-lg text-left' dangerouslySetInnerHTML={{ __html: cr.description }} />
                </div>
                <div className="text-center my-4">
                    <button onClick={handleViewAttachment} className="inline-block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
                        View CR attachment
                    </button>
                    <button
  onClick={handleProtoViewAttachment}
  className="inline-block bg-yellow-400 hover:bg-yellow-500 font-bold text-black px-4 py-2 rounded mt-4 mr-2"
>
  View Prototype Attachment
</button>

                </div>
            </div>

        </div>
    );
};

export default CompleteView;
