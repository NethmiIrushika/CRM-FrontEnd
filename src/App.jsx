import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import CrProtoType from './component/crProtoType';
import Home from './home';
import UserLogin from'./users/userLogin'
import UserRegistration from './users/userRegistration'
import Dashboard from './users/dashboard';
import UserAccount from './component/userAccount';
import Crview from './component/viewCr'
import CreateCr from './component/createCr'
import { ToastContainer } from 'react-toastify';
import AddUser from './component/addUser';
import Log from './component/log';


function App() {
  

  return (
    
      <div>
    <Router>
      <ToastContainer/>
          <Routes>
            <Route path="/" element={<Home />} />;
            <Route path="/UserLogin" element= {<UserLogin/>} />
            <Route path="/UserRegistration" element= {<UserRegistration/>}/>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="UserAccount" element={<UserAccount />} />
              <Route path="createCr" element={<CreateCr />} />
              <Route path="viewCr" element={<Crview/>}/>
              <Route path="addUser" element={<AddUser/>}/>
              <Route path="log" element={<Log/>}/>
              <Route path="crProtoType" element={<CrProtoType/>}/>
            </Route>
          </Routes>
        </Router>
      </div>    
  )
}

export default App
