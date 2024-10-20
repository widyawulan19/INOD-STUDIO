import React, {useState} from 'react'
import '../style/WorkspaceEdit.css'
import storage from '../assets/storage.png'
import { AlertTitle } from '@mui/material'

const ArchiveCard=({cardId,isOpen,onClose, onArchiveConfirm})=> {
    const [aler,setAlert] = useState({show:false, message:'', severity:''})
    if(!isOpen){
        return null
    }

    const stopPropagation = (e) => {
        e.stopPropagation();
    }

  return (
    isOpen && (
        <div className="edit-popup-overlay">
            <div className="edit-popup-content">
                <h3 style={{color:'#491519'}}>Confirm Archive List</h3>
                <img src={storage} alt={storage} />
                <p className='archive-sub-title'>
                    Dengan memindahkan board kedalam archive,<br /> berarti <span>menghapus board</span> pada halaman ini <br /> Apa anda yakin?
                </p>
                <button className='archive-btn' onClick={(e)=> {e.stopPropagation(); onArchiveConfirm(cardId)}}>Archive</button>
                <button className='cancle-btn' onClick={(e)=> {e.stopPropagation(); onClose()}}>Cancle</button>
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

export default ArchiveCard