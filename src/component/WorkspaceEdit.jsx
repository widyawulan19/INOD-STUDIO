import React, { useCallback, useState } from 'react';
import { updateWorkspace, getWorkspaces } from '../services/Api';
import '../style/WorkspaceEdit.css';
import { IoCloseOutline } from "react-icons/io5";

const WorkspaceEdit = ({ isOpen,workspace, onClose, onSave }) => {
    const [workspaces, setWorkspaces] =([])
    const [editedWorkspace, setEditedWorkspace] = useState({
        name: workspace.name || '',
        description: workspace.description || ''
    });
    const [alert, setAlert] = useState({
        show: false,
        message:'',
        severity:'' 
    })

    const stopPropagation = (e) => {
        e.stopPropagation(); // Menerima event dan menghentikan propagasi
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedWorkspace((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await updateWorkspace(workspace.id, editedWorkspace);
            onSave(); // Refresh workspace list
            onClose(); // Close the modal

        } catch (error) {
            console.error('Error updating workspace:', error);
        }
    };

    
    return (
        isOpen && (
            <div className='edit-popup-overlay' onClick={stopPropagation} style={{margin:'0'}}>
                <div  className='edit-popup-content' onClick={stopPropagation}>
                    <div className="edit-title">
                        <h5>Edit Workspace</h5>
                        <IoCloseOutline size={20} style={{color:'grey'}} onClick={onClose}/>
                    </div>
                    <div className="edit-form">
                        <div className='input-name'>
                            <label>Name </label>
                            <input 
                            type="text" 
                            name='name'
                            value={editedWorkspace.name}
                            onChange={handleChange}
                            className='input-field'
                            placeholder='Workspace Name'
                            onClick={stopPropagation} // Menghentikan propagasi saat input diklik
                        />
                        </div>
                        <div className='input-desc'>
                            <label>Description </label>
                            <input
                                name='description'
                                value={editedWorkspace.description}
                                onChange={handleChange}
                                className='field-input'
                                placeholder='Workspace Description'
                                onClick={stopPropagation} // Menghentikan propagasi saat textarea diklik
                            />
                        </div>
                    </div>
                    <div className='edit-button'>
                        <button className='save-btn' onClick={handleSave}>Save Change</button>
                        {/* <button className='cancle-btn' onClick={onClose}>Cancel</button> */}
                    </div>
            </div>
        </div>
        )
    );
}

export default WorkspaceEdit;
