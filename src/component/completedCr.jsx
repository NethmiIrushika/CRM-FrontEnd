/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useTable, usePagination, useSortBy } from 'react-table';
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CompletedCR() {
  const [crs, setCrs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrs = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken'); 

        const response = await axios.get(`${api.defaults.baseURL}/crs`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, 
          },
        });
  
        const completedCRs = response.data.filter(cr => cr.status === "Development Completed");
        setCrs(completedCRs);

      } catch (error) {
        console.error('Error fetching crs:', error);
      }
    };
    fetchCrs();
  }, []);

  const handleActionClick = (crId) => {
    console.log('cr Id:', crId);
    navigate(`/dashboard/showCrDetails/${crId}/`);
  };

  

  const columns = React.useMemo(
    () => [
      { id: 'crId', Header: 'CR ID', accessor: 'crId' },
      { id: 'name', Header: 'Name', accessor: 'name' },
      { id: 'topic', Header: 'Topic', accessor: 'topic' },
      {
        id: 'action',
        Header: 'View',
        accessor: (row) => (
          <button className="btn-secondary" onClick={() => handleActionClick(row.crId)}>
            <FaEye className="icon" />
          </button>
        ),
      },
      { id: 'status', Header: 'Status', accessor: 'status' },
    ],
    []
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
    <div className="container mx-auto bg-white-100 shadow-md min-h-96 rounded-lg">
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="px-4 py-2 border border-gray-500 rounded"
        />
      </div>
{crs.length === 0 ?(<div className="flex justify-center items-center h-full mt-4">
          <p className="text-xl text-black-500 mt-10">There are not any  Completed Change Requests in this system!!</p>
        </div>):(
          <div>
            <div className="overflow-x-auto">
        <table {...getTableProps()} className="table-fixed w-full border-collapse">
          <thead className="bg-yellow-400">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} >
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-2 border">
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
          <tbody {...getTableBodyProps()} >
            {filteredRows.map((row, index) => {
              prepareRow(row);
              // Remove HTML tags from the description
              const descriptionWithoutTags = row.original.description.replace(/(<([^>]+)>)/gi, '');
              return (
                <tr {...row.getRowProps()} className="border-b text-center" key={row.original.userId}>
                  {row.cells.map((cell, cellIndex) => (
                    <td {...cell.getCellProps()} className="px-4 py-2 text-left border" key={cellIndex}>
                      {/* Render the description without HTML tags */}
                      {cell.column.id === 'description' ? descriptionWithoutTags : cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        
        
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className="mr-6 border border-white-700 font-medium shadow-xl w-20 hover:bg-yellow-400">
        Previous
        </button>{' '}
        <span className="mx-4">Page {pageIndex + 1} of {pageCount}</span>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage} className="w-20 ml-6 border-white-700 border font-medium shadow-xl w-20 hover:bg-yellow-400">
        Next
        </button>{' '}
        
      </div>
          </div>
        )}
      
    </div>
  );
}

export default CompletedCR;
