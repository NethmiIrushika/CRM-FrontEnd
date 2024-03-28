import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getLoginInfo } from "../utils/LoginInfo";
import StatusPopupcr from '../popup/statuspopupcr';


const ShowCrDetails = () => {
  const { crId } = useParams();
  const [cr, setCr] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [crs, setCrs] = useState([]);
  const userType = getLoginInfo()?.userType;
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  useEffect(() => {
    const fetchCrDetails = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${api.defaults.baseURL}/crs/${crId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCr(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching CR details:", error);
        setLoading(false);
      }
    };

    fetchCrDetails();
  }, [crId]);

  const handleViewAttachment = () => {
    // Construct the URL to fetch the file
    const fileUrl = `${api.defaults.baseURL}/uploads/cr/` + cr.filePath;
    // Open the file in a new tab
    window.open(fileUrl, "_blank");
  };

  const fetchCrs = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${api.defaults.baseURL}/crs`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Filter CRs with status "start-development"
      const filteredCrs = response.data.filter(
        (cr) =>
          cr.status !== "Starting Development" &&
          cr.status !== "Sent prototype" &&
          cr.status !== "Completed"
      );
      setCrs(filteredCrs);
    } catch (error) {
      console.error("Error fetching crs:", error);
    }
  };

  const handleButtonClick = async (crId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId"); // Retrieve the userId from localStorage

      // Log the userId before making the API call
      console.log(userId);

      await axios.put(
        `${api.defaults.baseURL}/crs/${crId}/start-development`,
        { userId }, // Include userId in the request payload
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Refresh the CRs after updating the status
      fetchCrs();

      toast.success("CR is now in development!");
      navigate(`/dashboard/devShowCrDetails/${crId}/`);
    } catch (error) {
      console.error("Error starting development:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cr) {
    return <div>No CR found</div>;
  }


  const updateCr = async (updatedCr) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(`${api.defaults.baseURL}/crs/${updatedCr.crId}`, {
        hodApprovel: updatedCr.hodApprovel
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCr(response.data);
      if (updatedCr.hodApprovel === 'approved') {
        toast.success(` ${updatedCr.firstname}  ${updatedCr.hodApprovel}`, {
          className: 'toast-success',
        });
      } else if (updatedCr.hodApprovel === 'rejected') {
        toast.error(` ${updatedCr.firstname}  ${updatedCr.hodApprovel}`, {
          className: 'toast-error',
        });
      } else {
        toast.success(` ${updatedCr.firstname} ${updatedCr.hodApprovel}`);
      }
    } catch (error) {
      console.error('Error updating CR:', error);
    }
  };


  return (



    <div className="container mx-auto  h-auto  ">

      {showStatusPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <StatusPopupcr
            cr={cr} // Pass the cr object here
            close={() => setShowStatusPopup(false)}
            updateUser={updateCr}
          />
        </div>
      )}
      <h1 className="text-xl font-bold my-4">View CR Details</h1>
      <div className="p-8 grid grid-cols-2 gap-2 bg-white rounded-lg shadow-md4">
        <div className="col-span-2 ">
          <p className=" text-lg font-bold text-right">
            <span className="text-black font-semibold">
              Change Request Status:{" "}
            </span>
            {cr.status === "Pending" ? (
              <span className="text-red-500 font-bold">{cr.status}</span>
            ) : cr.status === "Start Development" ? (
              <span className="text-green-500 font-bold">{cr.status}</span>
            ) : (
              <span>{cr.status}</span>
            )}
          </p>

          <p className="text-lg font-bold text-stone-950 text-left">
            Topic: {cr.topic}
          </p>
        </div>
        <div className="col-span-1">
          <p className="font-semibold text-left">
            Change Request ID: {cr.crId}
          </p>
          <p className="font-semibold text-left">SFA User: {cr.name}</p>
        </div>
        <div className="col-span-1">
          <p className="font-semibold text-left">
            Change Request Priority: {cr.priority}
          </p>
          <p className="font-semibold text-left">Department: {cr.department}</p>
        </div>

        <div className="col-span-2 ">
          <p className="font-semibold text-left"> Description:</p>
          <div
            className="bg-gray-200 p-4 h-auto rounded-lg text-left"
            dangerouslySetInnerHTML={{ __html: cr.description }}
          />
        </div>
        <div className="text-center my-4">
          <button
            onClick={handleViewAttachment}
            className="inline-block text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-1"
          >
            View Attachment
          </button>

          {userType === 'Developer' && cr.priority === '1' &&
            <button
              onClick={() => handleButtonClick(crId)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4 ml-2" // Added ml-2 for left margin
            >
              Get To Development
            </button>
          }

          {userType === 'HOD' &&
            <button
              onClick={() => setShowStatusPopup(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4 ml-2" // Added ml-2 for left margin
            >
              Approve
            </button>
          }
        </div>

      </div>
    </div>
  );
};

export default ShowCrDetails;
