import React, { useEffect, useState } from 'react'
// import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight,HiOutlineCog,HiArchive, HiInbox, HiShoppingBag, HiTable, HiUser, HiChevronDown, HiChevronUp,HiArrowCircleRight, HiArrowCircleLeft, HiPlus,HiDesktopComputer } from "react-icons/hi";
import '../style/SidebarStyle.css'
import { LuUsers, LuLayers } from "react-icons/lu";
import { getWorkspaces } from '../services/Api';
import { AiOutlineDatabase } from "react-icons/ai"

const Sidebar = ()=> {
  const [showSidebarMenu, setShowSidebarMenu] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const toggleFormVisibility = () =>{
    setShowSidebar(!showSidebar);
  }
  
  const toggleSidebarMenu = () => {
    setShowSidebarMenu(!showSidebarMenu)
  }

  //workspace
  const [workspace, setWorkspace] = useState([]);
  //const [newWorkspace, setNewWorkspace] = useState({name:'', description:''})

  //load workspaces
  useEffect(()=>{
    const loadWorkspace = async () => {
      const response = await getWorkspaces();
      setWorkspace(response.data)
    };
    loadWorkspace();
  },[])

  return ( 
    <div className={`sidebar ${showSidebarMenu ? 'collapsed': ''}`} aria-label="Sidebar with multi-level dropdown example">
      <div className="sidebar-items">
        <div className="sidebar-item-group">
          <a href="#" className='sidebar-item' style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{fontWeight:'bold'}}>
              {!showSidebarMenu && 'INOD DASHBOARD'}
            </div>
            {showSidebarMenu ? (
              <HiArrowCircleRight onClick={toggleSidebarMenu} size={25}/>
            ):(
              <HiArrowCircleLeft onClick={toggleSidebarMenu} size={25}/>
            )}
          </a>
          <div className='sidebar-collapse'>
              <div className="sidebar-label" onClick={toggleFormVisibility}>
                {/* <HiShoppingBag className='icon'/>
                E-Commerce */}
                <div style={{textAlign:'left', paddingLeft:'0'}} className='sidebar-item'>
                  <HiDesktopComputer className='icon'/>
                  {!showSidebarMenu && <span className='menu-title'>Workspace</span>}
                  {!showSidebarMenu && ( 
                    showSidebar? 
                    (<HiChevronUp className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto'}}/>
                    ):(
                    <HiChevronDown className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto'}}/>)
                    )}
                </div>
              </div>
              {showSidebar && (
                <div className="sidebar-collapse-items">
                  {workspace.length > 0 ? (
                    workspace.map((ws) => (
                      <a href='#' key={ws.id} className='sidebar-item'>{ws.name}</a>
                    ))
                  ):(
                    <div className="sidebar-item">No workspace available</div>
                  )}
              </div>
              )}
              </div>
          
          <a href="" className={`sidebar-item ${showSidebarMenu ? 'collapsed' : ''}`}>
            <LuUsers className="icon" />
            {!showSidebarMenu &&'Inod Member'}
            <HiChevronDown className='icon-chevron'/>
          </a>
          <a href=""  className={`sidebar-item ${showSidebarMenu ? 'collapsed' : ''}`}>
            <LuLayers className="icon" />
            {!showSidebarMenu && 'Actions'}
            <HiChevronDown className='icon-chevron'/>
          </a>
          
          {/* MARKETING */}
          <div className='sidebar-marketing'>
            <h5 style={{textAlign:'left'}}>MARKETING</h5>
            <a href="" className='sidebar-item'>
              <AiOutlineDatabase className='icon'/>
              {!showSidebarMenu && 'Data Marketing'}
            </a>
            <a href="" className='sidebar-item'>
              <HiArchive className='icon'/>
              {!showSidebarMenu && 'Archive Data Marketing'}
            </a>
          </div>
          {/* ACTION */}
          <div className="sidebar-item-group2">
            <h5 style={{textAlign:'left'}}>ACTIONS</h5>
            <a href="" className='sidebar-item'>
              <HiOutlineCog className='icon'/>
              {!showSidebarMenu && 'Setting'}
            </a>
            <a href="" className='sidebar-item'>
              <HiArchive className='icon'/>
              {!showSidebarMenu && 'Archive'}
            </a>
            {/* <button className='addWorkspace'> <HiPlus size={10} style={{fontWeight:'bold'}}/> Add New Workspace</button> */}
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Sidebar