import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useTable, usePagination, useSortBy } from 'react-table';
import 'react-quill/dist/quill.snow.css';
import { getLoginInfo } from "../utils/LoginInfo";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye,FaEdit } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import ChangePriorityPopup from '../popup/changeprioritypopup';

function Crview() {
  const [crs, setCrs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userType = getLoginInfo()?.userType;
  const navigate = useNavigate();
  const [editPriority, setEditPriority] = useState(false); // State for controlling the popup
  const [selectedCr, setSelectedCr] = useState(null); // State for the selected CR
  const [newPriority, setNewPriority] = useState('');
  const [currentPriority, setCurrentPriority] = useState('');
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (selectedCr) {
      const selectedCrObj = crs.find((cr) => cr.crId === selectedCr);
      setCurrentPriority(selectedCrObj?.priority || '');
    }
    fetchCrs();
}, [selectedCr, crs]);

///////////////////////////////////////////////////////////////////////////

const isTokenExpired = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.exp * 1000 < Date.now();
  }
  return true; // Return true if token not found or unable to decode
};

// Logout user if token is expired
useEffect(() => {
  if (isTokenExpired()) {
    // Perform logout action here, such as clearing local storage and redirecting to login page
    localStorage.clear();
    navigate('/UserLogin'); // Redirect to login page
  }
}, []);


/////////////////////////////////////////////////////////////////////////////

  const fetchCrs = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${api.defaults.baseURL}/crs`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Filter CRs with status "start-development"
      const filteredCrs = response.data.filter(cr =>
        cr.status !== 'Starting Development' && cr.status !== 'sent prototype' && cr.status !== 'Completed');
      setCrs(filteredCrs);
    } catch (error) {
      console.error('Error fetching crs:', error);
    }
  };


  const handleEditPriority = (row) => {
    console.log(row); // Add this line to check the structure of the row object
    if (row.original) {
      setSelectedCr(row.original);
      setEditPriority(true);
      setNewPriority(row.original.priority);
    }
  };

  const updatePriority = async (cr, newPriority) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      await axios.put(
        `${api.defaults.baseURL}/crs/${cr.crId}/priority`,
        { priority: newPriority },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle any additional logic or UI updates after successfully changing priority
      // For example, you might want to refresh the CRs list or show a success message
      fetchCrs();
      toast.success('Priority updated successfully!');
    } catch (error) {
      console.error('Error updating priority:', error);
      // Handle error appropriately, e.g., show error message to the user
    }
  };

  const closeEditPriority = () => {
    setEditPriority(false);
  };

  const columns = React.useMemo(
    () => [
      { id: 'crId', Header: 'CR ID', accessor: 'crId' },
      { id: 'name', Header: 'Name', accessor: 'name' },
      { id: 'topic', Header: 'Topic', accessor: 'topic' },
      { id: 'date', Header: 'Date/Time', accessor: 'createdAt' },
      { id: 'priority', Header: 'Priority', accessor: 'priority' },
      userType === 'Developer' && {
        id: 'get',
        Header: 'Get',
        accessor: (row) => (
          <button className="btn-primary" onClick={() => handleButtonClick(row.crId)}>Get</button>
        ),
      },
      userType === 'SFA_User' && {
        id: 'priorityInput',
        Header: 'Change Priority',
        accessor: (row) => row,
        Cell: ({ row }) => (
          <div className="flex items-center">
            {editPriority && selectedCr?.crId === row.original.crId ? (
              <>
                <input
                  type="number"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  onBlur={() => updatePriority()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updatePriority();
                    }
                  }}
                  className="border border-gray-400 rounded p-1 mr-2"
                />
                <button className="btn-secondary" onClick={() => closeEditPriority()}>Cancel</button>
              </>
            ) : (
              <span className="mr-2">{row.original.priority}</span>
            )}
            <button className="btn-primary" onClick={() => handleEditPriority(row)}>
              <FaEdit className="icon" /> {/* Add class for icon styling */}
            </button>
          </div>
        ),
      },
      {
        id: 'action',
        Header: 'Action',
        accessor: (row) => (
          <button className="btn-secondary" onClick={() => handleActionClick(row.crId)}>
            <FaEye className="icon" />
          </button>
        ),
      },
    ].filter(Boolean),
    [userType]
  );

  const handleActionClick = (crId) => {
    console.log('cr Id:', crId);
    navigate(`/dashboard/showCrDetails/${crId}`);
  };


  const handleButtonClick = async (crId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage

      // Log the userId before making the API call
      console.log(userId);

      await axios.put(
        `${api.defaults.baseURL}/crs/${crId}/start-development`,
        { userId }, // Include userId in the request payload
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Refresh the CRs after updating the status
      fetchCrs();
      
      toast.success('CR is now in development!');
      navigate(`/dashboard/ongingCr`);
    } catch (error) {
      console.error('Error starting development:', error);
    }};

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage, // Add gotoPage from usePagination
    pageCount, // Add pageCount from usePagination
    
  } = useTable(
    {
      columns,
      data: crs,
      initialState: { sortBy: [{ id: 'priority', desc: false }], pageSize: 5, pageIndex: pageIndex }, // Set initial page size and index
      disableMultiSort: true, // Disable multi-column sorting
    },
    useSortBy,
    usePagination
  );


  page.forEach(prepareRow);

  const getRowProps = (state, rowInfo, column) => {
    if (
      rowInfo &&
      rowInfo.row &&
      rowInfo.row.original.priority === 1 &&
      (pageIndex === 0 || !pageIndex)
    ) {
      return {
        className: 'bg-red-400 bg-opacity-15 shadow border border-red-600',
      };
    }
    return {};
  };

  const handleNextPage = () => {
    if (canNextPage) {
      nextPage();
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (canPreviousPage) {
      previousPage();
      setPageIndex(pageIndex - 1);
    }
  };

  const handleFirstPage = () => {
    if (canPreviousPage) {
      gotoPage(0);
      setPageIndex(0);
    }
  };

  const handleLastPage = () => {
    if (canNextPage) {
      gotoPage(pageCount - 1);
      setPageIndex(pageCount - 1);
    }
  };



  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = React.useMemo(() => {
    return page.filter((row) =>Object.values(row.original).some((cellValue) =>
        cellValue && cellValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [page, searchTerm]);

  return (
    <div className={`container mx-auto bg-white-100 shadow-md min-h-96 rounded-lg `}>

      <ChangePriorityPopup
        editPriority={editPriority}
        selectedCr={selectedCr}
        currentPriority={selectedCr ? selectedCr.priority : ''}
        handlePriorityChange={(e) => setNewPriority(e.target.value)}
        updatePriority={updatePriority}
        closeEditPriority={closeEditPriority}
      />

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
          <tbody {...getTableBodyProps()} className="bg-gray-50">
  {filteredRows.map((row, i) => {
    prepareRow(row);

    return (
      <tr
        className={`border-b text-center ${getRowProps(null, { row, column: null }).className}`}
        key={row.id}
      >
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
      <div className="pagination">
        <button onClick={handleFirstPage} disabled={!canPreviousPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
          {'<<'}
        </button>
<button onClick={handlePreviousPage} disabled={!canPreviousPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
          {'<'}
        </button>
        <button onClick={handleNextPage} disabled={!canNextPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
          {'>'}
        </button>
        <button onClick={handleLastPage} disabled={!canNextPage} className="mr-2 px-4 py-2 bg-yellow-400 text-black rounded">
          {'>>'}
        </button>
      </div>

    </div>
  );
}

export default Crview;