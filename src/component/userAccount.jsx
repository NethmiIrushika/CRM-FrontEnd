import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useTable, usePagination, useSortBy } from 'react-table';
import StatusPopup from '../popup/statuspopup'; // Import StatusPopup component

function UserAccount() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${api.defaults.baseURL}/users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const columns = React.useMemo(
    () => [
      { id: 'userId', Header: 'ID', accessor: 'userId' },
      { id: 'firstname', Header: 'First Name', accessor: 'firstname' },
      { id: 'lastname', Header: 'Last Name', accessor: 'lastname' },
      { id: 'username', Header: 'Username', accessor: 'username' },
      { id: 'userType', Header: 'User Type', accessor: 'userType' },
      { id: 'status', Header: 'Status', accessor: 'status' },
      {
        id: 'actions',
        Header: 'Actions',
        Cell: ({ row }) => (
          <button onClick={() => setSelectedUser(row.original)}>Change Status</button>
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
      data: users, // Use 'users' state as data
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

  const updateUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${api.defaults.baseURL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="container mx-auto full">
      {/* Render StatusPopup if selectedUser is not null */}
      {selectedUser && (
        <StatusPopup
          user={selectedUser}
          close={() => setSelectedUser(null)}
          updateUser={updateUser}
        />
      )}

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

export default UserAccount;
