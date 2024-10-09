import React, { useCallback, useEffect, useState } from 'react'
import { getLists, createList, getBoardById, deleteList } from '../services/Api'
import List from './List'
import { useNavigate, useParams } from 'react-router-dom'
import { HiChevronDown, HiChevronRight, HiChevronUp, HiPlus, } from 'react-icons/hi'
import '../style/BoardViewStyle.css'
import { LuUsers } from "react-icons/lu";
import { Data_Bg } from '../data/DataBg'

const BoardView=()=> {
    const {workspaceId, boardId} = useParams();
    const [lists,setLists] = useState([]);
    const [newListName, setNewListName] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false)
    const navigasi = useNavigate()
    const currentDate = new Date();
    const [boardName, setBoardName] = useState('');
    //delete list
    const [listToDelete, setListToDelete] = useState(null)
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [alert,setAlert] = useState({show:true, message:'', severity:''})

    //const for background
    const [showBg, setShowBg] = useState(false)
    const [selectBg, setSelectBg] = useState(null)

    //backgoround
    const toggleBgVisibility = () => {
        setShowBg(!showBg);
    }
    const handleBgSelect= (bg) => {
        setSelectBg(bg);
        setShowBg(false);
    }


    //boards
    const loadBoards = useCallback(async () => {
        try{
            const response = await getBoardById(boardId) //memanggil api berdasar id nya
            console.log('Receive data:', response.data);

            // if(response.data && response.data.length > 0) {
            //     setBoardName(response.data[0].name)//simpan nama board dalam state;
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
            setLists(filteredLists);
        } catch (error) {
            console.error('Failed to load Lists', error);
        }
    }, [boardId]);

    useEffect(()=>{
        loadLists();
    }, [loadLists])

    //DELETE LIST
    const handleDeleteClick = (listId) => {
        setListToDelete(listId);
        setIsPopupVisible(true);
        console.log('button delete berhasil di klik')
    }

    const handleConfirmDelete = async()=>{
        if(listToDelete){
            const deleteResponse = await handleDelete(listToDelete);
            setIsPopupVisible(false);
            setListToDelete(null)
            if(deleteResponse){
                setAlert({show:true, message:'Successfully delete your list', severity:'success'})
                setTimeout(()=> {
                    setAlert({...alert, show:false})
                }, 5000) 
            }else{
                setAlert({show:true, message:'Failed to delete list', severity:'error'})
                setTimeout(()=>{
                    setAlert({...alert, show:false})
                }, 5000)
            }
        }
    }
    const handleCancleDelete = () => {
        setIsPopupVisible(false)
        setListToDelete(null)
    }

    const handleDelete = async(id) => {
        try{
            await deleteList(id);
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
            const newList = await createList({board_id: Number(boardId), name: newListName, position: newPosition});

            //update the state to include the new list
            setLists([...lists, newList.data]);
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
            backgroundImage: selectBg ? `url(${selectBg.image_url})`:'none',
            backgroundSize:'cover',
            backgroundPosition:'center'
        }}
    >
        <div className='nav-date'>
            <h3 style={{marginBottom:'0', marginTop:'0'}}>
            <button  
                onClick={handleBackToWorkspace} 
                className='btn-nav'
            >
                Workspace
            </button> <HiChevronRight className='nav-icon'/> 
            <button 
                onClick={handleBackToBoard}
                className='btn-nav' 
                style={{textAlign:'left', width:'5vw'}}
            >
                Board
            </button><HiChevronRight className='nav-icon'/>
            <button className='btn-nav' style={{textAlign:'left'}}>Lists</button>
                
            </h3>

            {/* Form for date  */}
            <div className='form-container' style={{marginTop:'0'}}>
                <div className='date'>
                    <h4 style={{margin:'0'}}>{monthName}</h4>
                    <p style={{margin:'0', fontSize:'13px'}}>Hari ini adalah hari {dayName}, {date} {monthName} {year}</p>
                </div>
                <div className='board'>
                    <h4 style={{marginRight:'5px'}}>Board -</h4>
                    <p style={{display:'flex', alignItems:'center'}}>{boardName} </p>
                </div>
                <div className='member'>
                    <p><LuUsers/> : 10 member</p>
                </div>
                <div style={{display:'flex', alignItems:'flex-end', justifyContent:'right', position:'relative'}}>
                    <button className='btn-bg' onClick={toggleBgVisibility}>
                        {showBg? 
                        (<>Background <HiChevronUp size={20} className='btn-icon'/></>):(<>Select Background <HiChevronDown size={20} className='btn-icon'/></>)
                        }
                    </button>
                    {showBg && (
                        <div
                            style={{
                                backgroundColor:'white',
                                border:'0.1px solif grey',
                                borderRadius:'5px',
                                boxShadow:'0px 4px 8px rgba(0,0,0,0.1)',
                                padding:'5px',
                                width:'100%',
                                height: '100px',
                                overflowY:'auto',
                                position:'absolute',
                                zIndex:'1000',
                                top:'100%',
                                right:'24px'
                            }}
                        >
                            {Data_Bg.map((bg)=>(
                                <div
                                className='coverBg'
                                key={bg.id}
                                onClick={()=> handleBgSelect(bg)}
                                >
                                    {bg.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div> 
        </div>
        
        <div className="board-view-container">
            <div className="lists-container">
                {lists.map((list) => (
                //wrap list heigh
                    <div>
                        <div key={list.id} className="list-wrapper">
                            <List  
                                listId={list.id} 
                                listName={list.name} 
                                loadLists={loadLists}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                ))}
                <div className="create-list-container">
                    <button className='btn-list' onClick={() => setIsFormVisible(true)}>
                        {isFormVisible ? 'Add new list' : (<><HiPlus size={15} style={{ marginRight: '1vw' }} />Create List</>)}
                    </button>
                    {isFormVisible && (
                        <form onSubmit={handleCreateList} className='create-list-form'>
                            <input
                                type="text"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                placeholder='Enter list name'
                                required
                            />
                            <div className='form-btn'>
                                <button className='btn-form' type='submit'>Add List</button>
                                <button className='btn-form' type='button' onClick={handleButtonCancle}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default BoardView
