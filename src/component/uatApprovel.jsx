import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import { getLoginInfo } from "../utils/LoginInfo";
import { format } from "date-fns"; 
import { toast } from "react-toastify";

function UatApprove() {
  const [crprototype, setCrprototype] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userType = getLoginInfo()?.userType;
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigate = useNavigate();
  const name = getLoginInfo()?.firstname;

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

  useEffect(() => {
    fetchCrprototype();
  }, []);

  const handleActionClick = (crId) => {
    console.log('cr Id:', crId);
    navigate(`/dashboard/completeView/${crId}/`);
  };

  const handlButtonClick = async (prId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `${api.defaults.baseURL}/crprototype/${prId}/afteruatapprovel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success('You approve the UAT')
      navigate(`/dashboard/completedCR`);
      
    } catch (error) {
      console.error("Error UAT approvel", error);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss'); 
  };

  // Filter out duplicate CRs based on crId
  const uniqueCrPrototypes = [];
  crprototype.forEach((pr) => {
    if (!uniqueCrPrototypes.find((uniquePr) => uniquePr.crId === pr.crId)) {
      uniqueCrPrototypes.push(pr);
    }
  });

  const filteredCrPrototypes = uniqueCrPrototypes.filter((pr) => {
    return pr.cr.status === "Need UAT Approvel";
  });

  if (userType !== 'HOD' && userType !== 'SFA_User') {
    return <p>You do not have access to this page.</p>;
}



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
          <p className="text-xl text-black-500 mt-10">There is not any UAT to approve!!</p>
        </div>
      ) : (
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
                          : pr.cr.status === "Need UAT Approvel"
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      {pr.cr.status}
                    </span>
                  </p>

                  <p className="text-lg font-bold text-stone-950 text-left">
                    Topic: {pr.cr.topic}
                  </p>
                </div>
                <div className="col-span-2">
                  {pr.cr.createdAt && (
                    <p className="text-center">
                      The Change Request with ID:{" "}
                      <span className="font-semibold text-lg">{pr.crId}</span>{" "}
                      {" "}
                      <span className="font-semibold text-lg">{" created by "}{name}</span>{" "}created at :{" "}
                      <span className="font-semibold">
                        {formatDate(pr.cr.createdAt)} { }
                      </span>{" "}
                      now need UAT Approval
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleActionClick(pr.crId)}
                className="w-32 mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 mr-2 rounded"
              >
                View
              </button>
              <button
                onClick={() => handlButtonClick(pr.prId)}
                className="w-32 mt-4 bg-lime-500 hover:bg-lime-600 text-black font-medium  py-2 px-4 rounded"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UatApprove;
