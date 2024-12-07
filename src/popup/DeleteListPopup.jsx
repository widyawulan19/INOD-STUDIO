import React, { useState } from 'react'
import { AlertTitle } from '@mui/material'
// import { AiFillDelete } from 'react-icons/ai';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoCloseOutline,IoWarningOutline } from "react-icons/io5";
// import deleteIcon from '../assets/hapus.png'
import '../style/WorkspaceEdit.css'
import '../style/DeletePopup.css';

const DeleteListPopup=({listId,isOpen,onClose,onDeleteConfirm})=> {
    // console.log("Properti diterima di DeleteListPopup:", { listId, isOpen, onClose, onDeleteConfirm });
    const [alert, setAlert]= useState({show:false, message:'', severity:''})
    
    if(!isOpen){
        return null;
    }

  return (
    isOpen && (
        <div className="delete-list-popup-overlay">
            <div className="delete-popup-content" style={{width:'30vw'}}>
                <div className="delete-title">
                    <h5> <IoWarningOutline size={15} style={{color:'red', marginRight:'5px'}}/>Confirm Delete List</h5>
                    <IoCloseOutline style={{color:'grey', cursor:'pointer'}} size={20} 
                        onClick={(e)=> {e.stopPropagation(); onClose()}}
                    />
                </div>
               <div className="text-delete">
                    <RiDeleteBin5Fill size={20} style={{color:'red', margin:'5px', marginBottom:'15px'}}/>
                    <p className='sub-title'>Apakah anda yakin ingin menghapus board ini?</p>
               </div>
                <div className='delete-popup-button'>
                    <button className='delete-btn' onClick={(e)=> {e.stopPropagation(); onDeleteConfirm()}}>Ya, Hapus</button>
                    {/* <button className='cancle-btn' onClick={onClose}>Cancle</button> */}
                </div>
            </div>
            {alert.show && (
                <AlertTitle className='alert-position' severity={alert.severity} onClose={()=> setAlert({...alert, show:false})}>
                    {alert.message}
                </AlertTitle>
            )}
        </div>
    )
  )
}

export default DeleteListPopup