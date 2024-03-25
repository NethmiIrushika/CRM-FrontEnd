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
  
      <div className="mt-4">
        {filteredCrPrototypes.map((pr) => (
          <div key={pr.prId} className="bg-white rounded shadow-md p-6 mb-4">
            <h2 className="text-xl font-semibold mb-2">
              CR ID: {pr.crId}
            </h2>
            <h3 className="text-lg font-semibold mb-2">{pr.topic}</h3>
  
            <p className="text-gray-600 mb-2">
              <strong>Prototype Status:</strong> {pr.popupstatus}
            </p>
            {pr.rejectionReason && (
              <p className="text-gray-600 mb-2">
                <strong>Rejected Reason:</strong> {pr.rejectionReason}
              </p>
            )}
            {pr.cr && (
              <p className="text-gray-600 mb-2">
                <strong>User ID:</strong> {pr.cr.userId.userId}
              </p>
            )}
            {pr.cr && (
              <p className="text-gray-600 mb-2">
                <strong>Name:</strong> {pr.cr.name}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleViewButtonClick(pr.prId)}
                className="bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                View CR
              </button>
              <button
                onClick={() => handleViewButtonClick(pr.prId)}
                className="bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                View Prototype
              </button>
              {pr.rejectionReason && (
                <button
                  onClick={() => handleButtonClick(pr.crId)}
                  className="bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Send Prototype
                </button>
              )}
              {!pr.rejectionReason && (
                <button
                  onClick={() => handleChangeStatusButtonClick(pr.prId)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Complete Task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default ApproveORreject;
