import React, {useState} from 'react'
// import '../style/WorkspaceEdit.css'
import '../style/ArchivePopup.css';
import storage from '../assets/storage.png'
import { AlertTitle } from '@mui/material'
import { RxArchive } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";

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
        <div className="archive-popup-overlay">
            <div className="archive-popup-content">
                <div className="archive-title">
                    <h5><RxArchive style={{marginRight:'5px', color:'rgb(48, 48, 255)'}}/> Confirm Archive List</h5>
                    <IoCloseOutline style={{color:'grey', cursor:'pointer'}} onClick={(e)=> {e.stopPropagation(); onClose() }} />
                </div>
                
                <div className="text-archive">
                    <p className='archive-sub-title'>
                        Dengan memindahkan board kedalam archive,<br /> berarti <span>menghapus board</span> pada halaman ini <br /> Apa anda yakin?
                    </p>
                </div>
                <div className="archive-button">
                    <button className='archive-btn' onClick={(e)=> {e.stopPropagation(); onArchiveConfirm(cardId)}}>Archive</button>
                </div>
                {/* <button className='cancle-btn' onClick={(e)=> {e.stopPropagation(); onClose()}}>Cancle</button> */}
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