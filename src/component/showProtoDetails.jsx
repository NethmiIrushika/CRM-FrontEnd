import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RejectReasonPopup from "../popup/rejectreasonpopup";
import { format } from 'date-fns';

const ShowProtoDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const { prId } = useParams();
  const [pr, setPr] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCrDetails = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${api.defaults.baseURL}/crprototype/${prId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPr(response.data);
      } catch (error) {
        console.error("Error fetching CR details:", error);
      }
    };

    fetchCrDetails();
  }, [prId]);

  const handleActionClick = async (prId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${api.defaults.baseURL}/crprototype/${prId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPr(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching CR prototype:", error);
    }
  };

  const handleViewAttachment = () => {
    const fileUrl = `${api.defaults.baseURL}/uploads/prototype/${pr.filePath}`;
    window.open(fileUrl, "_blank");
  };

  const handleAction = async (action) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      let response;
      if (action === "approve") {
        response = await axios.put(
          `${api.defaults.baseURL}/crprototype/${pr.prId}/approve`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast.success("You approved the prototype")
      } else if (action === "reject") {
        setShowRejectPopup(true)
        if(reason.trim()!==''){
          response = await axios.put(
            `${api.defaults.baseURL}/crprototype/${pr.prId}/reject`,
            { reason },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          toast.error('You reject the prototype')
        }
        
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
      navigate("/dashboard/approveprototype");
    } catch (error) {
      console.error("Error updating CR prototype:", error);
    }
  };


  if (!pr) {
    return <div>No PR found</div>;
  }

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss'); 
  };
  const formatDate1 = (date) => {
    return format(new Date(date), 'dd/MM/yyyy'); 
  };


  
  return (
    <div className="container mx-auto h-auto mb-4">
      <h1 className="text-xl font-bold my-4">View Prototype Details</h1>
      <div className="p-8 grid grid-cols-2 gap-2 bg-white rounded-lg shadow-md">
        <div className="col-span-2 ">
          <p className="text-lg font-bold text-stone-950 text-right">Prototype Status: <span className="font-bold text-red-500"> Pending Decision</span></p>
          <p className="text-lg font-bold text-stone-950 text-left">
            Topic: {pr.topic}
          </p>
        </div>
        <div className="col-span-1">
          <p className="font-semibold text-left">Change Request ID: <span className='font-normal'>{pr.crId}</span> </p>
          <p className="font-semibold text-left">Prototype Created At: <span className='font-normal'>{formatDate(pr.createdAt)} {/* Format date */} </span></p>
      
          {/* <p className="font-semibold text-left">Developer Name: <span className='font-normal'>{pr.cr.developer}</span></p> */}
        </div>
        <div className="col-span-1"><br></br>
        <p className="font-semibold text-left">Estimated Delivery Date: <span className='font-normal'>{formatDate1(pr.estimatedDate)} {/* Format date */}</span> </p>

        </div>
        <div className="col-span-2 ">
          <p className="font-semibold text-left"> Description:</p>
            <div className="bg-gray-200 p-4 h-auto rounded-lg text-left" dangerouslySetInnerHTML={{ __html: pr.description }} />
          
        </div>
        <div className="text-center my-4">
          <button
            onClick={handleViewAttachment}
            className="inline-block bg-yellow-400 hover:bg-yellow-500 font-medium  text-black px-4 py-2 rounded mt-4 mr-2"
          >
            View Attachment
          </button>
          <button
            onClick={() => handleActionClick(pr.prId)}
            className="inline-block bg-lime-500 hover:bg-lime-600 font-medium text-black px-4 py-2 rounded mt-4"
          >
            Get Decision
          </button>


        </div>
      </div>

      {showModal && pr && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-center">Decision For Prototype</h2>

              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>


            <div className="mt-4">
              <button
                onClick={() => handleAction("approve")}
                className="w-28 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction("reject")}
                className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

{showRejectPopup && (
  <RejectReasonPopup
    prId={pr.prId}
    onReject={(reason) => {
      // Handle reject action with reason
      console.log("Reject Reason:", reason);
      setShowRejectPopup(false);
    }}
    onCancel={() => setShowRejectPopup(false) && setShowModal(false)}
  />
)}
    </div>
  );

};

export default ShowProtoDetails;
