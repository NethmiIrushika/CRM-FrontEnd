import { useState, useEffect } from "react";
import { getLoginInfo } from "../utils/LoginInfo";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const name = getLoginInfo()?.firstname;

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerID);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoForward = () => {
    window.history.forward();
  };
  return (
    <div className="navbar h-16 shadow bg-gray-800 text-white rounded-full flex items-center justify-center w-full">
      <nav className="text-gray-800  bg-yellow-400 h-12 rounded-full">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-1 flex justify-center">
              <div className="flex">
              <button onClick={handleGoBack} className=" flex border border-black mt-1 justify-start bg-yellow-400 hover:bg-yellow-500 font-medium py-2 px-2 text-black rounded-full">
                <FaArrowLeft />
              </button>
              </div>
           
              <div className="mx-6 font-medium">
                Date: {currentTime.toLocaleDateString()}
              </div>
              <div className="mx-6 font-medium">
                Time: {currentTime.toLocaleTimeString()}
              </div>
              
              <div className="mx-6 font-medium">Hello, {name}</div>
              
              <div className="flex">
            <button onClick={handleGoForward} className="flex border border-black mt-1 justify-end bg-yellow-400 hover:bg-yellow-500 font-medium text-black py-2 px-2 rounded-full ">
                <FaArrowRight /> 
              </button>
              </div>
            </div>
            
              
           
          </div>
          
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
