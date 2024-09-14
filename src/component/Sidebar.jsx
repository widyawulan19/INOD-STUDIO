import React, { useEffect, useState } from 'react'
// import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight,HiOutlineCog,HiArchive, HiInbox, HiShoppingBag, HiTable, HiUser, HiChevronDown, HiChevronUp,HiArrowCircleRight, HiArrowCircleLeft, HiPlus,HiDesktopComputer, HiOutlineServer } from "react-icons/hi";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import '../style/SidebarStyle.css'
import { LuUsers, LuLayers } from "react-icons/lu";
import { getWorkspaces } from '../services/Api';
import { AiOutlineDatabase } from "react-icons/ai"
import logo from '../assets/LOGO1.png'

const Sidebar = ()=> {
  const [showSidebarMenu, setShowSidebarMenu] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showAnotherMenu, setShowAnotherMenu] = useState(false) //member
  const [showArchiveMenu, setShowArchiveMenu] = useState(false) //archive
  const [showMarketingData, setShowMarketingData ] = useState(false) //marketing
  const [showMarketingAction, setShowMarketingAction] = useState(false)//marketing archive
  const [showAction, setShowAction] = useState(false)//toggle action

  const toggleFormVisibility = () =>{
    setShowSidebar(!showSidebar);
  }

  //member
  const toggleFormVisibility2 = () => {
    setShowAnotherMenu(!showAnotherMenu);
  }
  
  //action
  const toggleVisibilityAction = () => {
    setShowArchiveMenu(!showArchiveMenu);
  }

  const toggleSidebarMenu = () => {
    setShowSidebarMenu(!showSidebarMenu)
  }

  // Marketing data
  const toggleMarketingData = () => {
    setShowMarketingData(!showMarketingData);
  }
  //marketing archive
  const toggleMarketingArchive = () => {
    setShowMarketingAction(!showMarketingAction);
  }

  //action
  const toggleAction = () => {
    setShowAction(!showAction)
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
          <img src={logo} style={{width:'100%'}} alt="" />
          <a href="#" className='sidebar-item' style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{fontWeight:'bold'}}>
              {!showSidebarMenu && 'INOD DASHBOARD'}
            </div>
            {showSidebarMenu ? (
              <HiArrowCircleRight onClick={toggleSidebarMenu} size={25} className='icon-dash'/>
            ):(
              <HiArrowCircleLeft onClick={toggleSidebarMenu} size={25}/>
            )}
          </a>
          <div className='sidebar-collapse'>
              <div className="sidebar-label" onClick={toggleFormVisibility}>
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

              <div className='sidebar-label' onClick={toggleFormVisibility2}>
                <div className='sidebar-item' style={{textAlign:'left', paddingLeft:'0'}}>
                    <LuUsers className='icon'/>
                    {!showSidebarMenu && <span className='menu-title'>Inod Member</span>}
                    {!showSidebarMenu && (
                      showAnotherMenu?
                      (<HiChevronUp className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto' }}/>
                      ):(
                        <HiChevronDown className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto' }}/>
                      )
                    )}
                </div>
              </div>
              {showAnotherMenu && (
                <div className='dropdown-menu'>
                    <h5>Produser</h5>
                    <h5>Kepala Divisi</h5>
                </div>
              )}

              <div className='sidebar-label' onClick={toggleVisibilityAction}>
                <div className='sidebar-item' style={{textAlign:'left', paddingLeft:'0'}}>
                  <LuLayers className='icon'/>
                  {!showSidebarMenu && <span className='menu-title'>Action</span>}
                  {!showSidebarMenu && (
                      showArchiveMenu?
                      (<HiChevronUp className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto' }}/>
                      ):(
                        <HiChevronDown className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto' }}/>
                      )
                    )}
                </div>
              </div>
              {showArchiveMenu && (
                <div className='dropdown-menu'>
                    <h5>Archive</h5>
                    <h5>Another archive</h5>
                </div>
              )}
              
          
          {/* MARKETING */}

          <div className='sidebar-marketing'>
            {/* <h5 style={{textAlign:'left'}}>MARKETING</h5> */}
            <h5 style={{textAlign:'left'}}>
              {!showSidebarMenu ? 'MARKETING':''}
            </h5>
              <div className='sidebar-label' onClick={toggleMarketingData}>
                <div className='sidebar-item' style={{textAlign:'left', padding:'0'}}>
                  <AiOutlineDatabase className='icon'/>
                  {!showSidebarMenu && <span className='menu-title'>Data Marketing</span>}
                  {!showSidebarMenu && (
                      showMarketingData?
                      (<HiChevronUp className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto' }}/>
                      ):(
                        <HiChevronDown className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto' }}/>
                      )
                    )}
                </div>
            </div>
            {showMarketingData && (
              <div className='dropdown-menu'>
                <h5>Data Marketing 1</h5>
                <h5>Data Marketing 2</h5>
                <h5>Data Marketing 3</h5>
              </div>
            )} 

            <div className='sidebar-label' onClick={toggleMarketingArchive}>
              <div className='sidebar-item' style={{textAlign:'left', padding:'0'}}>
                <HiArchive className='icon'/>
                {!showSidebarMenu && <span className='menu-title'>Archive Data Marketing</span>}
                  {!showSidebarMenu && (
                      showMarketingAction?
                      (<HiChevronUp className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto' }}/>
                      ):(
                        <HiChevronDown className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto' }}/>
                      )
                    )}
              </div>
            </div>
            {showMarketingAction && (
              <div className='dropdown-menu'>
                <h5>Archive data 1</h5>
                <h5>Archive data 2</h5>
                <h5></h5>
              </div>
            )}
          </div>
          {/* ACTION */}
          <div className='sidebar-action' onClick={toggleAction}>
            <h5 style={{textAlign:'left'}}>
                {!showSidebarMenu ? 'ACTION' : ''}
            </h5>
            <div className="sidebar-label" style={{marginBottom:'1vh'}}>
              <div className="sidebar-item" style={{textAlign:'left', padding:'0'}}>
                <HiOutlineCog className='icon'/>
                {!showSidebarMenu && <span className='menu-title'>Setting</span>}
              </div>
            </div>
            <div className="sidebar-label" >
              <div className="sidebar-item" style={{textAlign:'left', padding:'0'}}>
                <HiArchive className='icon'/>
                {!showSidebarMenu && <span className='menu-title'>Archive</span>}
                {!showSidebarMenu && (
                  showAction ?
                  (<HiChevronUp className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto' }}/>
                  ):(
                    <HiChevronDown className='icon-chevron' style={{visibility: showSidebarMenu ? 'hidden': 'visible', marginLeft:'auto' }}/>
                  )
                )}
              </div>
            </div>
            {showAction && (
              <div className="dropdown-menu">
                <h5 className='dropdown-h5'>
                  <HiDesktopComputer className='icon-action'/>
                  {!showSidebarMenu && <span>Workspace</span>}
                  
                </h5>
                <h5 className='dropdown-h5'>
                  <MdOutlineDashboardCustomize className='icon-action'/>
                  {!showSidebarMenu && <span> Board</span>}
                </h5>
                <h5 className='dropdown-h5'>
                  <HiOutlineServer className='icon-action'/>
                  {!showSidebarMenu && <span>list</span>}
                </h5>
                <h5 className='dropdown-h5'>
                  <HiOutlineCreditCard className='icon-action'/>
                  {!showSidebarMenu && <span>Card</span>}
                </h5>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Sidebar