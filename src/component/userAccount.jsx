import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useTable } from 'react-table';

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
    rows,
    prepareRow,
  } = useTable({ columns, data });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter the rows based on search term
  const filteredRows = rows.filter(row =>
    Object.values(row.original).some(cellValue =>
      cellValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">User Table</h2>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="px-4 py-2 border rounded"
        />
      </div>
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="table-auto w-full border-collapse">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className="px-4 py-2">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {filteredRows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="border-b" key={row.id}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-4 py-2" key={cell.value}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserAccount;
