import React, { useState } from 'react'
import '../style/WorkspaceEdit.css'
import { updateList } from '../services/Api'
import { IoClose, IoCloseOutline } from 'react-icons/io5'
 
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
    <div className="edit-list-popup-overlay" onClick={stopPropagation} style={{margin:'0'}}>
        <div className="edit-popup-content">
            <div className="edit-title">
                <h5>Edit List</h5>
                <IoCloseOutline size={20} style={{color:'grey', cursor:'pointer'}} onClick={onClose}/>
            </div>
            <div className="edit-form">
                <div className="input-name">
                    <input 
                        type="text" 
                        name='name'
                        value={editList.name}
                        onChange={handleChange}
                        placeholder='List Name'
                        className='input-field'
                        onClick={stopPropagation}
                    />
                </div>
                <div className="edit-button">
                    <button className='save-btn' onClick={handleSave}>Save</button>
                    {/* <button className='cancle-btn' onClick={onClose}>Cancle</button> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditList