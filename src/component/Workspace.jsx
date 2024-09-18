import React, { useEffect, useState } from 'react'
import { getWorkspaces, createWorkspace, getBoardCountByWorkspace} from '../services/Api'
import { useNavigate } from 'react-router-dom';
import '../style/WorkspaceStyle.css'
import { BiSolidCalendarEdit } from "react-icons/bi";
import { HiArchive,HiPlus,HiOutlineX , HiDotsHorizontal, HiOutlineSearch, HiChevronDown, HiChevronRight} from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaTags } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import moment from 'moment';
import Background from './Background';
// import img1 from '../assets/bg/bg2.jpeg';


const Workspace=()=> {
    const [workspaces, setWorkspaces] = useState([]);
    const [newWorkspace, setNewWorkspace] = useState({name:'', description:''});
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false)
    const [showAction, setShowAction] = useState(false)
    const [backgroundImage, setBackgroundImage] = useState('');

    //show form
    const toggleFormVisibility = () => {
        setShowForm(!showForm)
    }

    //show action (titik tiga) show spesific action dropdown
    const toggleActionVisibility = (workspaceId,event) => {
        event.stopPropagation();
        setShowAction(showAction === workspaceId ? null : workspaceId);
    }

    useEffect(()=>{
        loadWorkspaces();
    }, [])


    const loadWorkspaces = async () => {
        try{
            const response = await getWorkspaces();
            //setWorkspaces(response.data)
            const workspacesData = response.data;

            const workspacesWithBoardCounts = await Promise.all(workspacesData.map(async(workspace)=>{
                const boardsResponse = await getBoardCountByWorkspace(workspace.id)
                return{
                    ...workspace,
                    boardCount: boardsResponse.data.board_count //untuk menjumlahkan jumlah boards pada workspace
                };
            }));
            setWorkspaces(workspacesWithBoardCounts);
        } catch(error){
            console.error('Error loading workspace', error)
        }
    }

    const handleCreateWorkspace = async()=> {
        await createWorkspace(newWorkspace);
        loadWorkspaces();
        setShowForm(false);
        // setShowAction(false);
    }

    const handleNavigateToBoard = (workspaceId) => {
        navigate(`/workspaces/${workspaceId}/boards/`);
    }

    //function to handle delet or archive workspace
    const handleAction = (workspaceId, action) => {
        console.log(`Action: ${action} for workspace: ${workspaceId}`);
        setShowAction(null); //hide dropdown after action
    }

    //function to handle Background
    const handleBackgroundChange = (newBackground) => {
        setBackgroundImage(newBackground);
    }

  return (
        <div className='workspace-container' 
            style={{
               backgroundImage: `url(${backgroundImage})`, backgroundSize:'cover'
            }}
        >
            <div className="workspace-title">
                <h4 style={{textAlign:'left', color:'white'}}>WORKSPACE DASHBOARD</h4>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <Background onChangeBackground={handleBackgroundChange}/>
                    <HiOutlineSearch size={20} className='workspace-icons'/>
                    <IoMdNotificationsOutline size={20} className='workspace-icons'/>
                    <FaUserCircle size={25} className='workspace-icons-user'/>

                </div>
            </div>
            <div className='filter-button'>
                <h4 style={{color:'white'}}>Filter by : </h4>
                {/* <button className='filter'>Recent <HiChevronDown size={15} style={{marginLeft:'1vw'}}/></button>
                <button className='filter'>New <HiChevronDown size={15} style={{marginLeft:'1vw'}}/></button> */}
            </div>

            {/* WORKSPACE CARD */}
                <div className='workspace-grid' style={{textAlign:'left'}}>
                    {workspaces.map((workspace) =>(
                        <div onClick={()=>handleNavigateToBoard(workspace.id)} key={workspace.id} className='workspace-card' >
                            {/* <h3 style={{textAlign:'right'}} onClick={toggleActionVisibility}></h3> */}
                            <h3 style={{display:'flex', justifyContent:'space-between'}}>
                                {workspace.name} 
                                <HiDotsHorizontal 
                                    className='dot-btn' 
                                    onClick={(e)=> toggleActionVisibility(workspace.id, e)}/>
                            </h3>

                            {showAction === workspace.id && (
                                <div className='dropdown-menu-action'>
                                    <ul className='dropdown-ul'>
                                        Actions
                                        <li onClick={() => handleAction(workspace.id, 'delete')} className='dropdown-li'>
                                            <AiFillDelete  className='ikon' size={20} />
                                            <div>
                                                Delete <br />
                                                <span style={{fontSize:'10px',fontWeight:'normal', }}>Delete workspace</span>
                                            </div>
                                        </li>
                                        <li onClick={() => handleAction(workspace.id, 'archive')} className='dropdown-li' >
                                            <HiArchive  className='ikon' size={20} />
                                            <div>
                                                Archive <br />
                                                <span style={{fontSize:'10px', fontWeight:'normal'}}>Archive your workspace</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                             )}

                            <p style={{fontSize:'13px'}}>{workspace.description}</p>
                            <h5>Create by USERNAME</h5>
                            <div  className='action-workspace'>
                                <p style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px'}}><FaTags size={13} style={{marginRight:'0.5vw'}}/> {workspace.boardCount} Boards</p>
                                <p style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px'}}><BiSolidCalendarEdit size={15} style={{marginLeft:'1vw', marginRight:'0.5vw'}}/>
                                    {moment(workspace.create_at).format('D MMMM YYYY')}
                                </p>
                                <button className='btn-workspace'><HiChevronRight size={20}/></button>
                            </div>

                        </div>
                    ))}
                    <div className='workspace-card-input'>
                        {/* Create your new workspace here! */}
                        <button className='new' onClick={toggleFormVisibility}>
                            {showForm ?
                        (<><HiOutlineX size={13} style={{marginRight:'1vh'}}/>Cancle</>): (<><HiPlus size={13} style={{marginRight:'1vh'}}/> NEW WORKSPACE</>)    
                        }
                        </button>
                        {showForm && (
                            <div className='workspace-form'>
                            <input 
                                type="text"
                                placeholder='Workspace name'
                                value={newWorkspace.name}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value})}
                            />
                            <input 
                                type="text"
                                placeholder='Description'
                                value={newWorkspace.description}
                                onChange={(e)=> setNewWorkspace({ ...newWorkspace, description: e.target.value})}
                            />
                            <button onClick={handleCreateWorkspace}>Add Workspace</button>
                        </div>
                        )}
                    </div>
                </div>
        </div>
  )
}
 
export default Workspace


/*
<ul>
                                        <li onClick={() => handleAction(workspace.id, 'delete')}
                                            className='dropdown-li'    
                                        >
                                            <AiFillDelete  size={20} style={{marginRight:'1vh', color:'#6b1c14'}}/>
                                            Delete
                                        </li>
                                        <li onClick={() => handleAction(workspace.id, 'archive')}
                                            className='dropdown-li'
                                        >
                                            <HiArchive size={20} style={{marginRight:'1vh', color:'#6b1c14'}}/>
                                            Archive
                                        </li>
                                    </ul>
*/