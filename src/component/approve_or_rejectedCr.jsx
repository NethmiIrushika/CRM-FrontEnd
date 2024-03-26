import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

function ApproveORreject() {
  const [crprototype, setCrprototype] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCR, setSelectedCR] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigate = useNavigate();

  const handleViewButtonClick = async (prId) => {
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
      setSelectedCR(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching CR prototype:", error);
    }
  };

  const handleAction = async (action) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      let response;
      if (action === "approve") {
        response = await axios.put(
          `${api.defaults.baseURL}/crprototype/${selectedCR.prId}/approve`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else if (action === "reject") {
        const reason = prompt("Enter rejection reason:");
        response = await axios.put(
          `${api.defaults.baseURL}/crprototype/${selectedCR.prId}/reject`,
          { reason },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
      if (response && response.data) {
        const updatedCRPrototype = response.data;
        setCrprototype((prevState) =>
          prevState.map((cr) =>
            cr.prId === updatedCRPrototype.prId ? updatedCRPrototype : cr
          )
        );
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error updating CR prototype:", error);
    }
  };

  const fetchCrprototype = async () => {
    try {
      const userId = localStorage.getItem("userId");
      setLoggedInUserId(userId);

      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${api.defaults.baseURL}/crprototype`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCrprototype(response.data);
    } catch (error) {
      console.error("Error fetching CR prototypes:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCrPrototypes = crprototype.filter((pr) => {
    if (pr && pr.popupstatus) {
      return (
        pr.popupstatus.toLowerCase() === "approved" ||
        pr.popupstatus.toLowerCase() === "rejected"
      );
    }
    return false;
  });

  const handleChangeStatusButtonClick = async (prId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${api.defaults.baseURL}/crprototype/${prId}/completeTask`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response && response.data) {
        const updatedCRPrototype = response.data;
        setCrprototype((prevState) =>
          prevState.map((cr) =>
            cr.prId === updatedCRPrototype.prId ? updatedCRPrototype : cr
          )
        );
      }
      navigate(`/dashboard/completedCR`);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleButtonClick = (crId) => {
    console.log("CR ID:", crId);
    navigate(`/dashboard/crProtoType/${crId}`);
  };

  useEffect(() => {
    fetchCrprototype();
  }, []);

  return (
    <div className="container mx-auto full">
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="px-4 py-2 border border-gray-500 rounded"
        />
      </div>

      <div className="mt-4 container mx-auto  h-auto">
        {filteredCrPrototypes.map((pr) => (
          <div key={pr.prId} className="bg-white rounded shadow p-4 mb-4">
            <h2 className="text-lg font-semibold text-center">{pr.topic}</h2>
            <div className="p-8 grid grid-cols-2 gap-4 ">
              <div className='col-span-1'>
                <p className="mb-2 text-left">
                  CR ID: {pr.crId}
                </p>
                {pr.cr.userId && (
                  <p className="mb-2 text-left"> UserId: {pr.cr.userId.userId} </p>
                )}
              </div>
              <div className='col-span-1'>
              <p className="mb-2 text-left">Prototype Status: <span className={`font-bold ${pr.popupstatus === 'Rejected' ? 'text-red-500' : pr.popupstatus === 'Approved' ? 'text-green-500' : 'text-black'}`}>{pr.popupstatus}</span></p>
                {pr.rejectionReason && (<p className="mb-2 text-left">Rejected reason: {pr.rejectionReason} </p>)}
                {pr.cr && (<p className="mb-2 text-left"> name: {pr.cr.name} </p>)}
              </div>
              <div className="col-span-2 bg-gray-200 p-4 h-auto rounded-lg">
                <p className="text-gray-600 mb-2 text-left">{pr.description}</p>
              </div>
            </div>


            <button
              onClick={() => handleViewButtonClick(pr.prId)}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Deatails
            </button>
 
            {pr.rejectionReason && (
              <button
                onClick={() => handleButtonClick(pr.crId)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 transition-colors duration-300 ease-in-out"
              >
                Sent Prototype
              </button>
            )}
            {pr.rejectionReason == null && (
              <button
                onClick={() => handleChangeStatusButtonClick(pr.prId)}
                className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Complete Task
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default ApproveORreject;
