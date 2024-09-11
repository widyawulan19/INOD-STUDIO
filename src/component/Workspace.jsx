import React, { useEffect, useState } from 'react'
import { getWorkspaces, createWorkspace, getBoardCountByWorkspace} from '../services/Api'
import { useNavigate } from 'react-router-dom';
import '../style/WorkspaceStyle.css'
import { BiSolidCalendarEdit } from "react-icons/bi";
import { HiPlus,HiOutlineX , HiDotsHorizontal, HiOutlineSearch, HiChevronDown, HiChevronRight} from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaTags,FaQuestion } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import moment from 'moment';


const Workspace=()=> {
    const [workspaces, setWorkspaces] = useState([]);
    //const [setWorkspace, setSelectedWorkspace] = useState(null)
    const [newWorkspace, setNewWorkspace] = useState({name:'', description:''});
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false)
    const [showAction, setShowAction] = useState(false)

    //show form
    const toggleFormVisibility = () => {
        setShowForm(!showForm)
    }

    //show action (titik tiga)
    const toggleActionVisibility = (event) => {
        event.stopPropagation();
        setShowAction(!showAction)
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
        setShowAction(false);
    }

    const handleNavigateToBoard = (workspaceId) => {
        navigate(`/workspaces/${workspaceId}/boards/`);
    }

  return (
        <div className='workspace-container'>
            <div className="workspace-title">
                <h4 style={{textAlign:'left', color:'black'}}>WORKSPACE DASHBOARD</h4>
                <div>
                    <HiOutlineSearch size={20} className='workspace-icons'/>
                    <IoMdNotificationsOutline size={20} className='workspace-icons'/>
                    <FaUserCircle size={25} className='workspace-icons-user'/>
                </div>
            </div>
            <div className='filter-button'>
                <h4>Filter by : </h4>
                <button className='filter'>Recent <HiChevronDown size={15} style={{marginLeft:'1vw'}}/></button>
                <button className='filter'>New <HiChevronDown size={15} style={{marginLeft:'1vw'}}/></button>
            </div>

            {/* WORKSPACE CARD */}
            <div className='workspace-grid' style={{textAlign:'left'}}>
                {workspaces.map((workspace) =>(
                    <div onClick={()=>handleNavigateToBoard(workspace.id)} key={workspace.id} className='workspace-card' >
                        {/* <h3 style={{textAlign:'right'}} onClick={toggleActionVisibility}></h3> */}
                        <h3 style={{display:'flex', justifyContent:'space-between'}}>{workspace.name} <HiDotsHorizontal/></h3>
                        <p style={{fontSize:'13px'}}>{workspace.description}</p>
                        <h5>Create by USERNAME</h5>
                        <div  className='action-workspace'>
                            <p style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px'}}><FaTags size={13} style={{marginRight:'0.5vw'}}/> {workspace.boardCount} Boards</p>
                            <p style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px'}}><BiSolidCalendarEdit size={15} style={{marginLeft:'1vw', marginRight:'0.5vw'}}/>
                                {moment(workspace.create_at).format('D MMMM YYYY')}
                            </p>
                            <button className='btn-workspace'><HiChevronRight size={20}/></button>
                        </div>
                        {/* <LuUsers/> 8 Members */}
                    </div>
                ))}
                <div className='workspace-card-input'>
                    Create your new workspace here!
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
                <div style={{display:'flex', alignItems:'flex-end', justifyContent:'flex-end'}}>
                    <button className='question-btn'><FaQuestion size={20}/></button>
                </div>
            </div>
        </div>
  )
}
 
export default Workspace

