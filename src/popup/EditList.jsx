import React, { useState } from 'react'
import '../style/WorkspaceEdit.css'
import { updateList } from '../services/Api'

const EditList=({list, listId, onClose, onSave}) =>{
    const [editList, setEditList] = useState({
        name: list.name || '',
        // position: list.position || '',
    });

    const stopPropagation = (e) =>{
        e.stopPropagation();
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEditList((prev) => ({...prev, [name]:value}))
    };

    const handleSave = async () => {
        
        try{
            const updateData = {name: editList.name};
            console.log('update data:', updateData)
            await updateList(listId, editList);
            onSave();
            onClose();
        }catch(error){
            console.error('Error updating list:', error)
        }
    }

  return (
    <div className="edit-popup-overlay" onClick={stopPropagation} style={{margin:'0'}}>
        <div className="edit-popup-content">
            <h2>Edit List</h2>
            <div className="input-name">
                <input 
                    type="text" 
                    name='name'
                    value={editList.name}
                    onChange={handleChange}
                    placeholder='List Name'
                    onClick={stopPropagation}
                />
            </div>
            {/* <div className="input-desc">
                <textarea
                    type='number'
                    name='position'
                    value={editList.position}
                    onChange={handleChange}
                    placeholder='list position'
                    onClick={stopPropagation}
                />
            </div> */}
            <div className="modal-actions">
                <button className='save-btn' onClick={handleSave}>Save</button>
                <button className='cancle-btn' onClick={onClose}>Cancle</button>
            </div>
        </div>
    </div>
  )
}

export default EditList