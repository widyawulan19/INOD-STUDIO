import React, { useEffect, useState } from 'react'
import { duplicateList, getBoard } from '../services/Api';
import '../style/DuplicateBoardStyle.css'
import { AlertTitle } from '@mui/material';
// import duplicate from '../assets/duplication.png'
import { IoCloseOutline } from 'react-icons/io5'


const DuplicateListPopup=({listId, isOpen, onClose,workspaceId})=> {
    const [boards, setBoards] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedBoardId, setSelectedBoardId] = useState('');
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        severity: ''
    });

    useEffect(()=>{
        const fetchBoards = async () => {
            try{
                console.log("Fetching boards for workspace:", workspaceId);
                const response = await getBoard(workspaceId);
                // setBoards(response.data);
                // console.log('data berhasil diambil')
                console.log('Response from getBoard:', response); // Debugging API response
                
                // Periksa apakah data board berada di response.data atau response langsung
                const boardData = response.data?.boards || response.data || [];
                
                setBoards(boardData);
                console.log('Boards:', boardData);
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
        <div className='popup-board-overlay'>
            <div className='popup-content' style={{border:'1px solid transparent'}}>
                <div className="duplicate-header">
                    <h5>Duplicate List</h5>
                    <IoCloseOutline style={{color:'grey', cursor:'pointer', margin:'0'}} size={20} onClick={onClose}/>
                </div>
                <div className="duplicate-body">
                    <label>
                        Select Board :
                    </label>
                </div>
                <div className="dropdown-container" onClick={()=> setDropdownOpen(!dropdownOpen)}>
                    <div className="dropdown-selected">
                        {selectedBoardId 
                            ? boards.find((br) => br.id === selectedBoardId)?.name
                            : 'Select Board'
                        }
                    </div>
                    {dropdownOpen && (
                        <ul className='dropdown-list'>
                            {boards.map((board)=> (
                                <li
                                    key={board.id}
                                    className='dropdown-item'
                                    onClick={()=> {
                                        setSelectedBoardId(board.id);
                                        setDropdownOpen(false)
                                    }}
                                >
                                    {board.name}
                                </li>
                            ))}

                        </ul>
                    )}
                </div>
                <div className="duplicate-btn">
                    <button className='duplicate-btn' onClick={handleDuplicateList} disabled={!selectedBoardId}>Duplicate List</button>
                </div>
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