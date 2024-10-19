import React, { useState } from 'react'
import '../style/BoardStyle.css'
import '../style/WorkspaceEdit.css'
import { AlertTitle } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import deleteIcon from '../assets/hapus.png'


const DeleteCardPopup=({isOpen, onClose, onDeleteConfirm})=> {
    const [alert,setAlert] = useState({
        show:false,
        message:'',
        severity:''
    })
    if (!isOpen){
        return null;
    }

  return (
    isOpen && (
        <div className='edit-popup-overlay'>
            <div className='edit-popup-content'>
                <div className='popup-title'>
                    <h3>Confirm Delete Board</h3>
                    <AiFillDelete style={{color:'#491519'}} size={20}/>
                </div>
                <img src={deleteIcon} alt={deleteIcon} />
                <p className='sub-title'>Apakah anda yakin ingin menghapus board ini?</p>
                <div className="popup-button">
                    <button className='delete-btn' onClick={(e)=> {e.stopPropagation(); onDeleteConfirm()}}>Ya, Hapus</button>
                    <button className='cancle-btn' onClick={(e) => {e.stopPropagation(); onClose()}}>Cancle</button>
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

export default DeleteCardPopup

