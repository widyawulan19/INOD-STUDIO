import React, { useState } from 'react'
import '../style/ArchivePopup.css'
import storage from '../assets/storage.png'
import { AlertTitle } from '@mui/material'
import { IoCloseOutline } from 'react-icons/io5'
import { RxArchive } from 'react-icons/rx'

const ArchiveListPopup=({listId, isOpen, onClose,onArchiveConfirm})=> {
    const [alert, setAlert] = useState({show:false, message:'', severity:''})
    if(!isOpen){
        return null
    }

  return (
    isOpen && (
        <div className="archive-list-popup-overlay">
            <div className="archive-popup-content">
                <div className="archive-title">
                    <h5><RxArchive style={{margin:'5px', color:'rgb(48, 48, 255'}}/> Confirm Archive List</h5>
                    <IoCloseOutline style={{color:'grey', cursor:'pointer'}} size={20} onClick={(e)=> {e.stopPropagation(); onClose()}}/>
                </div>
                <div className="text-archive">
                    <p className='archive-sub-title'>
                        Dengan memindahkan list kedalam archive,<br /> berarti <span>menghapus list</span> pada halaman ini <br /> Apa anda yakin?
                    </p>
                </div>
                <div className="archive-button">
                    <button className='archive-btn' onClick={(e)=>{e.stopPropagation(); onArchiveConfirm(listId)}}>Archive</button>
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

export default ArchiveListPopup