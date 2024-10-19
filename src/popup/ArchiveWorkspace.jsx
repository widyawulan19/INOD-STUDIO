import React, { useState } from 'react'
import { AlertTitle } from '@mui/material'
// import '../style/BoardStyle.css'
import '../style/WorkspaceEdit.css'
import storage from '../assets/storage.png'

const ArchiveWorkspace=({workspaceId,isOpen,onClose,onArchiveConfirm})=> {
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
        <div className="edit-popup-overlay">
            <div className="edit-popup-content">
                <h3>Confirm Archive Workspace</h3>
                <img src={storage} alt={storage} />
                <p className='archive-sub-title'>Dengan memindahkan workspace kedalam archive, <br />
                    berarti <span>menghapus workspace</span> pada halaman ini <br />
                    Apa anda yakin ?
                </p>
                <button className='archive-btn' onClick={(e)=> {e.stopPropagation(); onArchiveConfirm(workspaceId)}}>Archive</button>
                <button className='cancle-btn' onClick={(e) => {e.stopPropagation(); onClose()}}>Cancle</button>
            </div>
        </div>
    )
  )
}

export default ArchiveWorkspace