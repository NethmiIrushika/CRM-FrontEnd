import { useState, useEffect } from "react";
import { getLoginInfo } from "../utils/LoginInfo";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const name = getLoginInfo()?.firstname;

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerID);
  }, []);

  return (
    <div className="navbar h-16 shadow bg-gray-800 text-white rounded-full flex items-center justify-center w-full">
      <nav className="text-gray-800  bg-yellow-400 h-12 rounded-full">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-1 flex justify-center">
              <div className="mx-6 font-medium">
                Date: {currentTime.toLocaleDateString()}
              </div>
              <div className="mx-6 font-medium">
                Time: {currentTime.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-4">
              <div className="text-lg text-black">Hello, {name}</div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
