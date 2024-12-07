import React, { useState } from 'react'
import { updateBoard } from '../services/Api'
import '../style/WorkspaceEdit.css'
import { IoCloseOutline } from 'react-icons/io5'

const BoardEdit=({board,onClose,onSave})=> {
    const [boards, setBoards] = ([])
    const [editedBoard, setEditedBoard] = useState({
        name: board.name || '',
        description: board.description || '',
    });

    const stopPropagation = (e) =>{
        e.stopPropagation();
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEditedBoard((prev) => ({...prev, [name]: value}))
    };

    const handleSave = async () =>{
        try{
            await updateBoard(board.id, editedBoard);
            onSave(); //refresh board list
            onClose(); //close modal
        } catch (error){
            console.error('Error updating board:', error)
        } 
    }

  return (
    <div className='edit-popup-overlay' onClick={stopPropagation} style={{margin:'0'}}>
        <div className='edit-popup-content' onClick={stopPropagation}>
            <div className="edit-title">
                <h5>Edit Board</h5>
                <IoCloseOutline size={20} style={{color:'grey', cursor:'pointer'}} onClick={onClose}/>
            </div>
            <div className='edit-form'>
                <div className="input-name">
                    <label>Name</label>
                    <input 
                        type="text"
                        name='name'
                        value={editedBoard.name}
                        onChange={handleChange}
                        placeholder='Board name'
                        onClick={stopPropagation}
                        className='input-field'
                    />
                </div>
                <div className="input-desc">
                    <label>Description</label>
                    <input 
                        name="description" 
                        value={editedBoard.description}
                        onChange={handleChange}
                        placeholder='Board Description'
                        onClick={stopPropagation} 
                        className='field-input'
                    />
                </div>
            </div>
            <div className="edit-button">
                <button className='save-btn' onClick={handleSave}>Save</button>
                {/* <button className='cancle-btn' onClick={onClose}>Cancle</button> */}
            </div>
        </div>
    </div>
  )
}

export default BoardEdit