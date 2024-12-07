import React, { useState } from 'react'
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { LuUsers, LuArrowLeftCircle, LuArrowRightCircle } from "react-icons/lu";
import { BsDatabaseCheck } from "react-icons/bs";
import { GoArchive } from "react-icons/go";
import { HiOutlineCog } from "react-icons/hi";
import { BsQuestionSquare } from "react-icons/bs";
import { Link } from 'react-router-dom';
import '../style/SidebarStyle.css';
import Workspace from './Workspace';
import MainContent from '../pages/MainContent';

const Sidebar=()=> {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [itemActive, setItemActive] = useState('');

  const handleOpenSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }
  const handleItemActive = (itemName) => {
    setItemActive(itemName);
  }
  const handleStopPropagation = (e) => {
    e.stopPropagation();
  }

  return (
    <div className='layout-container'>
      <div
        className={`sidebar-container ${
          sidebarVisible ? 'show-sidebar' : 'close-sidebar'
        }`} 
        onClick={handleOpenSidebar}
      >
        <div className="sidebar-menu" onClick={handleStopPropagation}>
          <div className={`sidebar-main ${itemActive === 'workspace' ? 'active' : ''}`}
            onClick={()=> handleItemActive('workspace')}
          >
            <Link to='/'>
              <HiOutlineSquaresPlus className='sidebar-icon'/>
              {sidebarVisible && <h5>Workspace</h5>}
              <span className='tooltip'>Workspace</span>
            </Link>
          </div>
          <div className={`sidebar-main ${itemActive === 'member' ? 'active' : ''}`}
            onClick={()=> handleItemActive('member')}
          >
            <Link to='/member'>
              <LuUsers className='sidebar-icon'/>
              {sidebarVisible && <h5>Inod Member</h5>}
              <span className='tooltip'>Inod Member</span>
            </Link>
          </div>

          {/* MARKETING  */}
          <div className={`sidebar-main ${itemActive === 'marketing' ? 'active' : ''}`}
            onClick={()=> handleItemActive('marketing')}
          >
            <Link to='/marketing'>
              <BsDatabaseCheck className='sidebar-icon'/>
              {sidebarVisible && <h5>Data Marketing</h5>}
              <span className='tooltip'>Data Marketing</span>
            </Link>
          </div>
          <div className={`sidebar-main ${itemActive === 'archive' ? 'active' : ''}`}
            onClick={()=> handleItemActive('archive')}
          >
            <Link to='/archive-marketing'>
              <GoArchive className='sidebar-icon'/>
              {sidebarVisible && <h5>Archive Data</h5>}
              <span className='tooltip'>Archive Data</span>
            </Link>
          </div>

          {/* ACTION */}
          <div className={`sidebar-main ${itemActive === 'setting' ? 'active' : ''}`}
            onClick={()=> handleItemActive('setting')}
          >
            <Link to='/member'>
              <HiOutlineCog className='sidebar-icon'/>
              {sidebarVisible && <h5>Setting</h5>}
              <span className='tooltip'>Setting</span>
            </Link>
          </div>
          <div className={`sidebar-main ${itemActive === 'faq' ? 'active' : ''}`}
            onClick={()=> handleItemActive('faq')}
          >
            <Link to='/member'>
              <BsQuestionSquare className='sidebar-icon'/>
              {sidebarVisible && <h5>FaQ</h5>}
              <span className='tooltip'>FaQ</span>
            </Link>
          </div>

          <button onClick={handleOpenSidebar}>
            {sidebarVisible ? <LuArrowLeftCircle/>:<LuArrowRightCircle/>}
          </button>
        </div>  
      </div>
    </div>
  )
}

export default Sidebar