import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useTable, usePagination, useSortBy } from 'react-table';
import StatusPopup from '../popup/statuspopup'; // Import StatusPopup component
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from 'react-icons/fa';

function UserAccount() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user
  const [showStatusPopup, setShowStatusPopup] = useState(false);

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
      { id: 'username', Header: 'Email', accessor: 'username' },
      { id: 'department', Header: 'Department', accessor: 'department' },
      { id: 'userType', Header: 'User Type', accessor: 'userType' },
      { id: 'status', Header: 'Status', accessor: 'status' },
      {
        id: 'actions',
        Header: 'Actions',
        Cell: ({ row }) => (
          
          <button onClick={() => {setSelectedUser(row.original); setShowStatusPopup(true);}}> <FaEdit className="mr-1" /> </button>
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

  const updateUser = async (updatedUser) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${api.defaults.baseURL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data);
      if (updatedUser.status === 'approved') {
        toast.success(` ${updatedUser.firstname}  ${updatedUser.status}`, {
          className: 'toast-success',
        });
      } else if (updatedUser.status === 'rejected') {
        toast.error(` ${updatedUser.firstname}  ${updatedUser.status}`, {
          className: 'toast-error',
        });
      } else {
        // For other statuses, use the default toast appearance
        toast.success(` ${updatedUser.firstname} ${updatedUser.status}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  return (
<div className={`container mx-auto bg-yellow-50 shadow-md min-h-96 rounded-lg ${showStatusPopup ? 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center' : ''}`}>

      {showStatusPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <StatusPopup
            user={selectedUser}
            close={() => setShowStatusPopup(false)}
            updateUser={updateUser}
          />
        </div>
      )}
  
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
          <tbody className="bg-yellow-50">
            {filteredRows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="border-b" key={row.id}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-4 py-5" key={cell.column.id}>
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

export default UserAccount;
