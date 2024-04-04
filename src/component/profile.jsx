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

  const filteredCrPrototypes = crprototype.filter((cr) => {
    return  cr.userId.userId === getLoginInfo()?.sub;
  });

  useEffect(() => {
    fetchCrprototype();
  }, []);

  const handleActionClick = (crId) => {
    console.log('cr Id:', crId);
    navigate(`/dashboard/completeView/${crId}/`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCrPrototypes.slice(indexOfFirstItem, indexOfLastItem);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(Math.ceil(filteredCrPrototypes.length / itemsPerPage));
  };

  const canPreviousPage = currentPage > 1;
  const canNextPage = indexOfLastItem < filteredCrPrototypes.length;
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
    data: currentItems,// Use filtered data for the table
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

        <div className="pagination">
          <button onClick={handleFirstPage} disabled={!canPreviousPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
            {'<<'}
          </button>
          <button onClick={goToPreviousPage} disabled={!canPreviousPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
            {'<'}
          </button>
          <button onClick={goToNextPage} disabled={!canNextPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
            {'>'}
          </button>
          <button onClick={handleLastPage} disabled={!canNextPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
            {'>>'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Approveprototype;
