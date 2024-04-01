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

function OngoingApprovelCr() {
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
          cr.status === 'Need CR Approvel' );
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
  
    const formatDate = (date) => {
      return format(new Date(date), 'dd/MM/yyyy HH:mm:ss'); // Format date using date-fns
    };
  
    const columns = React.useMemo(
      () => [
        { id: 'crId', Header: 'CR ID', accessor: 'crId' },
        { id: 'name', Header: 'Name', accessor: 'name' },
        { id: 'topic', Header: 'Topic', accessor: 'topic' },
        { id: 'date', Header: 'Date/Time', accessor: 'createdAt', Cell: ({ value }) => formatDate(value) }, // Apply custom Cell renderer
        {
          id: 'action',
          Header: 'View',
          accessor: (row) => (
            <button className="btn-secondary" onClick={() => handleActionClick(row.crId)}>
              <FaEye className="icon" />
            </button>
          ),
        },
        userType === 'SFA_User' && {
          id: 'approve',
          Header: 'Status',
          accessor: 'hodApprovel',
          Cell: ({ value }) => value || 'Pending HOD Approval' // Default value if value is falsy
        },
      ].filter(Boolean),
      [userType]
    );
    
  
    const handleActionClick = (crId) => {
      console.log('cr Id:', crId);
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
      let filteredData = page;
    
      // Apply filtering based on user type
      if (userType === 'SFA_User') {
        filteredData = filteredData.filter(row => row.original.hodApprovel !== 'approved' &&  row.original.hodApprovel !== 'rejected'  );
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
  
        )
        }
  
      </div>
    );
  }


export default OngoingApprovelCr