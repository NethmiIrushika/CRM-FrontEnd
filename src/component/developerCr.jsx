import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useTable, usePagination, useSortBy } from 'react-table';

function DeveloperCr() {
  const [crs, setCrs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCrs = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken'); // Retrieve token from storage
        
        const response = await axios.get(`${api.defaults.baseURL}/crs`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include token in the request headers
          },
        });
        // console.log(accessToken);

        setCrs(response.data);

      } catch (error) {
        console.error('Error fetching crs:', error);
      }
    };
    fetchCrs();
  }, []);

  const columns = React.useMemo(
    () => [
      { id: 'crId', Header: 'CR ID', accessor: 'crId' },
      { id: 'name', Header: 'Name', accessor: 'name' },
      { id: 'department', Header: 'Department', accessor: 'department' },
      { id: 'topic', Header: 'Topic', accessor: 'topic' },
      { id: 'description', Header: 'Description', accessor: 'description' },
      { id: 'priority', Header: 'Priority Number', accessor: 'priority' },
      { id: 'view', Header: 'view', accessor: 'view' },

      {
        id: 'get',
        Header: 'Get',
        accessor: (row) => (
          <button onClick={() => handleButtonClick(row.crId,row.uniqueKey)}>Get</button>
        ),
      },
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

  const handleButtonClick = async (crId, uniqueKey) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const uniqueKey = localStorage.getItem('uniqueKey');
      
        await axios.put(
            `${api.defaults.baseURL}/crs/${crId}/start-development`,
            { uniqueKey }, // Include uniqueKey in the request payload
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
        <table {...getTableProps()} className="table-fixed w-full border-collapse">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-2">
                    <div className="flex items-center">
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
                <tr {...row.getRowProps()} className="border-b" key={row.original.userId}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-4 py-2" key={cell.column.id}>
                      <div>{cell.render('Cell')}</div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination">
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

export default DeveloperCr;
