/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useTable, usePagination, useSortBy } from 'react-table';
import 'react-quill/dist/quill.snow.css';
import { getLoginInfo } from "../utils/LoginInfo";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from "react-icons/fa";

function Crview() {
  const [crs, setCrs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userType = getLoginInfo()?.userType;


  useEffect(() => {
    fetchCrs();
  }, []);

  const fetchCrs = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${api.defaults.baseURL}/crs`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Filter CRs with status "start-development"
      const filteredCrs = response.data.filter(cr => cr.status !== 'Starting Development');
      setCrs(filteredCrs);
    } catch (error) {
      console.error('Error fetching crs:', error);
    }
  };

  const handleStartDevelopment = async (crId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(
        `${api.defaults.baseURL}/crs/${crId}/start-development`,
        null, // no data payload needed
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Refresh the CRs after updating the status
      fetchCrs();
      toast.success('CR is now in development!');
    } catch (error) {
      console.error('Error starting development:', error);
    }
  };

  const handlePriorityChange = async (crId, newPriority) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(
        `http://localhost:3000/change-requests/:id/update-priority`
,
        { priority: newPriority },
        console.log(newPriority),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // You might want to handle the response here if needed
      console.log('Priority updated successfully');
      toast.success('You changed the priority')
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };
  
  
  const columns = React.useMemo(
    () => [
      { id: 'crId', Header: 'CR ID', accessor: 'crId' },
      { id: 'name', Header: 'Name', accessor: 'name' }, // Accessing firstname field
      { id: 'department', Header: 'Department', accessor: 'department' },
      { id: 'topic', Header: 'Topic', accessor: 'topic' },
      { id: 'date', Header: 'Date/Time', accessor: 'date' },
      { id: 'priority', Header: 'Priority', accessor: 'priority' },
      userType === 'Developer' && {
        id: 'startDevelopment',
        Header: 'Start Development',
        accessor: (row) => (
          <button onClick={() => handleStartDevelopment(row.crId)}>Start Development</button>
        ),
      },
      userType === 'SFA_User' && {
        id: 'priorityInput',
        Header: 'Change Priority',
        accessor: (row) => (
          <input
            type="number"
            value={row.priority}
            onChange={(e) => handlePriorityChange(row.crId, e.target.value)}
          />
        ),
      },
      {
        id: 'actions',
        Header: 'Actions',
        accessor: () => (
          <button>
            <FaEye className="mr-1" /></button>
        ),
      },
    ].filter(Boolean),
    [userType]
  );
  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: crs,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useSortBy,
    usePagination
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = React.useMemo(() => {
    return page.filter((row) =>
      Object.values(row.original).some((cellValue) =>
        cellValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [page, searchTerm]);

  return (
    <div className={`container mx-auto bg-white-100 shadow-md min-h-96 rounded-lg `}>
    

      
          <div className="mb-4 flex justify-end">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="px-6 py-2 border border-gray-500 rounded"
            />
          </div>
      
          <div className="overflow-x-auto">
            <table {...getTableProps()} className="table-auto w-full border-collapse">
              <thead className="bg-yellow-400">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-2" key={column.id}>
                        <div className="flex items-center justify-between text-center">
                          <span>{column.render('Header')}</span>
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M7 10l5 5 5-5z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M7 14l5-5 5 5z" />
                                </svg>
                              )
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5z" />
                              </svg>
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-gray-50">
                {filteredRows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="border-b text-center" key={row.id}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="px-4 py-5 text-center" key={cell.column.id}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pagination flex justify-center mt-4">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
              {'<<'}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
              {'<'}
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
              {'>'}
            </button>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
              {'>>'}
            </button>
          </div>
        </div>
      );
}

export default Crview;
