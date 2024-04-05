/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import { getLoginInfo } from "../utils/LoginInfo";
import { useTable } from 'react-table'; // Import useTable hook

function Profile({ userInfo }) {
  return (
    <div className="mb-8">
      {userInfo ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Name: {userInfo.firstname} {userInfo.lastname}
          </h2>
          <p className="mb-1">Email: {userInfo.username}</p>
          <p className="mb-1">User Type: {userInfo.userType}</p>
          <p className="mb-1">Department: {userInfo.department}</p>
        </div>
      ) : (
        <div>User information not available</div>
      )}
    </div>
  );
}

function Approveprototype() {
  const [crprototype, setCrprototype] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const fetchCrprototype = async () => {
    try {
      const userId1 = localStorage.getItem("userId");
      setLoggedInUserId(userId1);
      console.log(userId1);

      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${api.defaults.baseURL}/crs`, {
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
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  useEffect(() => {
    fetchCrprototype();
  }, []);

  const handleActionClick = (crId) => {
    console.log('cr Id:', crId);
    navigate(`/dashboard/showCrDetails/${crId}/`);
  };

  const orderedCrPrototypes = crprototype.sort((a, b) => {
    const statusOrder = {
      'Need CR Approvel': 1,
      'Pending to get development': 2,
      'Taken For Development':3,
      'Need Approvel For Prototype': 4,
      'Development Completed': 5,
      'CR Rejected': 6,
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orderedCrPrototypes.slice(indexOfFirstItem, indexOfLastItem);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Define columns and data for the React data table
  const columns = React.useMemo(
    () => [
      { Header: 'CR ID', accessor: 'crId' },
      { Header: 'Topic', accessor: 'topic' },
      { Header: 'Status', accessor: 'status' },
      {
        Header: 'Action',
        accessor: 'prId',
        Cell: ({ row }) => (
          <button
            onClick={() => handleActionClick(row.original.crId)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
          >
            View
          </button>
        ),
      },
    ],
    [] // Dependency array
  );

  // Initialize the React data table using useTable hook
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: currentItems, // Use ordered and paginated data for the table
  });

  return (
    <div className={`container mx-auto bg-white-100 shadow-md min-h-96 rounded-lg `}>
      <div className="max-w-4xl mx-auto">

        <Profile userInfo={getLoginInfo()} />


        <div className="mb-4 flex justify-end">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="px-4 py-2 border border-gray-500 rounded"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse " {...getTableProps()}>
            <thead className="bg-yellow-400">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} className="px-2 py-2 border ">
                      <div className="flex justify-between text-left">{column.render('Header')}</div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="px-2 py-2 text-left  border">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span>
            Page {currentPage} of {Math.ceil(orderedCrPrototypes.length / itemsPerPage)}
          </span>
          <div className="flex items-center">
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className="mr-2">
              Previous
            </button>
            <button onClick={goToNextPage} disabled={indexOfLastItem >= orderedCrPrototypes.length}>
              Next
            </button>
          </div>
        </div>


      </div>
    </div>
  );
}

export default Approveprototype;
