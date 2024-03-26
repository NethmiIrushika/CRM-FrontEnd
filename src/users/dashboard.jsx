/* eslint-disable react/no-unknown-property */
import React from "react";
import logoImage from "../assets/dashboardr.png";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import { getLoginInfo } from "../utils/LoginInfo";

const Dashboard = () => {
  let navigate = useNavigate();
  const userType = getLoginInfo()?.userType;


  

  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-black rounded-lg sm:hidden hover:bg-white-100 focus:outline-none focus:ring-2 focus:ring-red-200"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        ></svg>
      </button>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-yellow-400"
        aria-label="Sidebar"
      >
        <br />
        <div className="w-64 h-12  ">
          <div className="flex justify-center ">
            <img src={logoImage} alt="Logo" className="h-auto w-20" />
          </div>
        </div>
        <div className="h-full px-3 py-4 overflow-y-auto bg-yellow-400">
          <ul className="space-y-2 font-medium">
            <li>
              <button
                onClick={() => navigate("userAccount")}
                style={{ display: userType !== "Admin" ? "none" : "" }}
                className="flex items-center text-white rounded-lg hover:bg-white hover:bg-opacity-40 hover:ring-1 hover-ring-white "
              >
                <div className="flex items-center w-40 h-10">
                  <svg
                    className=" w-5 h-5 text-black justify-left transition duration-75 dark:text-black group-hover:text-red-500 dark:group-hover:text-red"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                  <span className="ms-3 text-black justify-center">Users</span>
                </div>
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("viewCr")}
                className="flex items-center text-white rounded-lg hover:bg-white  hover:bg-opacity-40 hover:ring-1 hover-ring-white "
              >
                <div className="flex items-center  w-40 h-10">
                  <svg
                    className=" w-5 h-5 text-black justify-left transition duration-75 dark:text-black group-hover:text-red-500 dark:group-hover:text-red"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"></path>
                  </svg>
                  <span className="ms-3 text-black justify-center ">
                    CR View
                  </span>
                </div>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("profile")}
                style={{ display: userType !== "SFA_User" ? "none" : "" }}
                className="flex items-center text-white rounded-lg hover:bg-white hover:bg-opacity-40 hover:ring-1 hover-ring-white "
              >
                <div className="flex items-center w-40 h-10">
                  <svg
                    className="w-5 h-5 text-black justify-left transition duration-75 dark:text-black group-hover:text-red-500 dark:group-hover:text-red"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 4v12m-4-4h8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ms-3 text-black justify-center">
                    Profile
                  </span>
                </div>
              </button>
            </li>


            <li>
              <button
                onClick={() => navigate("createCr")}
                style={{ display: userType !== "SFA_User" ? "none" : "" }}
                className="flex items-center text-white rounded-lg hover:bg-white hover:bg-opacity-40 hover:ring-1 hover-ring-white "
              >
                <div className="flex items-center w-40 h-10">
                  <svg
                    className="w-5 h-5 text-black justify-left transition duration-75 dark:text-black group-hover:text-red-500 dark:group-hover:text-red"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 4v12m-4-4h8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ms-3 text-black justify-center">
                    Create New CR
                  </span>
                </div>
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("ongingCr")}
                style={{ display: userType !== "Developer" ? "none" : "" }}
                className="flex items-center text-white rounded-lg hover:bg-white hover:bg-opacity-40 hover:ring-1 hover-ring-white "
              >
                <div className="flex items-center w-40 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 text-black justify-left transition duration-75 dark:text-black group-hover:text-red-500 dark:group-hover:text-red" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 0c-6.617 0-12 5.383-12 12s5.383 12 12 12 12-5.383 12-12-5.383-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm1-16v6h-2v-6h2zm-1 12c-3.313 0-6-2.687-6-6h2c0 2.206 1.794 4 4 4s4-1.794 4-4h2c0 3.313-2.687 6-6 6z"/>
</svg>



                  <span className="ms-3 text-black justify-center">
                    Ongoing CR
                  </span>
                </div>
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("approveORreject")}
                style={{ display: userType !== "Developer" ? "none" : "" }}
                className="flex items-center text-white rounded-lg hover:bg-white hover:bg-opacity-40 hover:ring-1 hover-ring-white "
              >
                <div className="flex items-center w-40 h-10">
                  <svg
                    className="w-5 h-5 text-black justify-left transition duration-75 dark:text-black group-hover:text-red-500 dark:group-hover:text-red"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 4v12m-4-4h8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ms-3 text-black justify-center">
                    Prototypes
                  </span>
                </div>
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("approveprototype")}
                style={{ display: userType !== "SFA_User" ? "none" : "" }}
                className="flex items-center text-white rounded-lg hover:bg-white hover:bg-opacity-40 hover:ring-1 hover-ring-white "
              >
                <div className="flex items-center w-40 h-10">
                  <svg
                    className="w-5 h-5 text-black justify-left transition duration-75 dark:text-black group-hover:text-red-500 dark:group-hover:text-red"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 4v12m-4-4h8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ms-3 text-black justify-center">
                    Approve Prototypes
                  </span>
                </div>
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("completedCR")}
                className="flex items-center text-white rounded-lg hover:bg-white  hover:bg-opacity-40 hover:ring-1 hover-ring-white "
              >
                <div className="flex items-center w-40 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check w-5 h-5 text-black justify-left transition duration-75 dark:text-black group-hover:text-red-500 dark:group-hover:text-red">
  <path d="M20 6L9 17l-5-5"></path>
</svg>




                  <span className="ms-3 text-black justify-center">
                    Completed CR{" "}
                  </span>
                </div>
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("log")}
                style={{ display: userType !== "Admin" ? "none" : "" }}
                className="flex items-center text-white rounded-lg hover:bg-white  hover:bg-opacity-40 hover:ring-1 hover-ring-white "
              >
                <div className="flex items-center  w-40 h-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-file-text w-5 h-5 text-black justify-left transition duration-75 dark:text-black group-hover:text-red-500 dark:group-hover:text-red"
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"></path>
                  </svg>

                  <span className="ms-3 text-black justify-center ">Log</span>
                </div>
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("accessToken");

                  navigate("/userLogin");
                }}
                className="flex items-center text-white rounded-lg hover:bg-white hover:bg-opacity-40 hover:ring-1 hover-ring-white "
              >
                <div className="flex items-center w-40 h-10">
                  <svg
                    className="w-5 h-5 text-black justify-left transition duration-75 dark:text-black group-hover:text-red-500 dark:group-hover:text-red"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                    />
                  </svg>
                  <span className="ms-3 text-black justify-center ">
                    Log Out
                  </span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </aside>
      <div className="p-4 sm:ml-64">
        <div className="col p-0 m-0">
          <div className=" d-flex justify-content-center ">
            <Navbar />
          </div>
          <br />
          <br />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
