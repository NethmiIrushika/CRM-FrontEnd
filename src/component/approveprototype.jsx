import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import { getLoginInfo } from "../utils/LoginInfo";

const loguserId = getLoginInfo()?.sub;

function Approveprototype() {
  const [crprototype, setCrprototype] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigate = useNavigate();

  const fetchCrprototype = async () => {
    try {
      const userId1 = localStorage.getItem("userId");
      setLoggedInUserId(userId1);
      console.log(userId1);

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

  // const filteredCrPrototypes = crprototype.filter((pr) => {
  //   if (pr && pr.topic) {
  //     return (
  //       pr.cr.userId && pr.cr.userId.userId === userId && pr.topic.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //       (pr.popupstatus === null || pr.popupstatus === undefined ||
  //         pr.popupstatus.trim() === "")
  //     );
  //   }
  //   return false;
  // });

  const filteredCrPrototypes = crprototype.filter(pr => {
    if (pr && pr.topic) {
      return pr.topic.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  useEffect(() => {
    fetchCrprototype();
  }, []);

  const handleActionClick = (prId) => {
    console.log("cr Id:", prId);
    navigate(`/dashboard/showprotoDetails/${prId}`);
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

      <div className="grid grid-cols-1 gap-4">
        {filteredCrPrototypes.map((pr) => (
          <div key={pr.prId} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Topic: {pr.topic}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-left">CR ID: {pr.crId}</p>
                {pr.cr.userId && (
                  <p className="mb-2 text-left">
                    UserId: {pr.cr.userId.userId}
                  </p>
                )}
              </div>
              <div>
                <p className="mb-2 text-lg text-black-400 text-left">
                  Status: {pr.cr.status}
                </p>
                {pr.cr && <p className="mb-2 text-left">name: {pr.cr.name}</p>}
              </div>
            </div>
            <div className="bg-gray-200 p-4 mt-4 rounded-lg">
              <p className="text-gray-600 mb-2 text-center">Description:</p>
              <div>{pr.description}</div>
            </div>
            <button
              onClick={() => handleActionClick(pr.prId)}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Approveprototype;
