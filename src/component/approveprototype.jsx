import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import { getLoginInfo } from "../utils/LoginInfo";
import { format } from "date-fns"; // Import format function from date-fns

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

  const filteredCrPrototypes = crprototype.filter((pr) => {
    return (
      pr &&
      pr.cr &&
      pr.cr.userId &&
      pr.cr.userId.userId === getLoginInfo()?.sub &&
      pr.popupstatus !== "Rejected" &&
      pr.popupstatus !== "Approved" &&
      pr.rejectionReason !== "" &&
      pr.cr.status !== "Completed" &&
      pr.cr.status !== "Develop without Prototype"&&
      pr.cr.status !== "Need UAT Approvel"&&
      pr.cr.status !== "Development Completed"
    );
  });

  useEffect(() => {
    fetchCrprototype();
  }, []);

  const handleActionClick = (prId) => {
    console.log("cr Id:", prId);
    navigate(`/dashboard/showprotoDetails/${prId}`);
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss'); // Format date using date-fns
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

      {filteredCrPrototypes.length === 0?(
        <div className="flex justify-center items-center h-full mt-4">
          <p className="text-xl text-black-500 mt-10">There are not any prototype to approve!!</p>
        </div>
      ):(
        <div className="grid grid-cols-1 gap-4">
        {filteredCrPrototypes.map((pr) => (
          <div key={pr.prId} className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <p className="text-lg font-bold text-right">
                  <span className="text-black-400">Status: </span>
                  <span
                    className={`${
                      pr.cr.status === "Sent prototype"
                        ? "text-blue-500"
                        : pr.cr.status === "Pending"
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {pr.cr.status}
                  </span>
                </p>

                <p className="text-lg font-bold text-stone-950 text-left">
                  Topic: {pr.topic}
                </p>
              </div>
              <div className="col-span-2">
                {pr.cr.createdAt && (
                  <p className="text-center">
                    The Change Request with ID:{" "}
                    <span className="font-semibold text-lg">{pr.crId}</span>{" "}
                    you created at :{" "}
                    <span className="font-semibold">
                      {formatDate(pr.cr.createdAt)} {/* Format date */}
                    </span>{" "}
                    now has a Prototype. Plese make sure to View the prototype
                    and give your feed backs
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleActionClick(pr.prId)}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
            >
              View
            </button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default Approveprototype;
