import React, { useState } from 'react'
import '../style/DeletePopup.css'
// import deleteIcon from '../assets/hapus.png';
import { AlertTitle } from '@mui/material';
import { IoCloseOutline,IoWarningOutline } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";

const DeleteCard=({cardId,isOpen,onClose,onDeleteConfirm})=> {
    const [alert, setAlert] = useState({show:false, message:'', severity:''})

    if(!isOpen){
        return null;
    }

    // const stopPropagation =(e)=>{
    //     e.stopPropagation();
    // }

  return (
    isOpen && (
        <div className="delete-popup-overlay">
            <div className="delete-popup-content">
                <div className="delete-title">
                    <h5> <IoWarningOutline size={15} style={{color:'red', marginRight:'5px'}}/>Confirm delete card</h5>
                    <IoCloseOutline style={{color:'grey', cursor:'pointer'}} size={20} onClick={(e)=> {e.stopPropagation(); onClose()}}/>
                </div>
                <div className="text-delete">
                    <RiDeleteBin5Fill size={20} style={{color:'red', margin:'5px', marginBottom:'15px'}}/>
                    <p>Apakah anda yakin ingin <span style={{color:'red'}}>menghapus</span>  card ini?</p>
                </div>
                <div className='delete-popup-button'>
                    <button className='delete-btn' onClick={(e)=> {e.stopPropagation(); onDeleteConfirm()}}>Ya, Hapus</button>
                    {/* <button className='cancle-btn' onClick={(e) => {e.stopPropagation(); onClose()}}>Cancle</button> */}
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

export default DeleteCard