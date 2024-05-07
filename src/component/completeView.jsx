import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';


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

    

        fetchCrDetails();
    }, [crId]);

    const handleViewAttachment = () => {
        if (cr && cr.filePath) {
            const fileUrl = `${api.defaults.baseURL}/uploads/cr/${cr.filePath}`;
            window.open(fileUrl, '_blank');
        }
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


    return (
        <div className="container mx-auto  h-auto mb- ">
            <h1 className="text-xl font-bold my-4">View CR Details</h1>
            <div className="p-8 grid grid-cols-2 gap-2 bg-white rounded-lg shadow-md4">
                <div className="col-span-2 ">
                    <p className="text-lg font-bold text-right">
                        <span className="text-black font-semibold">Change Request Status: </span>
                        {cr.status === 'Sent prototype' ? (
                            <span className="font-bold text-blue-500">{cr.status}</span>
                        ) : cr.status === 'Development Completed' ? (
                            <span className="text-green-500">{cr.status}</span>
                        ) : cr.status === 'CR Rejected' ? (
                            <span className="text-red-500">{cr.status}</span>
                        ) :cr.status === 'Need Approvel For Prototype' ? (
                            <span className="text-red-500">{cr.status}</span>
                        ) :cr.status === 'Need UAT Approvel' ? (
                            <span className="text-red-500">{cr.status}</span>
                        ) :
                         (
                            <span>{cr.status}</span>
                        )}
                    </p>

                    <p className="text-lg font-bold text-stone-950 text-left">Topic: {cr.topic}</p>
                </div>
                <div className="col-span-1">
                    <p className="font-semibold text-left">Change Request ID: <span className='font-normal'>{cr.crId}</span></p>
                    <p className="font-semibold text-left">CR Crated At: <span className='font-normal'>{formatDate(cr.createdAt)} {/* Format date */}</span> </p>

                </div>
                <div className="col-span-1">
                <p className="font-semibold text-left">SFA User: <span className='font-normal'> {cr.name} </span> </p>
                    <p className="font-semibold text-left">Department: <span className='font-normal'>{cr.department}</span></p>
                    <p className="font-semibold text-left">Developer: <span className='font-normal'>{cr.developer}</span></p>
                </div>

                <div className="col-span-2 ">
                    <p className='font-semibold text-left'> Description:</p>
                    <div className='bg-gray-200 p-4 h-auto rounded-lg text-left' dangerouslySetInnerHTML={{ __html: cr.description }} />
                </div>
                </div>
                    <button onClick={handleViewAttachment} className="inline-block text-center bg-blue-500 text-black font-medium px-2 py-2 rounded hover:bg-blue-600 mt-1">
                        View CR attachment
                    </button>
                
                </div>
    );
};

export default CompleteView;
