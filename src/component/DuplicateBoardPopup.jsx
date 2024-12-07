import React, { useEffect, useState } from 'react'
import { duplicateBoard, getWorkspaces } from '../services/Api';
import { AlertTitle, Alert } from '@mui/material';
import '../style/DuplicateBoardStyle.css'
import { IoCloseOutline } from 'react-icons/io5'
import duplicate from '../assets/duplication.png'
 
const DuplicateBoardPopup=({boardId, isOpen, onClose, onConfirm, selectedBoard})=> {
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('');
    const [alert, setAlert] = useState({show:false, message:'', severity:''})
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(()=>{
        const fetchWorkspaces = async () => {
            try{
                const response = await getWorkspaces();
                setWorkspaces(response.data);
            }catch(error){
                console.error('Failed to fetch workspace:', error);
            }
        };
        fetchWorkspaces();
    }, [])

    const handleDuplicateBoard = async () => {
        if(!selectedWorkspaceId){
            setAlert({ show:true, message:'please select a workspace', severity:'error'})
            return;
        }
        console.log('Request Data:', {boardId, workspace_id: selectedWorkspaceId});
 
        try{
            await duplicateBoard(boardId, {workspace_id:selectedWorkspaceId});
            setAlert({show:true, message:'Board successfully duplicated!', severity:'success'})
            setTimeout(() => {
                setAlert({...alert, show:false})
                onClose();
            }, 5000);
        }catch(error){
            console.error('Duplicate Error:', error);
            setAlert({show: true, message:'Failed to duplicate board:' + error.message, severity:'error'})
            setTimeout(()=>{
                setAlert({...alert, show:false})
            },5000)
        }
    }


  return (
    isOpen && ( // Pastikan popup hanya ditampilkan jika isOpen true
        <div className="popup-overlay">
            <div className='popup-content' style={{border:'1px solid white'}}>
                <div className="duplicate-header">
                    <h5>Duplicate Board</h5>
                    <IoCloseOutline style={{color:'grey', cursor:'pointer', margin:'0'}} size={20} onClick={onClose}/>
                </div>
                <div className="duplicate-body">
                    <label>
                        Select workspace:
                    </label>
                    <div 
                        className="dropdown-container"
                        onClick={()=> setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="dropdown-selected">
                            {selectedWorkspaceId
                                ? workspaces.find((ws) => ws.id === selectedWorkspaceId)?.name
                                : 'Select Workspace'
                            }
                        </div>
                        {dropdownOpen && (
                            <ul className='dropdown-list'>
                                {workspaces.map((workspace)=>(
                                    <li
                                        key={workspace.id}
                                        className='dropdown-item'
                                        // style={{backgroundColor:'red'}}
                                        onClick={()=>{
                                            setSelectedWorkspaceId(workspace.id);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        {workspace.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="duplicate-btn">
                <button onClick={handleDuplicateBoard} disabled={!selectedWorkspaceId}>Duplicate Board</button>
                </div>
                {/* <button className='cancle-btn' onClick={onClose}>Cancel</button> */}
            </div>
            {alert.show && (
                <AlertTitle className='alert-position' severity={alert.severity} onClose={()=> setAlert({...alert, show:false})}>
                    {/* <AlertTitle>{alert.severity === 'error' ? 'Error':'Success'}</AlertTitle> */}
                    {alert.message}
                </AlertTitle>
            )}
        </div>
        
    )
  )
}


export default DuplicateBoardPopup

/*
return (
    isOpen && ( // Pastikan popup hanya ditampilkan jika isOpen true
        <div className="popup-overlay">
            <div className='popup-content'>
                <h2>Duplicate Board</h2>
                <img src={duplicate} alt={duplicate} />
                <label className='popup-label'>
                    Select workspace:
                    <select
                        value={selectedWorkspaceId}
                        onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                        style={{border:'1px solid #491519'}}
                    >
                        <option value="">Select Workspace</option>
                        {workspaces.map((workspace) => (
                            <option key={workspace.id} value={workspace.id}>
                                {workspace.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button className='duplicate-btn' onClick={handleDuplicateBoard} disabled={!selectedWorkspaceId}>Duplicate Board</button>
                <button className='cancle-btn' onClick={onClose}>Cancel</button>
            </div>
            {alert.show && (
                <AlertTitle className='alert-position' severity={alert.severity} onClose={()=> setAlert({...alert, show:false})}>
                    {/* <AlertTitle>{alert.severity === 'error' ? 'Error':'Success'}</AlertTitle> 
                    {alert.message}
                </AlertTitle>
            )}
        </div>
        
    )
  )

*/