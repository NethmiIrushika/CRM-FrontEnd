import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getLoginInfo } from "../utils/LoginInfo";
import StatusPopupcr from "../popup/statuspopupcr";
import { format } from 'date-fns';

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
      const userId = localStorage.getItem("userId"); 
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
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${api.defaults.baseURL}/crs/${updatedCr.crId}`,
        {
          hodApprovel: updatedCr.hodApprovel,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCrs(response.data);
      if (updatedCr.hodApprovel === "approved") {
        toast.success(`CR Id ${updatedCr.crId}  is  ${updatedCr.hodApprovel}`, {
          className: "toast-success",
        });
      } else if (updatedCr.hodApprovel === "rejected") {
        toast.error(`CR Id ${updatedCr.crId} is  ${updatedCr.hodApprovel}`, {
          className: "toast-error",
        });
      } else {
        toast.success(`${updatedCr.crId} Pending HOD Approval`);
      }
      navigate("/dashboard/ongoingApprovelCr");
    } catch (error) {
      console.error("Error updating CR:", error);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss'); 
  };

const formatDate1 = (date) => {
return format(new Date(date), 'dd/MM/yyyy'); 
  };

  return (
    <div className="container mx-auto  h-auto  ">
      {showStatusPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <StatusPopupcr
            cr={cr} 
            close={() => setShowStatusPopup(false)}
            update={updateCr}
          />
        </div>
      )}
      {/* <h1 className="text-xl font-bold my-4">View CR Details</h1> */}
      <div className="p-8 grid grid-cols-2 gap-2 bg-white rounded-lg shadow-md4">
        <div className="col-span-2 ">
          <p className=" text-lg font-bold text-right">
            <span className="text-black font-semibold">
              Change Request Status:{" "}
            </span>
            {cr.status === "Need CR Approvel" ? (
              <span className="text-red-500 font-bold">{cr.status}</span>
            ) : cr.status === "Pending to get development" ? (
              <span className="text-green-600 font-bold">{cr.status}</span>
            ) : (
              <span>{cr.status}</span>
            )}
          </p>

          <p className="text-lg font-bold text-stone-950 text-left">
            Topic: {cr.topic}
          </p>
        </div>
        <div className="col-span-1">
          <p className="font-semibold text-left ">
            Department: <span className="font-normal">{cr.department}</span>
          </p>
          <p className="font-semibold text-left mt-2">
            {" "}
            Change Request ID: <span className="font-normal">
              {cr.crId}
            </span>{" "}
          </p>
          <p className="font-semibold text-left mt-2">
            SFA User: <span className="font-normal">{cr.name}</span>{" "}
          </p>
          <p className="font-semibold text-left mt-2">
            Required Date:{" "}
            <span className="font-normal">{formatDate1(cr.requiredDate)} {/* Format date */}</span>{" "}
          </p>
        </div>
        <div className="col-span-1">
          {cr.status === "Pending to get development" && (
            <p className="font-semibold text-left">
              Change Request Priority:{" "}
              <span className="font-normal">{cr.priority}</span>
            </p>
          )}
          <p className="font-semibold text-left mt-2">
            Change Request Type:{" "}
            <span className="font-normal">{cr.crtype}</span>
          </p>
          <p className="font-semibold text-left mt-2">
            Change Request Created At:{" "}
            <span className="font-normal">{formatDate(cr.createdAt)} {/* Format date */}</span>
          </p>
        </div>

        <div className="col-span-2 ">
          <p className="font-semibold text-left"> Description:</p>
          <div
            className="bg-white-100 border border-yellow-100 p-4 h-auto rounded-lg text-left "
            dangerouslySetInnerHTML={{ __html: cr.description }}
          />
        </div>
        <div className="text-center my-4">
          <button
            onClick={handleViewAttachment}
            className=" w-48 inline-block text-center font-medium border border-yellow-100 bg-yellow-400 hover:bg-yellow-600 text-black px-4 py-2 rounded mt-1"
          >
            View Attachment
          </button>

          {userType === "Developer" && cr.priority === 1 && (
            <button
              onClick={() => handleButtonClick(crId)}
              className="bg-lime-500 w-48 hover:bg-lime-600 font-medium text-black py-2 px-4 rounded mt-4 ml-2" // Added ml-2 for left margin
            >
              Get To Development
            </button>
          )}

          {userType === "HOD" && cr.hodApprovel !== "approved" && (
            <button
              onClick={() => setShowStatusPopup(true)}
              className="bg-lime-500 w-48 hover:bg-lime-600 text-black font-medium py-2 px-4 rounded mt-4 ml-2" // Added ml-2 for left margin
            >
              Get Decision
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowCrDetails;
