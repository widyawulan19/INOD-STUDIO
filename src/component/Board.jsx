import React, { useCallback, useEffect, useState } from 'react'
import { getBoard, createBoard,getListsCountByBoard, updateBoardBackground, duplicateBoard, getBoardByWorkspace, deleteBoard, archiveBoard} from '../services/Api'
import { useNavigate, useParams } from 'react-router-dom';
import { HiArchive,HiPlus,HiOutlineX,HiDotsHorizontal, HiOutlineServer, HiOutlineCalendar,HiChevronRight,HiOutlineViewList,HiOutlineFire  } from "react-icons/hi";
import { HiOutlineSquaresPlus,HiMiniCalendarDays } from "react-icons/hi2";
import { MdOutlineImagesearchRoller } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoCloseOutline } from "react-icons/io5";
import { BsArchive } from "react-icons/bs";
import '../style/BoardStyle.css'
import moment from 'moment'
import { AiOutlineDelete } from "react-icons/ai";
import { Data_Bg } from '../data/DataBg';
import DuplicateBoardPopup from './DuplicateBoardPopup';
import { AlertTitle } from '@mui/material';
import { FaEdit, FaRegEdit } from 'react-icons/fa';
import DeleteCardPopup from '../popup/DeleteCardPopup';
import ArchiveCardPopup from '../popup/ArchiveCardPopup';
import BoardEdit from './BoardEdit';

const Board = () => {
    const {boardId, workspaceId} = useParams();
    // const [workspaces, setWorkspaces] = useState([]);
    const [boards, setBoards] = useState([]);
    const [newBoard, setNewBoard] = useState({name:'', description:''});
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [listCount, setListCount] = useState({});
    const [backgroundImage, setBackgroundImage] = useState('');
    const [showAction, setShowAction] = useState('');
    const [localBoardId, setLocalBoardId] = useState(boardId);
    const [boardData, setBoardData] = useState(null);
    const [showBg, setShowBg] = useState(false);
    const [selectBg, setSelectBg] = useState(null);
    //board Popup
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(null);
    //delete board
    const [boardToDelete, setBoardToDelete] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [alert, setAlert] = useState({show:false, message:'', severity:''})
    //modal action
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    //edit
    const [editBoard, setEditBoard] = useState(null);
    const [isEditingBoardVisible, setIsEditingBoardVisible ] = useState(false)
    //background
    const [selectedBackground, setSelectedBackground] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    //change background
    useEffect(()=>{
      const saveBg = localStorage.getItem('selectedBackground');
      if(saveBg){
        setSelectedBackground(JSON.parse(saveBg))
      }
    },[])

    const handleBgSelect1 = (bg) =>{
      setSelectedBackground(bg);
      localStorage.setItem('selectedBackground', JSON.stringify(bg));
      setIsDropdownOpen(false)
    }
    //end change background

    

    //edit
    const handleEditBoardClick = (boardId) =>{
      setEditBoard(boardId);
      setIsEditingBoardVisible(true);
      console.log('Board ID:', boardId)
    }

    const handleCloseEditBoard = () =>{
      setEditBoard(null)
      setIsEditingBoardVisible(false)
    }

  // DELETE 
  const handleDeleteClick = (boardId)=>{
    setBoardToDelete(boardId);
    setIsPopupVisible(true);
  }

  const handleConfirmDelete = async()=>{
    if(boardToDelete){
      const deleteResponse = await handleDelete(boardToDelete);
      setIsPopupVisible(false);
      setBoardToDelete(null)
      if(deleteResponse){
        setAlert({show:true, message:'Successfully delete your board', severity:'success'})
        setTimeout(()=>{
          setAlert({...alert,show:false})
        },5000)
      }else{
        setAlert({show:true, message:'Failed to delete board', severity:'error'})
        setTimeout(()=>{
          setAlert({...alert, show:false})
        },5000)
      }
    }
  }
  const handleCancleDelete = ()=>{
    setIsPopupVisible(false);
    setBoardToDelete(null);
  }

  const handleDelete = async(id) =>{
    try{
      await deleteBoard(id);
      loadBoards();
      return true;
    }catch(error){
      console.error('Error deleting board:', error);
      return false;
    }
  }

  // END DELETE 

  //ARCHIVE
  const [isArchivePopupVisible, setIsArchivePopupVisible] = useState(false);
  // const [alert2, setAlert2] = useState({show:false, message:'', severity:''})
  const handleConfirmArchive = async(id)=>{
    setIsArchivePopupVisible(false);
    try{
      await archiveBoard(id);
      setAlert({show:true, message:'Boards has been successfully archived', severity:'success'})
      setTimeout(()=>{
        setAlert(prevState => ({ ...prevState, show:false}))
      }, 5000)
      loadBoards();
    }catch(error){
      setAlert({show:true, message:'Failed to archive board. Please try again later', severity:'error'})
      setTimeout(()=>{
        setAlert(prevState => ({ ...prevState, show:false}))
      }, 5000)
    }
  };
  useEffect(()=>{
    loadBoards();
  },[])

  const handleArchive = (boardId) => {
    setIsArchivePopupVisible(true);
    setSelectedBoard(boardId)
  }
  const handleCancleArchive = () => {
    setIsArchivePopupVisible(false)
  }
  //END ARCHIVE

    const toggleFormVisibility = () => {
        setShowForm(!showForm)
    }

    //bg selection option
    const toggleBgVisibility = () => {
      setShowBg(!showBg);
    }

    const handleBgSelect = (bg) => {
      setSelectBg(bg);
      setShowBg(false);
    }


    //ACTION
    const toggleActionThreeDot = (boardId, event) => {
      event.stopPropagation();
      setShowAction(showAction === boardId ? null : boardId)
      console.log('button berhasil di klik')
    }

    const fetchBoards = useCallback(async () => {
      try{
        const response = await getBoardByWorkspace(workspaceId);
        setBoards(response.data);
      }catch(error){
        console.error('Error fetching boards:', error);
        setAlert({show:true, message:'Error fetching boards', severity:'error'});
        setTimeout(()=> fetchBoards(), 3000)
      }
    }, [workspaceId]);


      const loadBoards = useCallback(async () => {
        if (!workspaceId) {
          console.error('Workspace ID is not available');
          return;
        }
      
        try {
          // Fetch boards for the workspace
          const response = await getBoard(workspaceId);
      
          if (response && response.data) {
            // Filter boards by workspace ID
            const filteredBoards = response.data.filter(board => board.workspace_id === Number(workspaceId));
            
            if (filteredBoards.length > 0) {
              setBoards(filteredBoards);
              
              // Fetch list counts for each board
              const listCounts = await Promise.all(filteredBoards.map(async (board) => {
                try {
                  const listCountResponse = await getListsCountByBoard(board.id);
                  return { boardId: board.id, count: listCountResponse.data?.list_count || 0 };
                } catch (listCountError) {
                  console.error(`Failed to load list count for board ${board.id}`, listCountError);
                  return { boardId: board.id, count: 0 };  // Set default count to 0 if there's an error
                }
              }));
      
              // Map list counts to board IDs
              const countMap = {};
              listCounts.forEach(({ boardId, count }) => {
                countMap[boardId] = count;
              });
      
              setListCount(countMap);
            } else {
              console.log('No boards found for this workspace.');
              setBoards([]);
              setListCount({});
            }
          } else {
            console.error('Invalid response data from getBoard');
            setBoards([]);
            setListCount({});
          }
      
        } catch (error) {
          console.error('Failed to load boards', error);
          setBoards([]); // Reset boards in case of failure
          setListCount({}); // Reset list counts in case of failure
        }
      }, [workspaceId]);
      
   
    useEffect(()=>{
      if(workspaceId){
        loadBoards();
      }
    }, [workspaceId, loadBoards])

      useEffect(()=>{
        setLocalBoardId(boardId);
      }, [boardId]);

      useEffect(()=> {
        const fetchBoardData= async () =>{
          try{
            const response = await getBoard(boardId);
            setBoardData(response.data) ;
            setBackgroundImage(response.data.backgroundImageUrl)
          }catch(error){
            console.error('Error fetching board:', error)
          }
        };

        if(boardId){
          fetchBoardData();
        }
      },[boardId])


      // create board 
      const [alert1, setAlert1] = useState({show:false, message:'', severity:''})
      useEffect(()=>{
        console.log('Alert state updated:', alert1)
      }, [alert1])

      const handleCreateBoard = async () =>{
        try{
          const successResponse = await createBoard({ ...newBoard,workspace_id: workspaceId})

          if(successResponse && successResponse.status === 200){
            setAlert({show:true, message:'Success create new board', severity:'success'})

            setTimeout(()=>{
              setAlert(prevState => ({ ...prevState, show:false}));
            }, 5000)
          }else{
            setAlert({show:true, message:'Failed to create new board', severity:'error'});
            setTimeout(()=>{
              setAlert(prevState => ({ ...prevState, show:false}))
            },5000)
          }

          loadBoards();
          setShowForm(false);
        }catch(error){
          setAlert({show:true, message:'Error occurred while creating board', severity:'error'}) //cek lagi untuk pesan error berikut
          setTimeout(()=>{
            setAlert(prevState => ({ ...prevState, show:false}))
          },5000);
          console.error('Error creating board', error)
        }
      }

    const handleDuplicateBoard = async (boardIdToDuplicate, targetWorkspaceId) => {
      const boardToDuplicate = boards.find(board => board.id === boardIdToDuplicate);
      if (boardToDuplicate) {
          const duplicateBoardData = {
              name: `${boardToDuplicate.name} (Copy)`,
              description: boardToDuplicate.description,
              workspace_id: targetWorkspaceId,
              backgroundImageUrl: boardToDuplicate.backgroundImageUrl,
          };
          try {
              await createBoard(duplicateBoardData);
              loadBoards();
              setAlert({ show: true, message: `Board successfully duplicated to workspace: ${targetWorkspaceId}`, severity:'success' });
          } catch (error) {
              console.error('Error duplicating board:', error);
              setAlert({ show: true, message: 'Error duplicating board', severity:'error' });
          }
      }
  };

  const handleDuplicateClick = (boardId) => {
    setSelectedBoard(boardId);
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedBoard(null)
  }

    //navigate
    const handleNavigateToBoardView = (boardId) =>{
        navigate(`/workspaces/${workspaceId}/boards/${boardId}`)
    }

    const handleBackToWorkspace = () =>{
        navigate('/')
    }


    return (
      
      <div 
        className='board-container'
        style={{
          minHeight:'100vh',
          backgroundImage: selectedBackground ? `url(${selectedBackground.image_url})`:'none',
          backgroundSize: 'cover',
          backgroundPosition:'center',
          transition:'background-image 0.3s ease-in-out'
        }}
      >
        <div className="board-title">
          <div className="board-title-navigation">
            <button onClick={handleBackToWorkspace} className='back-button'>
                <HiOutlineSquaresPlus style={{marginRight:'4px'}}/>
                Workspace
            </button>
            /
            <button>
              Boards
            </button>
          </div>
          <div className="dropdown-right">
            <div className='create-board-button'>
              <button className='newBoard' onClick={toggleFormVisibility}>
                {/* {showForm ? 
                  (<><HiOutlineX size={12} style={{marginRight:'5px'}}/>Cancel</>) : 
                  (<><HiPlus size={12} style={{marginRight:'5px'}}/>NEW BOARD</>)
                } */}
                <HiPlus size={12} style={{marginRight:'5px'}}/>
                NEW BOARD
              </button>
            </div>
            |
            <button className='btn-bg' onClick={()=> setIsDropdownOpen(!isDropdownOpen)}>
              {selectedBackground ? selectedBackground.name: 'Select Background'}
              <MdOutlineImagesearchRoller style={{marginLeft:'5px'}}/>
            </button>
            {isDropdownOpen && (
              <ul className='dropdown-list'>
                {Data_Bg.map((bg)=>(
                  <li key={bg.id} onClick={()=> handleBgSelect1(bg)}>
                      <img src={bg.image_url} alt={bg.name} />
                      {bg.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
          {alert.show && (
              <AlertTitle
                severity={alert.severity}
                style={{marginBottom:'20px'}}
              >
                {alert.message}
              </AlertTitle>
            )}

          <div className="board-list-content">
            {boards.map((board)=>{
              return(
                <div key={board.id} className="list-boards">
                  <div className="board-cards"  onClick={(e)=> handleNavigateToBoardView(board.id)} >
                    <div className="board-card-title">
                      <LuLayoutDashboard size={15} style={{color:'#97271C'}}/>
                      <div className="tooltip-container">
                        <HiDotsHorizontal
                          className='dot-nav'
                          onClick={(e)=> toggleActionThreeDot(board.id, e)}
                        />
                        <span className='tooltip-text'>More Settings</span>
                        
                      </div>
                      {showAction === board.id && (
                          <div className="dropdown-board-action active">
                            <h5>View</h5>
                            <div className="dropdown-action">
                              <div className="action-btn" onClick={(e)=> {e.stopPropagation(); handleEditBoardClick(board)}}>
                                <FaRegEdit className='ikon'/>
                                <button>Edit Board</button>
                              </div>
                              <div className="action-btn" onClick={(e)=> {e.stopPropagation(); handleArchive(board.id)}}>
                                <BsArchive className='ikon'/>
                                <button>Archive Board</button>
                              </div>
                              <div className="action-btn" onClick={(e)=> {e.stopPropagation(); handleDuplicateClick(board.id)}}>
                                <HiPlus className='ikon'/>
                                <button>Duplicate Board</button>
                              </div>
                              <div className="action-btn-remove" onClick={(e)=> {e.stopPropagation(); handleDeleteClick(board.id)}}>
                                <AiOutlineDelete className='ikon-remove'/>
                                <button>Delete Board</button>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="boards-text">
                      <h4>{board.name}</h4>
                      <p>{board.description}</p>
                    </div>
                    <div className="boards-icons">
                      <p><HiOutlineServer size={12} style={{marginRight:'2px', color:'black'}}/>{listCount[board.id] || 0} lists</p>
                      <p className='date'><HiOutlineCalendar size={12} style={{marginRight:'2px', color:'black'}}/>{moment(board.create_at).format(('D MMMM YYYY'))}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
            
            {showForm && (
              <div className="popup-overlay-create-board">
                <div className="popup-content-create-board">
                  <div className="header-popup">
                      <h5>Create Board</h5>
                      <IoCloseOutline onClick={()=>setShowForm(false)} style={{color:'grey'}}/>
                  </div>
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
                  </div>
                  <div className="board-button">
                    <button className='board-button' onClick={handleCreateBoard}>Add Board</button>
                  </div>
                </div>
              </div>
              
              )}
        
          
          
        
        {isPopupOpen && (
          <DuplicateBoardPopup
            boardId={selectedBoard}
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
          />
        )}
        {isPopupVisible && (
          <DeleteCardPopup
            isOpen={isPopupVisible}
            onClose={handleCancleDelete}
            onDeleteConfirm={handleConfirmDelete}
          />
        )}
        {isArchivePopupVisible && (
          <ArchiveCardPopup
            boardId ={selectedBoard}
            isOpen={isArchivePopupVisible}
            onClose={handleCancleArchive}
            onArchiveConfirm={handleConfirmArchive}
          />
        )}
        {isEditingBoardVisible && (
          <BoardEdit
            board={editBoard}
            onClose={handleCloseEditBoard}
            onSave={loadBoards}
            onStopPropagation={(e)=>{e.stopPropagation()}}
          />
        )}
      </div>
  )      
}

export default Board