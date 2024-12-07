import React, { useState } from 'react'
import Navbar from '../component/Navbar'
import '../style/HomeStyle.css';
import Sidebar from '../component/Sidebar';
import '../style/SidebarStyle.css'
import { useParams } from 'react-router-dom';
import Workspace from '../component/Workspace';
import MainContent from './MainContent';
// import Workspace from '../component/Workspace';

const Home=()=> {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  return (
    <div className='home-container'>
      <Navbar/>
      <div className="main">
        <Sidebar/>
        <MainContent/>    
      </div>
    </div>
  )
}

export default Home