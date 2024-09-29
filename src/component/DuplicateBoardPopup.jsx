import React, { useState } from 'react'
import '../style/DuplicateBoardStyle.css'
import { useDispatch, useSelector } from 'react-redux'
import { duplicateBoard } from '../services/Api';

const DuplicateBoardPopup=({isOpen, onClose})=> {
    const dispatch = useDispatch;
    const workspace = useSelector((state)=> state.workspace);
    const [selectedWorkspace, setSelectedWorkspace] = useState('');

    const handleDuplicate = () =>{
        if(!selectedWorkspace){
            alert('Silakan pilih workspace tujuan!');
            return;
        }
        dispatch(duplicateBoard(selectedWorkspace))
        .then(()=>{
            alert('Board berhasil diduplikasi ke workspace yang dituju!');
            onClose();
        })
        .catch((error)=>{
            alert('Terjadi kesalahan saat menduplikasi board:' + error.message);
        })
    }

  return isOpen ? (
    <div className='popup-overlay'>
        <div className="popup">
            <h2>Duplicate Board</h2>
            <label>Pilih workspace tujuan:</label>
            <select 
                value={selectedWorkspace}
                onChange={(e)=> setSelectedWorkspace(e.target.value)}
            >
                <option value="">-- Pilih Workspace --</option>
                {workspace.map((workspace)=>(
                    <option key={workspace.id} value={workspace.id}>
                        {workspace.name}
                    </option>
                ))}
            </select>
            <button onClick={handleDuplicate}>Duplicate</button>
            <button onClick={onClose}>Cancle</button>
        </div>
    </div>
  ):null;
}

export default DuplicateBoardPopup