import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import { getLoginInfo } from "../utils/LoginInfo";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";

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
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };
  const filteredCrPrototypes = crprototype.filter((pr) => {
    return (
      pr &&
      pr.cr &&
      pr.cr.userId &&
      pr.cr.userId.userId === getLoginInfo()?.sub &&
      (pr.crId.toString().toLowerCase().includes(searchTerm) ||
        pr.topic.toLowerCase().includes(searchTerm) ||
        pr.cr.status.toLowerCase().includes(searchTerm))
    );
  });

  useEffect(() => {
    fetchCrprototype();
  }, []);

  const handleActionClick = (prId) => {
    console.log("cr Id:", prId);
    navigate(`/dashboard/showprotoDetails/${prId}`);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "CR ID",
        accessor: "crId",
      },
      {
        Header: "Topic",
        accessor: "cr.topic",
      },
      {
        Header: "Status",
        accessor: "cr.status",
      },
      {
        Header: "Action",
        accessor: "prId",
        Cell: ({ value }) => (
          <button
            onClick={() => handleActionClick(value)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredCrPrototypes });

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
        <table {...getTableProps()} className="w-full table-auto">
          
        <thead className="bg-yellow-400">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className="px-4 py-2">
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="px-4 py-2">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Approveprototype;
