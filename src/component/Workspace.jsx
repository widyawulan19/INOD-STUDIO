import React, { useEffect, useState } from 'react'
import { getWorkspaces, createWorkspace, getBoardCountByWorkspace, getAllImage,deleteWorkspace,archiveWorkspace} from '../services/Api'
import { useNavigate } from 'react-router-dom';
import '../style/WorkspaceStyle.css'
import { BiSolidCalendarEdit } from "react-icons/bi";
import { HiArchive,HiPlus,HiOutlineX , HiDotsHorizontal, HiOutlineSearch, HiChevronDown, HiChevronRight, HiChevronUp} from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaTags } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import moment from 'moment';
import { Data_Bg } from '../data/DataBg';
import CheckIcon from '@mui/icons-material/Check';
import { AlertTitle, Snackbar } from '@mui/material';




const Workspace=()=> {
    const [workspaces, setWorkspaces] = useState([]);
    const [newWorkspace, setNewWorkspace] = useState({name:'', description:''});
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false)
    const [showAction, setShowAction] = useState(false)
    const [backgroundImage, setBackgroundImage] = useState([]);
    const [showBg, setShowBg] = useState(false);
    const [selectBg, setSelectBg] = useState(null);
    const [alert, setAlert] = useState({show:false, message:'', severity:''})
    //delete confirm
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [workspaceToDelete, setWorkspaceToDelete] = useState(null);


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

    
    // const handleCreateWorkspace = async()=> {
    //     await createWorkspace(newWorkspace);
    //     loadWorkspaces();
    //     setShowForm(false);
    //     // setShowAction(false);
    // }


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
            backgroundPosition:'center'
            }}
        >
            <div className="workspace-title">
                <h4 style={{textAlign:'left', color:'white'}}>WORKSPACE DASHBOARD</h4>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center'}}>
                    {/* <Background onChangeBackground={handleBackgroundChange}/> */}
                    <HiOutlineSearch size={20} className='workspace-icons'/>
                    <IoMdNotificationsOutline size={20} className='workspace-icons'/>
                    <FaUserCircle size={25} className='workspace-icons-user'/>

                </div>
            </div>

            <div style={{display:'flex', alignItems:'flex-end', justifyContent:'right', marginRight:'35px', position:'relative'}}>
                <button className='btn-bg' onClick={toggleBgVisibility}>
                    {showBg ? 
                    (<>Background <HiChevronUp size={20} className='btn-icon'/></>):(<>Select Background <HiChevronDown size={20} className='btn-icon'/></>)
                }
                </button>
                {showBg && (
                    <div
                        style={{
                            backgroundColor:'white',
                            border:'0.1px solid grey',
                            borderRadius:'5px',
                            boxShadow:'0px 4px 8px rgba(0,0,0,0.1)',
                            padding:'5px',
                            width:'137px',
                            height:'100px',
                            overflowY:'auto',
                            position:'absolute',
                            zIndex:'1000',
                            top:'100%'
                        }}
                    >
                        {Data_Bg.map((bg)=>(
                            <div
                                className='coverBg'
                                key={bg.id}
                                onClick={()=> handleBgSelect(bg)}
                            >
                                {bg.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                <div className='workspace-grid' style={{textAlign:'left'}}>
                    {workspaces.map((workspace) =>(
                        <div onClick={()=>handleNavigateToBoard(workspace.id)} key={workspace.id} className='workspace-card' >
                            <h3 style={{display:'flex', justifyContent:'space-between'}}>
                                {workspace.name} 
                                <HiDotsHorizontal 
                                    className='dot-btn' 
                                    onClick={(e)=> {e.stopPropagation(); toggleActionVisibility(workspace.id, e)}}/>
                            </h3>

                            {showAction === workspace.id && (
                                <div className='dropdown-menu-action' style={{height:'100px'}}>
                                    <ul className='dropdown-ul'>
                                        Actions
                                        <li className='dropdown-li'>
                                            <AiFillDelete className='ikon' size={20}/>
                                            <button onClick={(e)=> {e.stopPropagation(); handleDeleteClick(workspace.id)}} className='btn-li'>
                                                Delete <br />
                                                <span style={{fontSize:'10px', fontWeight:'normal'}}>Delete Workspace</span>
                                            </button>
                                            
                                            {isPopupVisible && (
                                                <div className='popup-overlay'>
                                                    <div className='popup-content'>
                                                        <h3>Konfirmasi penghapusan</h3>
                                                        <p>Apakah Anda yakin ingin menghapus workspace ini?</p>
                                                        <button className='btn-confirm' onClick={(e)=> { e.stopPropagation() ;handleConfirmDelete()}} >Ya, hapus</button>
                                                        <button className='btn-confirm' onClick={(e)=>{e.stopPropagation() ;handleCancleDelete()}}>Batal</button>
                                                    </div>
                                                </div>
                                             )}
                                        </li>
                                        <li className='dropdown-li'>
                                            <HiArchive className='ikon' size={20}/>
                                            <button className='btn-li' onClick={(e)=> {e.stopPropagation(); handleArchive(workspace.id)}}>
                                                Archive <br />
                                                <span style={{fontSize:'10px', fontWeight:'normal'}}>Archive your workspace</span>
                                            </button>    
                                            {isArchivePopupVisible && (
                                                <div className='popup-overlay'>
                                                    <div className='popup-content'>
                                                        <p>Dengan memindahkan workspace kedalam archive, berarti menghapus workspace pada halaman ini <br /> Apa anda yakin?</p>
                                                        <button className='btn-confirm' onClick={(e) => {e.stopPropagation(); handleConfirmArchive(workspace.id)}}>Archive</button>
                                                        <button className='btn-confirm' onClick={(e)=> {e.stopPropagation(); handleCancleArchive()}}>Cancle</button>
                                                    </div>
                                                </div>
                                            )}    
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
                                {/* <button className='btn-workspace'><HiChevronRight size={20}/></button> */}
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

                </div>
        </div>
  )
}
 
export default Workspace

//create select backgoround

/*
1. toggleBgVisibility
2. buat state showBg
3. import data bg 
4. mapping data bg
5. buat const handleBgSelect

*/