import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { useNavigate } from "react-router-dom";

function ApproveORreject() {
  const [crprototype, setCrprototype] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigate = useNavigate();

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

  const filterNewestPrototypes = (prototypes) => {
    const map = new Map();
    prototypes.forEach((pr) => {
      const crId = pr.crId;
      if (!map.has(crId) || new Date(pr.createdAt) > new Date(map.get(crId).cr.createdAt)) {
        map.set(crId, pr);
      }
    });
    return Array.from(map.values());
  };

  useEffect(() => {
    fetchCrprototype();
  }, []); // Empty dependency array ensures this useEffect runs only once

  // useEffect(() => {
  //   if (crprototype.length > 0) {
  //     const newestPrototypes = filterNewestPrototypes(crprototype);
  //     setCrprototype(newestPrototypes);
  //   }
  // }, [crprototype]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCrPrototypes = crprototype.filter((pr) => {
    if (pr && pr.popupstatus) {
      return (
        (pr.cr.status === "Develop without Prototype" ||
        pr.cr.status === "Prototype Approved" ||
        pr.cr.status === "Need Approvel For Prototype" ||
        pr.cr.status === "Need Approvel For Second Prototype") &&
        (pr.popupstatus.toLowerCase() === "rejected" ||
        (pr.cr.crId && pr.cr.crId.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pr.cr.topic && pr.cr.topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pr.cr.developer && pr.cr.developer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pr.cr.name && pr.cr.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pr.cr.status && pr.cr.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pr.popupstatus && pr.popupstatus.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pr.rejectionReason && pr.rejectionReason.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    return false;
  });

  const handleChangeStatusButtonClick = async (prId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${api.defaults.baseURL}/crprototype/${prId}/uatapprovel`,
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
          prevState.map((cr) => (cr.prId === updatedCRPrototype.prId ? updatedCRPrototype : cr))
        );
      }
      navigate(`/dashboard/viewCr`);
    } catch (error) {
      console.error("Error UAT approvel", error);
    }
  };

  const handleButtonClick = (crId, topic) => {
    navigate(`/dashboard/otherPr/${crId}`, { state: { topic: topic } });
  };

  const handleActionClick = (crId) => {
    console.log('cr Id:', crId);
    navigate(`/dashboard/completeView/${crId}/`);
  };

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

      {filteredCrPrototypes.length === 0 ? (
        <div className="flex justify-center items-center h-full mt-4">
          <p className="text-xl text-black-500 mt-10">There are not any prototype to approve!!</p>
        </div>
      ) : (
        <div className="mt-4 container mx-auto  h-auto">
          {filteredCrPrototypes.map((pr) => (
            <div className="bg-white rounded shadow p-4 mb-6" key={pr.prId}>
              <div className="p-8 grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <p className="text-lg font-semibold text-right">
                    Prototype Status:{" "}
                    <span
                      className={`font-bold ${
                        pr.popupstatus === 'Rejected'
                          ? 'text-red-500'
                          : pr.popupstatus === 'Pending'
                          ? 'text-yellow-400'
                          : pr.popupstatus === 'Approved'
                          ? 'text-green-500'
                          : 'text-black'
                      }`}
                    >
                      {pr.popupstatus}
                    </span>
                  </p>
                  <p className="text-lg font-bold text-stone-950 text-left">Topic: {pr.topic}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-left font-semibold">
                    CR ID : <span className="font-normal">{pr.crId}</span>
                  </p>
                  {pr.cr.createdAt && (
                    <p className="text-left font-semibold">
                      CR Created At : <span className="font-normal">{pr.cr.createdAt}</span>
                    </p>
                  )}
                  {pr.cr && <p className="text-left font-semibold">Developer : <span className="font-normal">{pr.cr.developer}</span></p>}
                </div>
                <div className="col-span-1">
                  {pr.cr && <p className="text-left font-semibold">SFA User : <span className="font-normal">{pr.cr.name}</span></p>}
                  {pr.cr && <p className="text-left font-semibold">CR Status : <span className="font-normal">{pr.cr.status}</span></p>}

                  {pr.createdAt && (
                    <p className="text-left font-semibold">
                      Prototype Created At : <span className="font-normal">{pr.createdAt}</span>
                    </p>
                  )}
                </div>

                {pr.rejectionReason && (
                  <div className="col-span-2">
                    <p className="text-left font-semibold">Rejected Reason:</p>
                    <p className="text-gray-600 text-left bg-gray-200 p-4 h-auto rounded-lg font-normal">
                      {pr.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleActionClick(pr.crId)}
                className="mt-1 bg-yellow-400 hover:bg-yellow-500 font-medium text-black py-2 px-2 rounded"
              >
                View Details
              </button>

              {pr.rejectionReason && (
                <button
                  onClick={() => handleButtonClick(pr.crId, pr.topic)}
                  className="bg-blue-400 hover:bg-blue-500 text-black font-medium py-2 px-2 rounded ml-2 transition-colors duration-300 ease-in-out"
                >
                  Sent another Prototype
                </button>
              )}
              {pr.rejectionReason === null && pr.popupstatus === 'Approved' && (
                <button
                  onClick={() => handleChangeStatusButtonClick(pr.prId)}
                  className="mt-1 bg-lime-500 hover:bg-lime-600 text-black font-medium py-2 ml-2 px-2 rounded"
                >
                  For UAT Approvel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApproveORreject;
