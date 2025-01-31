import React, { useCallback, useEffect, useState } from 'react'
import { getLists, createList, getBoardById, deleteList, getCardCountByLists, archiveLists, getCards } from '../services/Api'
import List from './List'
import { useNavigate, useParams } from 'react-router-dom'
import { HiPlus } from 'react-icons/hi'
import { IoCloseOutline,IoSearch, } from "react-icons/io5";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { MdOutlineImagesearchRoller } from "react-icons/md";
import { TbLayoutKanban } from "react-icons/tb";
import '../style/BoardViewStyle.css'
import { Data_Bg } from '../data/DataBg'
import { AlertTitle } from '@mui/material'
import { useDate } from '../context/DateContext'
import SearchBar from '../fiture/SearchBar'

const BoardView=({listId, cardId, onClose})=> {
    //search filter
    const {cards, setCards} = useDate();
    const navigate = useNavigate();
    const {workspaceId, boardId} = useParams();
    const [lists,setLists] = useState([]);
    const [newListName, setNewListName] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false)
    const navigasi = useNavigate()
    const currentDate = new Date();
    const [boardName, setBoardName] = useState('');
    //delete list
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [listToDelete, setListToDelete] = useState(null);
    const [alert,setAlert] = useState({show:true, message:'', severity:''})
    //background
    const [selectedBackground, setSelectedBackground] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // edit list 
    const [editList, setEditList] = useState(null);
    const [isEditListOpen, setIsEditListOpen] = useState(false);
    //duplicate list
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    //archive list
    const [isArchivePopupVisible, setIsArchivePopupVisible] = useState(false);

    //edit list
    const handleEditListClick = (listId) =>{
        setEditList(listId);
        setIsEditListOpen(true);
        console.log('List ID:', listId)
    }
    const handleCloseEditList = () =>{
        setEditList(null);
        setIsEditListOpen(false);
    }
    //end edit list

    //Delete list
    const handleDeleteClick = (listId) =>{
        setListToDelete(listId);
        setIsPopupVisible(true);
        console.log('tombol delete berhasil di klik')
    }
    const handleConfirmDelete = async()=>{
        if(listToDelete){
            await handleDelete(listToDelete);
            setIsPopupVisible(false);
            setListToDelete(null);
            setAlert({show:true, message:'Successfully deleted list ', severity:'success'})
            console.log('list berhasil dihapus')
        }
    }
    useEffect(()=>{
        if(alert.show){
            setTimeout(()=>{
                setAlert({...alert,show:false})
            }, 5000)
        }
    }, [alert])

    const handleCancleDelete = () =>{
        setIsPopupVisible(false)
        setListToDelete(null)
        setAlert({show:true, message:'batal menghapus list', severity:'success'})
    }
    //end delete list

    //Duplicate list
    const handleDuplicateClick = (listId)=>{
        setSelectedList(listId);
        setIsPopupOpen(true);
    }
    const handleClosePopupList =() =>{
        setIsPopupOpen(false);
        setSelectedList(null);
    }
    //end duplicate list

    //archive list
    const handleConfirmArchive = async (id) =>{
        setIsArchivePopupVisible(false);
        console.log('Archive list with ID:', listId)
        try{
            const response = await archiveLists(listId);
            setAlert({show:true, message:'List has been successfully archived', severity:'success'})
            setTimeout(()=>{
            setAlert(prevState => ({ ...prevState, show:false}))
            }, 5000)
            loadLists();
            console.log(response);
        }catch(error){
            setAlert({show:true, message:'Failed to archive list. Please try again later.', severity:'error'})
            setTimeout(()=>{
            setAlert(prevState => ({ ...prevState, show:false}))
            }, 5000)
            console.error('Error while archiving list:', error)
        }
    }
    useEffect(()=>{
        loadLists();
    },[]);

    const handleArchive = ()=>{
        setIsArchivePopupVisible(true)
        console.log('handleArchive success')
    }
    const handleCancleArchive = () =>{
        setIsArchivePopupVisible(false)
        console.log('Cancle archive works!')
    }
    //end archive list
    //CARD ALERT
    const [cardAlert, setCardAlert] = useState({show:false, message:'', severity:''})
    //const handleAlert
    const handleAlert =(message, severity) =>{
        setAlert({show:true, message:'', severity:''})
    }

    setTimeout(()=>{
        setCardAlert({...cardAlert,show:false})
    }, 5000)

    //END const handleAlert

    
 //background function
    useEffect(()=>{
        const saveBg = localStorage.getItem('selectedBackground');
        if(saveBg){
            setSelectedBackground(JSON.parse(saveBg))
        }
    },[])

    const handleBgSelect = (bg) =>{
        setSelectedBackground(bg);
        localStorage.setItem('selectedBackground', JSON.stringify(bg));
        setIsDropdownOpen(false);
    }
 //end background function


    //boards
    const loadBoards = useCallback(async () => {
        try{
            const response = await getBoardById(boardId) //memanggil api berdasar id nya
            console.log('Receive data:', response.data);
            if(response.data){
                setBoardName(response.data.name)

            }else{
                console.error('Data not found')
            }
        }catch(error){
            console.error('Failed to load Boards', error)
        }
    }, [boardId])

    useEffect(()=>{
        loadBoards();
    }, [loadBoards])


    //date
    //mendapatkan nama, hari, tanggal saat ini
    const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const dayName = daysOfWeek[currentDate.getDay()];

    //mendaptkan bulan dalam satu tahun 
    const monthOfYears = ['Januari', 'Februari', 'Maret','April', 'Mei', 'Juni', 'July', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthOfYears[currentDate.getMonth()];

    //mendapatkan tanggal, bulan, tahun
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();

    const loadLists = useCallback(async () => {
        try {
            const response = await getLists(boardId);
            console.log('Received data:', response.data);
            // Pastikan boardId dan board_id dalam data memiliki tipe data yang sama
            const filteredLists = response.data.filter(list => list.board_id === Number(boardId));

            //mengambil jumlah card untuk setiap list
            const listsWithCardCount = await Promise.all(filteredLists.map(async (list)=>{
                try{
                    const cardCountResponse = await getCardCountByLists(list.id);
                    return{
                        ...list,
                        cardCount: cardCountResponse.data.card_count  || 0//menambahkan card count pada data list
                    };
                }catch(error){
                    console.error(`Failed to fetch card count for list ${list.id}`, error);
                    return {...list, cardCount:0};
                }
            }));

            setLists(listsWithCardCount);
        } catch (error) {
            console.error('Failed to load Lists', error);
        }
    }, [boardId]);

    useEffect(()=>{
        loadLists();
    }, [loadLists])


    const handleDelete = async(listId) => {
        try{
            await deleteList(listId);
            loadLists();
            return true;
        }catch(error){
            console.error('Error deleting lists: ', error)
            return false;
        }
    }

    //END DELETE LIST



    //NAVIGASI
    const handleBackToBoard = () => {
        navigasi(`/workspaces/${workspaceId}/boards`)
        ///workspaces/:workspaceId/boards
    }
    const handleBackToWorkspace = () => {
        navigasi('/')
    }
    const handleToCardDetail = () =>{
        navigasi(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}`)
    }
    const handleToExample = () => {
        navigasi(`/example`)
    }
     //END NAVIGASI

    //const handle form submission
    const handleCreateList = async (e) =>{
        e.preventDefault();
        if(!newListName.trim()){
            alert('List name cannot be empty');
            return;
        }

        try {
            const newPosition = lists.length + 1;
            const newListData = {
                board_id: Number(boardId),
                name: newListName,
                position: newPosition,
            };
            const newListResponse = await createList(newListData);
            //add the new list to the state
            setLists(prevLists => [...prevLists, newListResponse.data]);
            setNewListName('');
            setIsFormVisible(false); 
        }catch(error){
            console.error('Failed to create list', error);
            alert('Failed to create lists')
        }
    }

   const handleButtonCancle = () => {
        setNewListName('');
        setIsFormVisible(false);
    }

      
    


  return (
    <div className='boardView-container'
        style={{
            minHeight:'100vh',
            backgroundImage:selectedBackground ? `url(${selectedBackground.image_url})`:'none',
            backgroundSize:'cover',
            backgroundPosition:'center',
            transition:'background-image 0.3s ease-in-out',
            // border:'1px solid blue'
        }}
        
    > 
        <div className='header-board'>
            <div className="nav-date">
                {cardAlert.show && (
                <AlertTitle className='alert-position' severity={cardAlert.severity}>
                    {cardAlert.message}
                </AlertTitle>
                )}

                <div className='header-navigation'>
                    <button onClick={handleBackToWorkspace} >
                        <HiOutlineSquaresPlus style={{marginRight:'4px'}}/>
                        Workspace
                    </button>
                    /
                    <button onClick={handleBackToBoard}>
                        <TbLayoutKanban style={{marginRight:'4px'}}/>
                        Boards
                    </button>
                    /
                    <button className='non-active'>
                        Lists
                    </button>
                    {/* <div>
                        <p> | {dayName}, {date} {monthName} {year}</p>
                    </div> */}
                </div>
                <div className='form-container'>
                    <div className="form-right">
                        <div className='form-search'>
                            <IoSearch className='search-icon'/>  
                            <SearchBar card={cards}/> 
                        </div>
                        |
                        <div className="bg-selector">
                            <button onClick={()=> setIsDropdownOpen(!isDropdownOpen)}>
                                {selectedBackground ? selectedBackground.name: 'Select Backgorund'}
                                <MdOutlineImagesearchRoller style={{marginLeft:'5px'}}/>
                            </button>    
                            {isDropdownOpen && (
                                <ul className='dropdown-list'>
                                    {Data_Bg.map((bg)=>(
                                        <li key={bg.id} onClick={()=> handleBgSelect(bg)}>
                                            <img src={bg.image_url} alt={bg.name} />
                                            {bg.name}
                                        </li>
                                    ))}
                                </ul>
                                )}  
                            </div> 
                        </div>
                    </div>
            </div>
            
        </div>
        
        <div className="board-view-container" >
            <div className="lists-container">
                {lists.map((list) => (
                //wrap list heigh
                    <div>
                        <div key={list.id} className="list-wrapper" >
                            <List  
                                cardId={cardId}
                                listId={list.id} 
                                listName={list.name} 
                                loadLists={loadLists}
                                onDelete={() => handleDelete(list.id)}
                                handleAlert={handleAlert}
                                cardCount={list.cardCount}
                                //edit
                                handleEditListClick ={handleEditListClick}
                                handleCloseEditList={handleCloseEditList}
                                isEditListOpen={isEditListOpen}
                                editList ={editList}
                                //delete
                                isPopupVisible={isPopupVisible}
                                handleDeleteClick={handleDeleteClick}
                                onClose={handleCancleDelete}
                                onDeleteConfirm={handleConfirmDelete}
                                //duplicate
                                handleDuplicateClick={handleDuplicateClick}
                                handleClosePopupList={handleClosePopupList}
                                selectedList={selectedList}
                                isPopupOpen={isPopupOpen}
                                //Archive
                                handleArchive={handleArchive}
                                handleCancleArchive={handleCancleArchive}
                                isArchivePopupVisible={isArchivePopupVisible}
                                handleConfirmArchive={handleConfirmArchive}
                                
                            />
                        </div>
                    </div>
                ))}
                <div className="form-create-list-container">
                    <button onClick={()=> setIsFormVisible(true)}>
                        {isFormVisible ? 'Add new list' : (<><HiPlus size={12} style={{ marginRight: '5px' }} />Create List</>)}
                    </button>
                    {isFormVisible && (
                        <div className='visible-form'>
                            <div className="visible-body">
                                <form onSubmit={handleCreateList} >
                                    <input 
                                        type="text" 
                                        value={newListName}
                                        onChange={(e)=> setNewListName(e.target.value)}
                                        placeholder='Enter List Name'
                                        required
                                    />
                                </form>
                            </div>
                            <div className="visible-button">
                                {/* <button className='' type='submit'>Add List</button> */}
                                <button className='btn-form' type='button' onClick={handleButtonCancle}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default BoardView