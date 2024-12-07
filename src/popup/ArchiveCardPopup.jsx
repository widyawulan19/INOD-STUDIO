//archive boards
import React, { useState } from 'react'
import { AlertTitle } from '@mui/material'
import '../style/ArchivePopup.css'
// import '../style/WorkspaceEdit.css'
import storage from '../assets/storage.png'
import { IoCloseOutline } from 'react-icons/io5'
import { RxArchive } from 'react-icons/rx'

const ArchiveCardPopup=({isOpen,onClose,onArchiveConfirm, boardId})=> {
    const [alert, setAlert] = useState({
        show:false,
        message:'',
        severity:''
    })
    if(!isOpen){
        return null
    }

  return (
    isOpen && (
        <div className='archive-popup-overlay'>
            <div className='archive-popup-content'>
                <div className="archive-title">
                    <h5> <RxArchive style={{margin:'5px', color:'rgb(48, 48, 255'}}/> Confirm Archive Board</h5>
                    <IoCloseOutline style={{color:'grey', cursor:'pointer'}} size={20} onClick={(e)=> {e.stopPropagation(); onClose()}}/>
                </div>
                <div className="text-archive">
                    <p className='archive-sub-title'>
                        Dengan memindahkan board kedalam archive,<br /> berarti <span>menghapus board</span> pada halaman ini <br /> Apa anda yakin?
                    </p>
                </div>
                <div className="archive-button">
                    <button className='archive-btn' onClick={(e)=> {e.stopPropagation(); onArchiveConfirm(boardId)}}>Archive</button>
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

export default ArchiveCardPopup