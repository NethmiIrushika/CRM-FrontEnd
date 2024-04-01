import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { getLoginInfo } from "../utils/LoginInfo";

function OngingCr() {
  const { crId } = useParams();
  const [crs, setCrs] = useState([]);
  const [cr, setCr] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(getLoginInfo()?.sub); // Initialize with the logged-in user ID
  const navigate = useNavigate();

  // Update loggedInUserId when user logs in or out
  useEffect(() => {
    setLoggedInUserId(getLoginInfo()?.sub);
  }, []);

  useEffect(() => {
    const fetchCrs = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${api.defaults.baseURL}/crs/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const startingDevelopmentCRs = response.data.filter(
          (cr) => cr.status === "Taken For Development"
        );

        setCrs(startingDevelopmentCRs);

      } catch (error) {
        console.error("Error fetching crs:", error);
      }
    };

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
      }
    };

    fetchCrDetails();
    fetchCrs();
  }, [crId]);

  // Rest of the component code...





  const handleButtonClick = (crId, topic) => {
    console.log("CR ID:", crId);
    console.log("Topic:", topic);
    navigate(`/dashboard/crProtoType/${crId}`, { state: { topic: topic } });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCRs = crs.filter(cr =>
    // cr.getCr[0].user.userId === loggedInUserId &&
    cr.topic !== undefined &&
    Object.values(cr).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


  // .filter((cr) => cr.getCr[0].user.userId === loggedInUserId); 

  const handleActionClick = (crId) => {
    console.log('cr Id:', crId);
    navigate(`/dashboard/ShowCrDetails/${crId}/`);
  };



  return (
    <div className="container mx-auto px-4 full">
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="px-4 py-2 border border-gray-500 rounded w-64"
        />
      </div>

      <div className="my-4">
        {filteredCRs.map((cr) => (
          <div className="bg-white rounded shadow p-4 mb-6" key={cr.crId} >
            <div className="p-8 grid grid-cols-2 gap-2  ">
              <div className="col-span-2 ">
                <p className=" text-lg font-bold text-right">
                  <span className="text-black font-semibold">Change Request Status: </span>
                  {cr.status === 'Pending' ? (
                    <span className="text-red-500 font-bold">{cr.status}</span>
                  ) : cr.status === 'Starting Development' ? (
                    <span className="text-green-500 font-bold">{cr.status}</span>
                  ) : (
                    <span>{cr.status}</span>
                  )}
                </p>
                <p className="text-lg font-bold text-stone-950  text-left">Topic: {cr.topic}</p>
              </div>
              <div className="col-span-1">
                <p className=" font-semibold text-left">
                  CR ID: {cr.crId}
                </p>
                <p className=" font-semibold text-left">
                  CR Created At: {cr.createdAt}
                </p>
              </div>
              <div className="col-span-1">
                <p className=" font-semibold text-left">
                  Developer Name: {cr.getCr[0].user.firstname}
                </p>
                <p className="font-semibold text-left">
                  SFA_User Name:  {cr.name}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleButtonClick(cr.crId, cr.topic)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-2 transition duration-300 ease-in-out"
            >
              Sent Prototype
            </button>
            <button
              onClick={() => handleActionClick(cr.crId)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded transition duration-300 ease-in-out"
            >
              View CR
            </button>
          </div>
        ))}
      </div>
    </div>

  );
}

export default OngingCr;
