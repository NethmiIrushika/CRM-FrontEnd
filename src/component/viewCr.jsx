/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useTable, usePagination, useSortBy } from 'react-table';

import 'react-quill/dist/quill.snow.css';
import { getLoginInfo } from "../utils/LoginInfo";

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
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };
  
  
  const columns = React.useMemo(
    () => [
      { id: 'crId', Header: 'CR ID', accessor: 'crId' },
      { id: 'name', Header: 'Name', accessor: 'name' },
      { id: 'department', Header: 'Department', accessor: 'department' },
      { id: 'topic', Header: 'Topic', accessor: 'topic' },
      { id: 'description', Header: 'Description', accessor: 'description' },
      { id: 'priority', Header: 'Priority', accessor: 'priority' },
      userType === 'Admin' && {
        id: 'startDevelopment',
        Header: 'Start Development',
        accessor: (row) => (
          <button onClick={() => handleStartDevelopment(row.crId)}>Start Development</button>
        ),
      },
  {
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
      userType === 'Admin' && { id: 'actions', Header: 'Actions', accessor: 'actions' },
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

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="table-auto w-full ">
          <thead>
            {headerGroups.map((headerGroup,index) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200" key={index}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-2 text-center" key={columnIndex}>
                    <div className="flex items-center justify-center">
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
          <tbody {...getTableBodyProps()}>
            {filteredRows.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="border-b" key={index}>
                  {row.cells.map((cell, cellIndex) => (
                    <td {...cell.getCellProps()} className="px-4 py-2 text-center" key={cellIndex}>
                      {/* Check if the cell contains the 'description' field */}
                      {cell.column.id === 'description' ? (
                        // If it's the 'description' field, render the React Quill HTML content
                        <div dangerouslySetInnerHTML={{ __html: cell.value }} />
                      ) : (
                        // If it's not the 'description' field, render the cell value as it is
                        <div>{cell.render('Cell')}</div>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination flex justify-center mt-4">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageCount}
            </strong>{' '}
          </span>
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
      </div>
    </div>
  );
}

export default Crview;
