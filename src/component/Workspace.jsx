import React, { useEffect, useState } from 'react'
import { getWorkspaces, createWorkspace, getBoardCountByWorkspace, getAllImage,deleteWorkspace,archiveWorkspace, getWorkspaceById} from '../services/Api'
import { useNavigate } from 'react-router-dom';
import '../style/WorkspaceStyle.css'
import { BiSolidCalendarEdit } from "react-icons/bi";
import { HiArchive,HiPlus,HiOutlineX , HiDotsHorizontal, HiOutlineSearch,HiQrcode} from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { HiOutlineCog } from "react-icons/hi";
import { BsArchive } from "react-icons/bs";
import { FaTags } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import moment from 'moment';
import CheckIcon from '@mui/icons-material/Check';
import { AlertTitle} from '@mui/material';
import WorkspaceEdit from './WorkspaceEdit';
import '../style/WorkspaceEdit.css'
import DeleteWorkspace from '../popup/DeleteWorkspace';
import ArchiveWorkspace from '../popup/ArchiveWorkspace';
import { HiOutlineSquaresPlus,HiMiniCalendarDays } from "react-icons/hi2";
import Greeting from './Greeting';
import { TiPin,TiPinOutline } from "react-icons/ti";
import { CiFileOn } from "react-icons/ci";

 


const Workspace=({workspaceId})=> {
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspace, setSelectedWorkspace]= useState(null);
    const [error, setError] = useState(null);
    const [newWorkspace, setNewWorkspace] = useState({name:'', description:''});
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false)
    const [showAction, setShowAction] = useState(false)
    // const [backgroundImage, setBackgroundImage] = useState([]);
    const [showBg, setShowBg] = useState(false);
    const [selectBg, setSelectBg] = useState(null);
    const [alert, setAlert] = useState({show:false, message:'', severity:''})
    //delete confirm
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
    //edit 
    const [editingWorkspace, setEditingWorkspace] = useState(null);
    const [isEditingModalVisible, setIsEditModalVisible] = useState(false);
    //background selector
    const [backgroundImage, setBackgroundImage] = useState(null)
    //gretting
    const [isGreeting, setIsGreeting] = useState(true);
   
    //gretting
    const handleGretting = () =>{
        setIsGreeting(!isGreeting);
    }
    

    //edit
    const handleEditWorkspaceClick = (workspaceId) =>{
        setEditingWorkspace(workspaceId);
        setIsEditModalVisible(true);
        console.log('Workspace ID:', workspaceId)
    };

    const handleCloseEditModal = () =>{
        setEditingWorkspace(null);
        setIsEditModalVisible(false)
    }
 
    //delete
    const handleDeleteClick = (workspaceId) => {
        setWorkspaceToDelete(workspaceId);
        setIsPopupVisible(true);
    }

    const handleConfirmDelete = async() =>{
        if(workspaceToDelete){
            const deleteResponse = await handleDelete(workspaceToDelete);
            setIsPopupVisible(false);
            setWorkspaceToDelete(null);
            if(deleteResponse){
                setAlert({show:true, message:'Successfully delete your workspace', severity:'success'})
            }else{
                setAlert({show:true, message:'Failed to delete workspace', severity:'error'})
            }
        }
    }

    const handleCancleDelete = () => {
        setIsPopupVisible(false);
        setWorkspaceToDelete(null);
    }

    //delete
    const handleDelete = async (id) => {
        try{
            await deleteWorkspace(id);
            loadWorkspaces();
            //hide the alert after 3 second
            setTimeout(()=>{
                setAlert({...alert, show:false})
            },3000)
            return true;
        }catch(error){
            console.error('Error deleting workspace:', error);
            //hide the alert after 3 second
            setTimeout(()=>{
                setAlert({...alert,show:false})
            },3000);
            return false;
        }
    }
    //delete confirm end 

    //show form for bg
    const toggleBgVisibility = (workspaceId) => {
        // setSelectedWorkspace(workspaceId); //ubah 1
        setShowBg(!showBg)
    }
    const handleBgSelect = (bg) =>{
       setSelectBg(bg);
       setShowBg(false); 
    }

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

    useEffect(()=>{
        const loadImages = async () => {
            try{
                const response = await getAllImage();
                setBackgroundImage(response.data);
            }catch(error){
                console.error('Error loading images', error);
            }
        };
        loadImages()
    }, [])

    const loadWorkspaces = async () => {
        try{
            const response = await getWorkspaces();
            setWorkspaces(response.data);
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


    useEffect(()=>{
        const fetchWorkspace = async () =>{
            try{
                const response = await getWorkspaceById(workspaceId);
                setWorkspaces(response.data);
            }catch(error){
                console.error('Error fetching workspace by ID', error);
            }
        }
        fetchWorkspace();
    },[workspaceId])

    const [alert3, setAlert3] = useState({ show: false, message: '', severity: '' });
    useEffect(()=>{
        console.log('Alert state updated:', alert3)
    }, [alert3])

    const handleCreateWorkspace = async () => {
        try {
            
            const successResponse = await createWorkspace(newWorkspace);
            console.log('API response:', successResponse);

            if (successResponse && successResponse.status === 200) {
                setAlert3({ show: true, message: 'Success create new workspace', severity: 'success' });
    
                // Gunakan callback untuk memastikan state terbaru digunakan
                setTimeout(() => {
                    setAlert3(prevState => ({ ...prevState, show: false }));
                }, 5000);
                console.log('Workspace created successfully');
            } else {
                setAlert3({ show: true, message: 'Failed to create workspace', severity: 'error' });
                setTimeout(() => {
                    setAlert3(prevState => ({ ...prevState, show: false }));
                }, 3000);
            }
    
            loadWorkspaces(); // Reload daftar workspaces
            setNewWorkspace({ name: '', description: '' }); // Reset form
            setShowForm(false); // Menyembunyikan form setelah sukses
        } catch (error) {
            setAlert3({ show: true, message: 'Error occurred while creating workspace', severity: 'error' });
            setTimeout(() => {
                setAlert3(prevState => ({ ...prevState, show: false }));
            }, 3000);
            console.error('Error creating workspace', error);
        }
    };
    
    const [alert4, setAlert4] = useState({show:false, message:'', severity:''})
    const handleSuccessAlert = () =>{
        setAlert4({show:true, message:'success add new workspace', severity:'success'})
        setTimeout(() => {
            setAlert3(prevState => ({ ...prevState, show: false }));
        }, 3000);
    }


    //testing alert
    const [alert2, setAlert2] = useState({show:false, message:'', severity:''})
    const handleTestingBtn = () => {
        // setAlert2(!alert2);
        setAlert2({show:true, message:'success clicked', severity:'success'})
        setTimeout(() => {
            setAlert2({...alert2, show:false})
        },5000)
    }


    //archive

    //archive confirm
    const [isArchivePopupVisible, setIsArchivePopupVisible]= useState(false);
    const [alert5, setAlert5] = useState({show:false, message:'', severity:''})
    const handleConfirmArchive = async(id) =>{
        setIsArchivePopupVisible(false);
            try{
                await archiveWorkspace(id);
                // window.alert(`Workspace with id ${id} has been successfuly archived`);
                setAlert5({show:true, message:`Workspace has been sucessuly archived`, severity:'success'})
                setTimeout(()=>{
                    setAlert5(prevState => ({ ...prevState, show:false}))
                }, 5000)
                loadWorkspaces();
            } catch (error) {
                // window.alert('Failed to archive workspace. Please try again later.');
                setAlert5({show:true, message:'Failed to archive workspace. Pelase try again later'})
                setTimeout(()=>{
                    setAlert5(prevState => ({ ...prevState, show:false}))
                }, 5000)
            }
    };
    useEffect(()=>{
        loadWorkspaces();
    },[])

    const handleArchive = () => {
        setIsArchivePopupVisible(true);
    }

    const handleCancleArchive = () => {
        setIsArchivePopupVisible(false)
    }

    const handleNavigateToBoard = (workspaceId) => {
        navigate(`/workspaces/${workspaceId}/boards/`);
    }


  return (
    <div className='workspace-container' 
    style={{
        backgroundImage: selectBg ? `url(${selectBg.image_url})`: 'none' ,
        backgroundSize: 'cover', 
        backgroundPosition:'center',
        }} 
    >
            <div className="workspace-title">
                <div className="workspace-title-navigation">
                    <button>
                        <HiOutlineSquaresPlus style={{marginRight:'4px'}}/> 
                        Workspace
                    </button>
                </div>
                <div style={{display:'flex', flexDirection:'column', height:'100%', marginTop:'0'}}>
                    <div className='gretting-setting'>
                        <div className="button-create">
                            <button className='new' onClick={toggleFormVisibility}>
                                {showForm ?
                            (<><HiOutlineX size={10} style={{marginRight:'5px'}}/>Cancle</>): (<><HiPlus size={10} style={{marginRight:'5px'}}/> New Workspace</>)    
                            }
                            </button>   
                        </div>
                        |
                        <button onClick={handleGretting}>
                            Gretting 
                            <HiOutlineCog style={{marginLeft:'5px'}}/>
                        </button>
                    </div>
                </div>
            </div>
            {isGreeting && (
                <div>
                    <Greeting/>
                </div>
            )}

            {alert.show && (
                <AlertTitle
                    icon={<CheckIcon fontSize='20'/>}
                    severity={alert.severity}
                    style={{marginBottom:'20px'}}
                >
                    {alert.message}
                </AlertTitle>
            )}

            {/* WORKSPACE CARD */}
                <div className='workspace-grid' style={{textAlign:'left',}}>
                    {workspaces.map((workspace) =>(
                        <div onClick={()=>handleNavigateToBoard(workspace.id)} key={workspace.id} className='workspace-card' >
                            <div className='workspace-card-title'>
                                <h4 style={{display:'flex', justifyContent:'space-between'}}>
                                    {/* {workspace.name}  */}
                                    <TiPinOutline size={20} style={{color:'#6b1c14'}}/>
                                </h4>
                                <div className="tooltip-container">
                                    <HiDotsHorizontal 
                                        className='card-btn'
                                        // data-tooltip="More Setting" 
                                        onClick={(e)=> {e.stopPropagation(); toggleActionVisibility(workspace.id, e)}}
                                    />
                                    <span className='tooltip-text'>More Settings</span>
                                </div>
                            </div>
                            <hr style={{marginTop:'0px', border:'0.2px solid rgb(232, 232, 232)', height:'0.2px'}}/>
 
                            {showAction === workspace.id && (
                                <div className='dropdown-menu-action'>
                                    <h5>View</h5>
                                    <div className="dropdown-container">
                                      <div className="action-btn">
                                            <FaRegEdit className='ikon' />
                                            <button
                                                onClick={(e)=> {e.stopPropagation(); handleEditWorkspaceClick(workspace)}}
                                            >
                                                Edit Workspace
                                            </button>
                                        </div>
                                        <div className="action-btn">
                                            <BsArchive className='ikon'/>
                                            <button
                                                onClick={(e)=>{e.stopPropagation(); handleArchive(workspace.id)}}
                                            >
                                                Archive Workspace
                                            </button>
                                        </div>
                                        <div className="action-btn-remove">
                                            <AiOutlineDelete className='ikon-remove'/>
                                            <button
                                                onClick={(e)=> {e.stopPropagation(); handleDeleteClick(workspace.id)}}
                                            >
                                                Delete Workspace
                                            </button>
                                        </div>
                                    </div>
                                </div>
                             )}

                             <div className='workspace-card-main'>
                                <div className="workspace-card-mid">
                                    <h4 style={{marginTop:'0', marginBottom:'0'}}>{workspace.name}</h4>
                                    <p>{workspace.description}</p>
                                </div>
                                <div className='workspace-card-bottom'>
                                    <button>
                                        <FaTags className='card-icon'/>
                                        {workspace.boardCount} Boards
                                    </button>
                                    <button>
                                        <HiMiniCalendarDays className='card-icon'/>
                                        {moment(workspace.create_at).format('D MMMM YYYY')}
                                    </button>
                                </div>
                             </div>
                        </div>
                    ))}

                    {showForm && (
                        <div className="popup-overlay-create-card">
                        <div className="popup-content-create-card">
                            <div className="header-popup-create">
                                <h5>Create Workspace</h5>
                                <IoCloseOutline onClick={()=> setShowForm(false)} style={{color:'grey'}} size={20}/>
                            </div>
                            <div className="workspace-form-create-card">
                                <div className="input-group">
                                    {/* <label>Workspace Name</label> */}
                                    <input 
                                        type="text"
                                        value={newWorkspace.name}
                                        onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                                        className="input-field"
                                        placeholder='WORKSPACE NAME'
                                    />
                                </div>
                                <div className="input-group-desc">
                                    {/* <label>Workspace Description</label> */}
                                    <CiFileOn size={15} style={{color:'grey', marginRight:'5px'}}/>
                                    <input 
                                        type="text"
                                        value={newWorkspace.description}
                                        onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                                        className="input-field"
                                        placeholder='Workspace description'
                                    />
                                </div>
                            </div>
                                <div className="button-group">
                                    <button onClick={handleCreateWorkspace}>Create Workspace</button>
                                    {/* <button onClick={() => setShowForm(false)}>Cancel</button> */}
                                </div>
                           
                        </div>
                    </div>
                    )}


                    {/* <div className='workspace-card-input'>
                        <div className="workspace-create-form">
                            {showForm && (
                                <div className='workspace-form'>
                                    <div className='input-group'>
                                        Workspace Name 
                                        <input 
                                            type="text"
                                            value={newWorkspace.name}
                                            onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value})}
                                            className='input-field'
                                        />
                                    </div>
                                    <div className='input-group' >
                                        Workspace Description
                                        <input 
                                            type="text"
                                            value={newWorkspace.description}
                                            onChange={(e)=> setNewWorkspace({ ...newWorkspace, description: e.target.value})}
                                            className='input-field'
                                    />
                                    </div> 
                                <button onClick={handleCreateWorkspace}>Create Workspace</button>
                            </div>
                            )}
                        </div>
                    </div> */}

                   {/* ALERT  */}
                   {/* success alert  */}
                    {alert3.show && (
                        <AlertTitle severity={alert3.severity} style={{marginBottom:'20px'}}>
                            {alert3.message}
                        </AlertTitle>
                    )}
                     {/* end success alert  */}

                    {/* archive alert  */}
                    {alert5.show && (
                        <AlertTitle
                            severity={alert5.severity}
                            style={{marginBottom:'20px'}}
                        >
                            {alert5.message}
                        </AlertTitle>
                    )}
                    {/* end archive alert  */}
                    {/* ALERT  */}
                    
                    {isPopupVisible && (
                        <DeleteWorkspace
                            isOpen={isPopupVisible}
                            onClose={handleCancleDelete}
                            onDeleteConfirm={handleConfirmDelete}
                        />
                    )}
                    {isArchivePopupVisible && (
                        <ArchiveWorkspace
                            workspaceId ={selectedWorkspace}
                            isOpen={isArchivePopupVisible}
                            onClose={handleCancleArchive}
                            onArchiveConfirm={handleConfirmArchive}
                        />
                    )}
                    {isEditingModalVisible && (
                        <WorkspaceEdit
                            isOpen={isEditingModalVisible}
                            workspace={editingWorkspace}
                            onClose={handleCloseEditModal}
                            onSave={loadWorkspaces}
                            onStopPropagation={(e)=>{e.stopPropagation()}}
                        />
                    )}
                    

                </div>
        </div>
  )
}
 
export default Workspace

