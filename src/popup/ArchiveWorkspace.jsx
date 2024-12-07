import React, { useState } from 'react'
import { AlertTitle } from '@mui/material'
import '../style/ArchivePopup.css'
import { RxArchive } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
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
        <div className="archive-popup-overlay">
            <div className="archive-popup-content">
                <div className="archive-title">
                    <h5> <RxArchive style={{marginRight:'5px', color:'rgb(48, 48, 255)'}}/>Confirm Archive</h5>
                    <IoCloseOutline style={{color:'grey', cursor:'pointer'}} size={20} onClick={(e)=>{e.stopPropagation(); onClose()}}/>
                </div>
                <div className="text-archive">
                    {/* <RxArchive size={20} style={{color:'blue', margin:'5px',marginBottom:'15px'}} /> */}
                    <p className='archive-sub-title'>Dengan memindahkan workspace kedalam archive, <br />
                        berarti <span>menghapus workspace</span> pada halaman ini <br />
                        Apa anda yakin ?
                    </p>
                </div>
                <div className="archive-button">
                    <button  onClick={(e)=> {e.stopPropagation(); onArchiveConfirm(workspaceId)}}><RxArchive style={{marginRight:'5px'}}/> Archive</button>
                    {/* <button className='cancle-btn' onClick={(e) => {e.stopPropagation(); onClose()}}>Cancle</button> */}
                </div>
            </div>
        </div>
    )
  )
}

export default ArchiveWorkspace