import React, { useEffect, useState } from 'react'
import '../style/DuplicateBoardStyle.css'
import { duplicateBoard, getWorkspaces } from '../services/Api';
import Alert from '@mui/material/Alert'
import { Button } from '@mui/material';
import { getBoardsByWorkspace } from './Note';

const DuplicateBoardPopup=({isOpen, onClose, workspace, boardId, onBoardDuplicate})=> {
    const [selectedWorkspace, setSelectedWorkspace] = useState('');
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [boards, setBoards] = useState([]);

    //fetch all workspaces
    useEffect(()=> {
        const fetchWorkspaces = async () => {
            try{
                const response = await getWorkspaces();
                setWorkspaces(response.data);
            }catch(error){
                console.error('Error fetching workspaces:', error);
                alert('Gagal memuat workspace')
            }finally{
                setLoading(false)
            }
        };
        if (isOpen){
            fetchWorkspaces();
        }
    }, [isOpen])

    const handleDuplicate = async () => {
        if(!selectedWorkspace){ 
            alert('Silahkan pilih workspace tujuan!')
            return;
        }
        try{
            await duplicateBoard(boardId, {workspaceId: selectedWorkspace});
            alert('Boards berhasil diduplikasi ke workspace yang dituju!');
            if(typeof onBoardDuplicate === 'function'){
                onBoardDuplicate(selectedWorkspace);
            }
            onClose();
        }catch(error){
            alert('Terjadi kesalahan saat menduplikasikan board: ' + error.message);
        }
        // try{
        //     await duplicateBoard(boardId, {workspaceId: selectedWorkspace});
        //     alert('Board berhasil diduplikasi ke workspace yang dituju!');
        //     onBoardDuplicate(selectedWorkspace);
        //     fetchBoards(selectedWorkspace);
        //     onClose();
        // }catch(error){
        //     console.error('Terjadi kesalahan saat menduplikasi board: ', error.message)
        //     // alert('Terjadi kesalahan saat menduplikasikan board:', error.message);
        // }
    }

    const fetchBoards = async (workspaceId) => {
        try{
            const boardsData = await getBoardsByWorkspace(workspaceId);
            setBoards(boardsData);
        }catch (error){
            console.error('Error fetching boards:', error);
            alert('Gagal memuat boards setelah duplikasi')
        }
    }

    const handleSelectChange = (event) => {
        event.stopPropagation();
        setSelectedWorkspace(event.target.value);
    }

    const handleSelectKlik = (event) => {
        event.stopPropagation();
    }
    

    return isOpen ? (
        <div className='popup-overlay'>
            <div className="popup">
                <h2>Duplicate Board</h2>
                <label>Pilih workspace tujuan:</label>
                {loading ? (
                    <p>Loading workspace ...</p>
                ):(
                    <select 
                        value={selectedWorkspace}
                        onChange={handleSelectChange}
                        onClick={handleSelectKlik}
                    >
                    <option value="">-- Pilih Workspace --</option>
                    {workspaces.map((ws)=>(
                        <option key={ws.id} value={ws.id}>
                            {ws.name}
                        </option>
                    ))}
                    </select>
                )}
                <button onClick={handleDuplicate}>Duplicate</button>
                <button onClick={onClose}>Cancel</button>

                <div>
                    <h3>Boards in Selected Workspace:</h3>
                    {boards.length > 0 ? (
                        <ul>
                            {boards.map(board => (
                                <li key={board.id}>{board.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No boards available.</p>
                    )}
                </div>
            </div>
        </div>
    ) : null;
    
}

export default DuplicateBoardPopup