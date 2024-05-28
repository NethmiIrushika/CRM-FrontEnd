import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { getLoginInfo } from "../utils/LoginInfo";
import { format } from 'date-fns';


function OngingCr() {
  const { crId } = useParams();
  const [crs, setCrs] = useState([]);
  const [cr, setCr] = useState(null);
  const userType = getLoginInfo()?.userType;
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


  const handleButtonClick = (crId, topic) => {
    navigate(`/dashboard/crProtoType/${crId}`, { state: { topic: topic } });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // const filteredCRs = crs.filter(cr =>
  //   // cr.getCr[0].user.userId === loggedInUserId &&
  //   cr.topic !== undefined &&
  //   Object.values(cr).some(value =>
  //     value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  // );


  const filteredCRs = crs.filter(cr =>
    (cr.crId.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cr.topic && cr.topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cr.status && cr.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cr.getCr[0].user.firstname && cr.getCr[0].user.firstname.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cr.name && cr.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // .filter((cr) => cr.getCr[0].user.userId === loggedInUserId); 

  const handleActionClick = (crId) => {
    console.log('cr Id:', crId);
    navigate(`/dashboard/devShowCrDetails/${crId}/`);
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss'); 
  };

  if (userType !== 'Developer' ) {
    return <p>You do not have access to this page.</p>;
}




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

      {filteredCRs.length === 0?(
        <div className="flex justify-center items-center h-full mt-4">
        <p className="text-xl text-black-500 mt-10">You do not have any pending CRs to send prototypes!!</p>
      </div>
      ):(
      <div className="my-4">
        {filteredCRs.map((cr) => (
          <div className="bg-white rounded shadow p-4 mb-6" key={cr.crId} >
            <div className="p-8 grid grid-cols-2 gap-2  ">
              <div className="col-span-2 ">
                <p className=" text-lg font-bold text-right">
                  <span className="text-black font-semibold">Change Request Status: </span>
                  {cr.status === 'Pending' ? (
                    <span className="text-red-500 font-bold">{cr.status}</span>
                  ) : cr.status === 'Taken For Development' ? (
                    <span className="text-blue-700 font-bold">{cr.status}</span>
                  ) : (
                    <span>{cr.status}</span>
                  )}
                </p>
                <p className="text-lg font-bold text-stone-950  text-left">Topic: {cr.topic}</p>
              </div>
              <div className="col-span-1">
                <p className=" font-semibold text-left"> CR ID: <span className='font-normal'>{cr.crId}</span>   </p>
                <p className=" font-semibold text-left"> CR Created At: <span className='font-normal'>{formatDate(cr.createdAt)} {/* Format date */}</span>  </p>
              </div>
              <div className="col-span-1">
                <p className=" font-semibold text-left">Developer Name: <span className='font-normal'>{cr.getCr[0].user.firstname}</span> </p>
                <p className="font-semibold text-left">SFA_User Name: <span className='font-normal'>{cr.name}</span>  </p>
              </div>
            </div>
            <button
              onClick={() => handleButtonClick(cr.crId, cr.topic)}
              className="w-32 bg-blue-500 hover:bg-blue-700 font-medium text-black py-2 px-2 rounded mr-2 transition duration-300 ease-in-out"
            >
              Sent Prototype
            </button>
            <button
              onClick={() => handleActionClick(cr.crId)}
              className="w-32 bg-green-500 hover:bg-green-700 font-medium text-black py-2 px-2 rounded transition duration-300 ease-in-out"
            >
              View CR
            </button>
          </div>
        ))}
      </div>
      )}
    </div>

  );
}

export default OngingCr;
