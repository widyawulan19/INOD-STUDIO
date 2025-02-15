import React, { useState } from 'react'
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { LuUsers, LuArrowLeftCircle, LuArrowRightCircle } from "react-icons/lu";
import { BsDatabaseCheck } from "react-icons/bs";
import { GoArchive } from "react-icons/go";
import { HiOutlineCog } from "react-icons/hi";
import { BsQuestionSquare } from "react-icons/bs";
import { Link } from 'react-router-dom';
// import '../style/SidebarStyle.css';
import '../style/NewSidebarStyle.css';
import Workspace from './Workspace';
import MainContent from '../pages/MainContent';
import {Tooltip,tooltipClasses  } from '@mui/material';
import { styled } from '@mui/material';

//tooltip
const BootstrapTooltip = styled(({className, ...props}) =>(
  <Tooltip {...props} arrow classes={{popper: className}}/>
  ))(({theme}) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

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
        className={`sidebar-container ${sidebarVisible ? 'show-sidebar' : 'close-sidebar'}`}
        onClick={handleOpenSidebar}
      >
        <div className="sidebar-menu" onClick={handleStopPropagation}>
          {[
            { to: '/', icon: <HiOutlineSquaresPlus className='icon'/>, label: 'Workspace', name: 'workspace' },
            { to: '/member', icon: <LuUsers className='icon'/>, label: 'Inod Member', name: 'member' },
            { to: '/data-employee', icon: <LuUsers className='icon'/>, label: 'Data Employee', name: 'data-employee' },
            { to: '/new-marketing', icon: <BsDatabaseCheck className='icon'/>, label: 'Data Marketing', name: 'marketing' },
            { to: '/marketing-design', icon: <BsDatabaseCheck className='icon'/>, label: 'Marketing Design', name: 'marketing-design' },
            { to: '/archive-marketing', icon: <GoArchive className='icon'/>, label: 'Archive Data', name: 'archive' },
            { to: '/member', icon: <HiOutlineCog className='icon'/>, label: 'Setting', name: 'setting' },
            { to: '/', icon: <BsQuestionSquare className='icon'/>, label: 'FaQ', name: 'faq' },
          ].map((item) => (
            <div
              key={item.name}
              className={`sidebar-main ${itemActive === item.name ? 'active' : ''} ${sidebarVisible ? 'expanded' : 'collapsed'}`}
              onClick={() => handleItemActive(item.name)}
            >
              <Link to={item.to} className="sidebar-link">
                <BootstrapTooltip title={!sidebarVisible ? item.label : ''} placement="right">
                  <div className="sidebar-icon">{item.icon}</div>
                </BootstrapTooltip>
                {sidebarVisible && <h5 className="sidebar-label">{item.label}</h5>}
              </Link>
            </div>
          ))}

          <button className="toggle-btn" onClick={handleOpenSidebar}>
            {sidebarVisible ? <LuArrowLeftCircle /> : <LuArrowRightCircle />}
          </button>
        </div>
      </div>
    </div>
  );

  
}

export default Sidebar

// return (
  //   <div className='layout-container'>
  //     <div
  //       className={`sidebar-container ${
  //         sidebarVisible ? 'show-sidebar' : 'close-sidebar'
  //       }`} 
  //       onClick={handleOpenSidebar}
  //     >
  //       <div className="sidebar-menu" onClick={handleStopPropagation}>
  //         <div className={`sidebar-main ${itemActive === 'workspace' ? 'active' : ''}`}
  //           onClick={()=> handleItemActive('workspace')}
  //         >
  //           <Link to='/'>
  //             <HiOutlineSquaresPlus className='sidebar-icon'/>
  //             {sidebarVisible && <h5>Workspace</h5>}
  //             <span className='tooltip'>Workspace</span>
  //           </Link>
  //         </div>
  //         <div className={`sidebar-main ${itemActive === 'member' ? 'active' : ''}`}
  //           onClick={()=> handleItemActive('member')}
  //         >
  //           <Link to='/member'>
  //             <LuUsers className='sidebar-icon'/>
  //             {sidebarVisible && <h5>Inod Member</h5>}
  //             <span className='tooltip'>Inod Member</span>
  //           </Link>
  //         </div>
  //         <div className={`sidebar-main ${itemActive === 'data-employee' ? 'active' : ''}`}
  //           onClick={()=> handleItemActive('data-employee')}
  //         >
  //           <Link to='/data-employee'>
  //             <LuUsers className='sidebar-icon'/>
  //             {sidebarVisible && <h5>Data Employee</h5>}
  //             <span className='tooltip'>Data Employeer</span>
  //           </Link>
  //         </div>

  //         {/* MARKETING  */}
  //         <div className={`sidebar-main ${itemActive === 'marketing' ? 'active' : ''}`}
  //           onClick={()=> handleItemActive('new-marketing')}
  //         >
  //           <Link to='/new-marketing'>
  //             <BsDatabaseCheck className='sidebar-icon'/>
  //             {sidebarVisible && <h5>Data Marketing</h5>}
  //             <span className='tooltip'>Data Marketing</span>
  //           </Link>
  //         </div>
  //         <div className={`sidebar-main ${itemActive === 'marketing-design' ? 'active' : ''}`}
  //           onClick={()=> handleItemActive('marketing-design')}
  //         >
  //           <Link to='/marketing-design'>
  //             <BsDatabaseCheck className='sidebar-icon'/>
  //             {sidebarVisible && <h5>Marketing Design</h5>}
  //             <span className='tooltip'>Data Marketing Design</span>
  //           </Link>
  //         </div>
  //         <div className={`sidebar-main ${itemActive === 'archive' ? 'active' : ''}`}
  //           onClick={()=> handleItemActive('archive')}
  //         >
  //           <Link to='/archive-marketing'>
  //             <GoArchive className='sidebar-icon'/>
  //             {sidebarVisible && <h5>Archive Data</h5>}
  //             <span className='tooltip'>Archive Data</span>
  //           </Link>
  //         </div>

  //         {/* ACTION */}
  //         <div className={`sidebar-main ${itemActive === 'setting' ? 'active' : ''}`}
  //           onClick={()=> handleItemActive('setting')}
  //         >
  //           <Link to='/member'>
  //             <HiOutlineCog className='sidebar-icon'/>
  //             {sidebarVisible && <h5>Setting</h5>}
  //             <span className='tooltip'>Setting</span>
  //           </Link>
  //         </div>
  //         <div className={`sidebar-main ${itemActive === 'faq' ? 'active' : ''}`}
  //           onClick={()=> handleItemActive('faq')}
  //         >
  //           <Link to='/'>
  //             <BsQuestionSquare className='sidebar-icon'/>
  //             {sidebarVisible && <h5>FaQ</h5>}
  //             <span className='tooltip'>FaQ</span>
  //           </Link>
  //         </div>

  //         <button onClick={handleOpenSidebar}>
  //           {sidebarVisible ? <LuArrowLeftCircle/>:<LuArrowRightCircle/>}
  //         </button>
  //       </div>  
  //     </div>
  //   </div>
  // )