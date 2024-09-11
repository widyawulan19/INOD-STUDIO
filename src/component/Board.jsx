import React, { useCallback, useEffect, useState } from 'react'
import { getBoard, createBoard,getListsCountByBoard } from '../services/Api'
import { useNavigate, useParams } from 'react-router-dom';
import { HiPlus,HiOutlineX,HiDotsHorizontal, HiOutlineServer, HiOutlineCalendar,HiChevronRight  } from "react-icons/hi";
import '../style/BoardStyle.css'
import moment from 'moment'
import { LuUsers } from "react-icons/lu";

const Board = () => {
    const {workspaceId} = useParams();
    const [boards, setBoards] = useState([]);
    const [newBoard, setNewBoard] = useState({name:'', description:''});
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [listCount, setListCount] = useState({});

    const toggleFormVisibility = () => {
        setShowForm(!showForm)
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
 
    return (
        <div className='board-container'>
          <h3 style={{textAlign:'left', color:'white'}}>
            <button onClick={handleBackToWorkspace} className='btn-nav'>Workspace</button> 
            <HiChevronRight/>
            <button className='btn-nav' style={{textAlign:'left'}}>Board</button>
          </h3>
          <h5 style={{textAlign:'left', color:'white'}}>Happy days, here your boards!</h5>
      
          {/* Boards */}
          <div className='board-list'>
            {boards.map((board) => (
              <div key={board.id} className='board-card' onClick={() => handleNavigateToBoardView(board.id)}>
                <h4 style={{display:'flex', fontSize:'15px', fontWeight:'bold', justifyContent:'space-between', margin:'5px 0'}}>
                  {board.name} <HiDotsHorizontal/>
                </h4>
                <p style={{margin:'5px 0', color:'#333', fontSize:'13px'}}>{board.description}</p>
                <div className='board-icons'>
                  <p><HiOutlineServer style={{marginRight:'2px'}}/>{listCount[board.id] || 0} lists</p>
                  <p><HiOutlineCalendar style={{marginRight:'2px'}}/>{moment(board.create_at).format(('D MMMM YYYY'))}</p>
                  <p><LuUsers style={{marginRight:'2px'}}/>0 member</p>
                </div>
              </div>
            ))}
            <div className="board-card2" style={{textAlign:'center'}}>
              {/* <p>Create Your Board here</p> */}
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
                  <button className='board-button' onClick={handleCreateBoard}>Add Board</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )      
}

export default Board

