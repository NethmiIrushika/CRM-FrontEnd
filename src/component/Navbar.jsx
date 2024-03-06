import React, {useState, useEffect} from "react";
const Navbar = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerID = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timerID);
    }, []);

    return (
        <div className="navbar h-16 shadow">
            <nav className="text-gray-800 bg-white h-12">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <div className="font-medium">
                            Time: {currentTime.toLocaleTimeString()}
                            <p className="text-sm">Date: {currentTime.toLocaleDateString()}</p>

                        </div>
                    </div>
                    <h1 className="text-xl font-bold flex-grow text-center">CR Management System</h1>
                    <div className="flex items-center space-x-4">
                        <div>Username</div>
                        <button className="flex-shrink-0 text-white">
                            <svg
                                className="h-6 w-6 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 0c5.523 0 10 4.477 10 10 0 5.522-4.477 10-10 10-5.522 0-10-4.478-10-10 0-5.523 4.478-10 10-10zm4.293 10.707c-.39.39-.39 1.023 0 1.414.195.196.45.293.707.293s.512-.097.707-.293l3-3c.39-.39.39-1.023 0-1.414l-3-3c-.78-.78-2.048-.78-2.828 0-.78.78-.78 2.047 0 2.827l1.293 1.293H6c-.553 0-1 .447-1 1s.447 1 1 1h6.586l-1.293 1.293c-.39.39-.39 1.024 0 1.414.195.196.45.293.707.293s.512-.097.707-.293l3-3c.39-.39.39-1.023 0-1.414l-3-3z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
