import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useTable, usePagination, useSortBy } from 'react-table';
import 'react-quill/dist/quill.snow.css';
import { getLoginInfo } from "../utils/LoginInfo";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import ChangePriorityPopup from '../popup/changeprioritypopup';
import { format } from 'date-fns';

function Crview() {
  const [crs, setCrs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userType = getLoginInfo()?.userType;
  const navigate = useNavigate();
  const [editPriority, setEditPriority] = useState(false); 
  const [selectedCr, setSelectedCr] = useState(null); 
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
      localStorage.clear();
      navigate('/UserLogin'); 
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

      const filteredCrs = response.data.filter(cr =>
        cr.status === 'Pending to get development');
      setCrs(filteredCrs);
    } catch (error) {
      console.error('Error fetching crs:', error);
    }
  };


  const handleEditPriority = (row) => {
    console.log(row); 
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

      fetchCrs();
      toast.success('Priority updated successfully!');
    } catch (error) {
      console.error('Error updating priority:', error);

    }
  };

  const closeEditPriority = () => {
    setEditPriority(false);
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss'); 
  };

  const columns = React.useMemo(
    () => [
      { id: 'crId', Header: 'CR ID', accessor: 'crId' },
      { id: 'name', Header: 'Name', accessor: 'name' },
      { id: 'topic', Header: 'Topic', accessor: 'topic' },
      { id: 'date', Header: 'Date/Time', accessor: 'createdAt', Cell: ({ value }) => formatDate(value) }, 
      { id: 'priority', Header: 'Priority', accessor: 'priority' },
  
      userType === 'SFA_User' && {
        id: 'priorityInput',
        Header: 'Change Priority',
        accessor: (row) => row,
        Cell: ({ row }) => (
          <div >
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
              <button className="btn-primary" onClick={() => handleEditPriority(row)}>
                <FaEdit className="icon" /> 
              </button>
            )}
          </div>
        ),
      },
      {
        id: 'action',
        Header: 'View',
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
    navigate(`/dashboard/showCrDetails/${crId}`);
  };




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
    gotoPage, 
    pageCount, 

  } = useTable(
    {
      columns,
      data: crs,
      initialState: { sortBy: [{ id: 'priority', desc: false }], pageSize: 5, pageIndex: pageIndex }, // Set initial page size and index
      disableMultiSort: true,
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
    let filteredData = page;
  
    // Apply filtering based on user type
    if (userType === 'SFA_User') {
      filteredData = filteredData.filter(row => row.original.hodApprovel === 'approved');
    }
    if (userType === 'Developer') {
      filteredData = filteredData.filter(row => row.original.hodApprovel === 'approved');
    }
    if (userType === 'HOD') {
      filteredData = filteredData.filter(row => row.original.hodApprovel === 'approved' );
    }
  
    // Apply search term filtering
    filteredData = filteredData.filter(row =>
      Object.values(row.original).some(cellValue =>
        cellValue && cellValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  
    return filteredData;
  }, [page, searchTerm, userType]);
  

  
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
      {crs.length === 0 ? (
        <div className="flex justify-center items-center h-full mt-4">
          <p className="text-xl text-black-500 mt-10">There are not any Change Requests Pending in this system!!</p>
        </div>
      ) : (<div>
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="table-auto w-full border-collapse">
            <thead className="bg-yellow-400">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-2 border " key={column.id}>
                      <div className="flex justify-between text-left">
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
              {filteredRows.map((row, i) => {
                prepareRow(row);

                return (
                  <tr
                    className={`border-b text-left ${getRowProps(null, { row, column: null }).className}`}
                    key={row.id}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="px-4 py-5 text-left  border" key={cell.column.id}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
        <div className="flex justify-end mb-4 mt-4">
  <div>
    <button
      onClick={handlePreviousPage}
      disabled={!canPreviousPage}
      className="mr-6 border border-white-700 font-medium shadow-xl w-20 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring focus:border-yellow-300"
    >
      Previous
    </button>
    <span className="mr-6">
      Page {pageIndex + 1} of {pageCount}
    </span>
    <button
      onClick={handleNextPage}
      disabled={!canNextPage}
      className="border border-white-700 font-medium shadow-xl w-20 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring focus:border-yellow-300"
    >
      Next
    </button>
  </div>
</div>

      </div>

      )
      }

    </div>
  );
}

export default Crview;