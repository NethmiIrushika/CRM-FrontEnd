import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useTable, usePagination, useSortBy } from 'react-table';

function UserAccount() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${api.defaults.baseURL}/users`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const columns = React.useMemo(
    () => [
      { id: 'userId', Header: 'ID', accessor: 'userId' },
      { id: 'firstname', Header: 'First Name', accessor: 'firstname' },
      { id: 'lastname', Header: 'Last Name', accessor: 'lastname' },
      { id: 'username', Header: 'Username', accessor: 'username' },
      { id: 'userType', Header: 'User Type', accessor: 'userType' },
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
      data,
      initialState: { pageIndex:0 , pageSize:5 },
    },
    useSortBy ,// Add useSortBy hook here
    usePagination,
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
                        <path d="M7 10l5 5 5-5z"  />
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
)};

export default UserAccount;
