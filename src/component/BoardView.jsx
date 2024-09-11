import React, { useCallback, useEffect, useState } from 'react'
import { getLists, createList } from '../services/Api'
import List from './List'
import { useNavigate, useParams } from 'react-router-dom'
import { HiChevronRight, HiChevronDown, HiPlus, } from 'react-icons/hi'
import { FaCross } from 'react-icons/fa'
import '../style/BoardViewStyle.css'
import { LuUsers } from "react-icons/lu";

const BoardView=()=> {
    const {workspaceId, boardId} = useParams();
    const [lists,setLists] = useState([]);
    const [newListName, setNewListName] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false)
    const navigasi = useNavigate()
    const currentDate = new Date();


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

    const handleBackToBoard = () => {
        navigasi(`/workspaces/${workspaceId}/boards`)
        ///workspaces/:workspaceId/boards
    }
    const handleBackToWorkspace = () => {
        navigasi('/')
    }

    //const handle form submission
    const handleCreateList = async (e) =>{
        e.prevetDefault();
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
    <div className="board-view-container">
        <h3>
            <button  
                onClick={handleBackToWorkspace} 
                className='btn-nav'
            >
                Workspace
            </button> <HiChevronRight/> 
            <button 
                onClick={handleBackToBoard}
                className='btn-nav' 
                style={{textAlign:'left', width:'5vw'}}
            >
                Board
            </button><HiChevronRight/>
            <button className='btn-nav' style={{textAlign:'left'}}>Lists</button>
                
        </h3>

        {/* Form for date */} 
        <div className='form-container'>
            <div className='date'>
                <h4 style={{margin:'0'}}>{monthName}</h4>
                <p style={{margin:'0', fontSize:'13px'}}>Hari ini adalah hari {dayName}, {date} {monthName} {year}</p>
            </div>
            <div className='board'>
                <h4 style={{marginRight:'5px'}}>Board -</h4>
                <p style={{display:'flex', alignItems:'center'}}>another board name <HiChevronDown style={{marginLeft:'5px'}}/> </p>
            </div>
            <div className='member'>
                <p><LuUsers/> : 10 member</p>
            </div>
        </div>

        <div className="lists-container">
            {lists.map((list)=>(
                <div>
                    <div  key={list.id} className="list-wrapper">
                    <List listId={list.id} listName={list.name}/>
                </div>
                </div>
            ))}
            <div>
                <button  className='btn-list' onClick={()=> setIsFormVisible(true)}>
                    <HiPlus size={15} style={{marginRight:'1vw'}}/>Create List
                </button>
                {isFormVisible && (
                    <form onSubmit={handleCreateList} className='create-list-form'>
                        <input 
                            type="text"
                            value={newListName}
                            onChange={(e)=> setNewListName(e.target.value)}
                            placeholder='Enter list name'
                            required
                        />
                        <div className='form-btn'>
                            <button type='submit'>Add List</button>
                            <button type='submit' onClick={handleButtonCancle}>Cancle</button>
                        </div>
                    </form>
                )}
            </div>
        </div> 
    </div>
  )
}

export default BoardView

/*
<h5>{monthName} || Today is {dayName}, {monthName}{date},{year}</h5>
            <h5>tangal</h5>

*/