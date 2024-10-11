import React, { useEffect, useState } from 'react'
import { duplicateList, getBoard } from '../services/Api';
import '../style/DuplicateBoardStyle.css'
import { AlertTitle } from '@mui/material';

const DuplicateListPopup=({listId, isOpen, onClose})=> {
    const [boards, setBoards] = useState([]);
    const [selectedBoardId, setSelectedBoardId] = useState('');
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        severity: ''
    });

    useEffect(()=>{
        const fetchBoards = async () => {
            try{
                const response = await getBoard();
                setBoards(response.data);
                console.log('data berhasil diambil')
            }catch(error){
                console.error('Failed to fetch board:', error);
            }
        };
        fetchBoards();
    }, [])

    const handleDuplicateList = async () =>{
        if(!selectedBoardId){
            setAlert({show:true, message:'Please select a board', severity:'error'})
            return;
        }
        console.log('Request data:', {listId, board_id: selectedBoardId});

        try{
            await duplicateList(listId, {board_id:selectedBoardId});
            setAlert({show:true, message:'List successfully duplicated!', severity:'success'})
            setTimeout(() => {
                setAlert({...alert, show:false})
                onClose();
            }, 5000);
            
        }catch(error){
            console.error('Duplicate Error:', error);
            setAlert({show: true, message:'Failed to duplicate list:' + error.message, severity:'error'})
            setTimeout(()=>{
                setAlert({...alert, show:false})
            },5000)
        }
    }

  return (
    isOpen && (
        <div className='popup-overlay'>
            <div className='popup-content'>
                <h2>Duplicate List</h2>
                <label className='popup-label'>
                    Select Board:
                    <select
                        value={selectedBoardId}
                        onChange={(e)=>setSelectedBoardId(e.target.value)}
                    >
                        <option value="">Select Board</option>
                        {boards.map((board)=>(
                            <option key={board.id} value={board.id}>
                                {board.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={handleDuplicateList} disabled={!selectedBoardId}>Duplicate List</button>
                <button onClick={onClose}>Cancle</button>
            </div>
            {alert.show && (
                <AlertTitle className='alert-position' severity={alert.severity} onClose={()=> setAlert({...alert, show:false})}>
                    {/* <AlertTitle>{alert.severity === 'error' ? 'Error':'Success'}</AlertTitle> */}
                    {alert.message}
                </AlertTitle>
             )}
        </div>
    )
  )
}

export default DuplicateListPopup