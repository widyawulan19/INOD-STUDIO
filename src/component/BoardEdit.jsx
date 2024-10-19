import React, { useState } from 'react'
import { updateBoard } from '../services/Api'
import '../style/WorkspaceEdit.css'

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
            <h2>Edit Board</h2>
            <div className='input-name'>
                <input 
                    type="text"
                    name='name'
                    value={editedBoard.name}
                    onChange={handleChange}
                    placeholder='Board name'
                    onClick={stopPropagation}
                />
            </div>
            <div className='input-desc'>
                <textarea  
                    name="description" 
                    value={editedBoard.description}
                    onChange={handleChange}
                    placeholder='Board Description'
                    onClick={stopPropagation}
                />
            </div>
            <div className="modal-actions">
                <button className='save-btn' onClick={handleSave}>Save</button>
                <button className='cancle-btn' onClick={onClose}>Cancle</button>
            </div>
        </div>
    </div>
  )
}

export default BoardEdit