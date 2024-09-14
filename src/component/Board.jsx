import React, { useCallback, useEffect, useState } from 'react'
import { getBoard, createBoard,getListsCountByBoard } from '../services/Api'
import { useNavigate, useParams } from 'react-router-dom';
import { HiArchive,HiPlus,HiOutlineX,HiDotsHorizontal, HiOutlineServer, HiOutlineCalendar,HiChevronRight  } from "react-icons/hi";
import '../style/BoardStyle.css'
import moment from 'moment'
import { LuUsers } from "react-icons/lu";
import Background from './Background';

import { AiFillDelete } from "react-icons/ai";

const Board = () => {
    const {workspaceId} = useParams();
    const [boards, setBoards] = useState([]);
    const [newBoard, setNewBoard] = useState({name:'', description:''});
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [listCount, setListCount] = useState({});
    const [backgroundImage, setBackgroundImage] = useState('');
    const [showAction, setShowAction] = useState('');

    const toggleFormVisibility = () => {
        setShowForm(!showForm)
    }

    //show action
    const toggleActionVisibility = (workspaceId, event) => {
      event.stopPropagation();
      setShowAction(showAction === workspaceId ? null : workspaceId)
    }

    const handleAction = (workspaceId, action) => {
      console.log(`Action: ${action} for workspace: ${workspaceId}`);
      setShowAction(null); //hide dropdown after action
  }

    const loadBoards = useCallback(async () => {
        try {
            const response = await getBoard(workspaceId);
            console.log('Received data:', response.data);

            const filteredBoards = response.data.filter(board => board.workspace_id === Number(workspaceId));
            setBoards(filteredBoards);

            //fetch for lists count
            const listCounts = await Promise.all(filteredBoards.map(async(board)=>{
                const listCountResponse = await getListsCountByBoard(board.id);
                return {boardId: board.id, count: listCountResponse.data.list_count};
            }))

            //set list counts
            const countMap = {};
            listCounts.forEach(({boardId,count})=>{
                countMap[boardId] = count;
            })
            setListCount(countMap);

        } catch (error) {
            console.error('Failed to load Boards', error);
        }
    }, [workspaceId]);


    useEffect(() => {
        console.log('Fetching boards for workspaceId:', workspaceId);
        loadBoards();
    }, [workspaceId, loadBoards]);

    const handleCreateBoard = async () => {
        await createBoard({ ...newBoard, workspace_id: workspaceId});
        loadBoards();
        setShowForm(false);
    };

    const handleNavigateToBoardView = (boardId) =>{
        navigate(`/workspaces/${workspaceId}/boards/${boardId}`)
    }

    const handleBackToWorkspace = () =>{
        navigate('/')
    }

    const handleBackgroundChange = (newBackground) => {
      setBackgroundImage(newBackground);
    }
 
    return (
        <div className='board-container' style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
        <div className='nav-board'>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', paddingLeft:'10px', paddingRight:'10px', margin:'0', padding:'0'}}>
            <h3 style={{textAlign:'left', color:'white', marginBottom:'0', margin:'0'}}>
              <button onClick={handleBackToWorkspace} className='btn-nav'>Workspace</button> 
              <HiChevronRight/>
              <button className='btn-nav' style={{textAlign:'left'}}>Board</button>
            </h3>
            <Background onChangeBackground={handleBackgroundChange}/>
          </div>
          <h5 style={{textAlign:'left', color:'white',paddingLeft:'10px', margin:'0'}}>Happy days, here your boards!</h5>
        </div>

        <div className='board-list-container'>
          <div className='board-list'>
            {boards.map((board) => (
                <div key={board.id} className='board-card' onClick={() => handleNavigateToBoardView(board.id)}>
                  <h4 style={{display:'flex', fontSize:'15px', fontWeight:'bold', justifyContent:'space-between', margin:'5px 0'}}>
                    {board.name} <HiDotsHorizontal className='dot-btn' onClick={(e)=> toggleActionVisibility(board.id, e)}/>
                  </h4>
                  <div style={{paddingRight:'5px', height:'4vh'}}>
                    <p className='board-description'>{board.description}</p>
                  </div>
                  <div className='board-icons'>
                    <p><HiOutlineServer size={15} style={{marginRight:'2px', color:'black'}}/>{listCount[board.id] || 0} lists</p>
                    <p><HiOutlineCalendar size={15} style={{marginRight:'2px', color:'black'}}/>{moment(board.create_at).format(('D MMMM YYYY'))}</p>
                    <p><LuUsers size={15} style={{marginRight:'2px', color:'black'}}/>0 member</p>
                  </div>
                  {/* {showAction === board.id && (
                    <div className='dropdown-menu'>
                        <ul style={{padding:'4px', fontSize:'13px', fontWeight:'bold'}}>
                            Actions
                            <li onClick={() => handleAction(board.id, 'delete')} className='dropdown-li'>
                                <AiFillDelete  size={20} style={{marginRight:'1vh', color:'#6b1c14', padding:'4px'}}/>
                                <div>
                                    Delete <br />
                                    <span style={{fontSize:'10px',fontWeight:'normal', }}>Delete workspace</span>
                                </div>
                            </li>
                            <li onClick={() => handleAction(board.id, 'archive')} className='dropdown-li' >
                                <HiArchive size={20} style={{marginRight:'1vh', color:'#6b1c14', padding:'4px'}}/>
                                <div>
                                    Archive <br />
                                    <span style={{fontSize:'10px', fontWeight:'normal'}}>Archive your workspace</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                  )} */}
                </div>
              ))}
              <div className="board-card2">
                <button className='newBoard' onClick={toggleFormVisibility}>
                  {showForm ? 
                    (<><HiOutlineX size={13} style={{marginRight:'1vw'}}/>Cancel</>) : 
                    (<><HiPlus size={13} style={{marginRight:'1vw'}}/>NEW BOARD</>)
                  }
                </button>
                {showForm && (
                  <div className='board-form'>
                    <input 
                      type="text" 
                      placeholder='board name'
                      value={newBoard.name}
                      onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                      className='board-input'
                    />
                    <input 
                      type="text" 
                      placeholder='Description'
                      value={newBoard.description}
                      onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                      className='board-input'
                    />
                    <input 
                      type="text" 
                      placeholder='user id (manual)'
                      value={newBoard.user_id}
                      onChange={(e)=> setNewBoard({ ...newBoard, user_id: e.target.value})}
                      className='board-input'
                    />
                    <button className='board-button' onClick={handleCreateBoard}>Add Board</button>
                  </div>
                )}
              </div>
        </div>
      </div>
    </div>
  )      
}

export default Board

