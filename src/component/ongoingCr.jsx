// PrototypeCr.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";

function OngingCr() {
  const { crId } = useParams();
  const [crs, setCrs] = useState([]);
  const [cr, setCr] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrs = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Retrieve token from storage

        const response = await axios.get(`${api.defaults.baseURL}/crs/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include token in the request headers
          },
        });

        // Filter CRs based on status "Starting Development"
        const startingDevelopmentCRs = response.data.filter(
          (cr) => cr.status === "Starting Development"
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



  const handleButtonClick = (crId) => {
    console.log("CR ID:", crId);
    navigate(`/dashboard/crProtoType/${crId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCRs = crs.filter((cr) =>
    Object.values(cr).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleActionClick = (crId) => {
    console.log('cr Id:', crId);
    navigate(`/dashboard/showCrDetails/${crId}/`);
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

      <div className="my-4">
        {filteredCRs.map((cr) => (
          <div key={cr.crId} className="border rounded p-4 mb-4">
            <p>
              <strong>CR ID:</strong> {cr.crId}
            </p>
            <p>
              <strong>Name:</strong> {cr.name}
            </p>
            <p>
              <strong>Department:</strong> {cr.department}
            </p>
            <p>
              <strong>Topic:</strong> {cr.topic}
            </p>
            <p>
              <strong> Description: </strong>{" "}
              <div dangerouslySetInnerHTML={{ __html: cr.description }} />
            </p>
            {cr.userId && (
              <p>
                <strong>user id:</strong> {cr.userId.userId}
              </p>
            )}
            <button
              onClick={() => handleButtonClick(cr.crId)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Sent Prototype
            </button>
            <button onClick={() => { handleActionClick(cr.crId) }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
