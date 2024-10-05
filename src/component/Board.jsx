import React, { useCallback, useEffect, useState } from 'react'
import { getBoard, createBoard,getListsCountByBoard, updateBoardBackground, duplicateBoard, getBoardByWorkspace, deleteBoard, archiveBoard} from '../services/Api'
import { useNavigate, useParams } from 'react-router-dom';
import { HiArchive,HiPlus,HiOutlineX,HiDotsHorizontal, HiOutlineServer, HiOutlineCalendar,HiChevronRight, HiChevronDown, HiChevronUp  } from "react-icons/hi";
import '../style/BoardStyle.css'
import moment from 'moment'
import { LuUsers } from "react-icons/lu";
import { AiFillDelete } from "react-icons/ai";
import { Data_Bg } from '../data/DataBg';
import DuplicateBoardPopup from './DuplicateBoardPopup';
import { AlertTitle } from '@mui/material';

const Board = () => {
    const {boardId, workspaceId} = useParams();
    const [workspaces, setWorkspaces] = useState([]);
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
      console.error('Error deleting workspace:', error);
      return false;
    }
  }

  // END DELETE 

  //ARCHIVE
  const [isArchivePopupVisible, setIsArchivePopupVisible] = useState(false);
  const [alert2, setAlert2] = useState({show:false, message:'', severity:''})
  const handleConfirmArchive = async(id)=>{
    setIsArchivePopupVisible(false);
    try{
      await archiveBoard(id);
      setAlert2({show:true, message:'Boards has been successfully archived', severity:'success'})
      setTimeout(()=>{
        setAlert2(prevState => ({ ...prevState, show:false}))
      }, 5000)
      loadBoards();
    }catch(error){
      setAlert2({show:false, message:'Failed to archive board. Please try again later'})
      setTimeout(()=>{
        setAlert2(prevState => ({ ...prevState, show:false}))
      }, 5000)
    }
  };
  useEffect(()=>{
    loadBoards();
  },[])

  const handleArchive = () => {
    setIsArchivePopupVisible(true);
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

    const toggleActionThreeDot = (boardId, event) => {
      event.stopPropagation();
      setShowAction(showAction === boardId ? null : boardId)
      console.log('button berhasil di klik')
    }

    //fetch workspace
    // const fetchBoards = async (workspaceId) => {
    //   const response = await getBoardByWorkspace(workspaceId);
    //   setBoards(response.data)
    // }

    const fetchBoards = async (workspaceId) => {
      try{
        const response = await getBoardByWorkspace(workspaceId);
        setBoards(response.data);
      }catch(error){
        console.error('Error fetching boards:', error)
        alert('Gagal memuat boards')
      }
    }

    useEffect(()=> {
      fetchBoards(workspaceId);
    }, [workspaceId]);

//   const handleAction = async (event,boardId, action) => {
//     console.log(`Action: ${action} for board: ${boardId}`);
//     event.stopPropagation();

//     if (action === 'duplicate') {
//         if (!boardId) {
//             console.error('Board ID is undefined!');
//             return; // Hentikan eksekusi jika boardId tidak ada
//         }

//         try {
//             console.log('Attempting to duplicate board with ID:', boardId);
//             const duplicateBoardResponse = await duplicateBoard(boardId);
//             console.log('Board duplicated successfully:', duplicateBoardResponse);
//             loadBoards();
//         } catch (error) {
//             console.error('Failed to duplicate board:', error);
//         }
//     }
//     setShowAction(null);
// };

    const handleAction = async(event,boardId,action) => {
      event.stopPropagation();
      if(action === 'duplicate'){
        setSelectedBoard(boardId);
        setIsPopupOpen(true);
      }
      setShowAction(null)
    }

    // // open and close popup 
    // const openPopup = (boardId)=> {
    //   setSelectedBoard(boardId);
    //   setIsPopupOpen(true);
    // }
    // const closePopup = () => {
    //   setIsPopupOpen(false);
    //   setSelectedBoard(null);
    // }



        // Load boards based on workspace ID
        const loadBoards = useCallback(async () => {
          try {
              const response = await getBoard(workspaceId);
              const filteredBoards = response.data.filter(board => board.workspace_id === Number(workspaceId));
              setBoards(filteredBoards);
  
              // Fetch list countso
              const listCounts = await Promise.all(filteredBoards.map(async (board) => {
                  const listCountResponse = await getListsCountByBoard(board.id);
                  return { boardId: board.id, count: listCountResponse.data.list_count };
              }));
  
              const countMap = {};
              listCounts.forEach(({ boardId, count }) => {
                  countMap[boardId] = count;
              });
              setListCount(countMap);
          } catch (error) {
              console.error('Failed to load boards', error);
          }
      }, [workspaceId]);

    //Hook, useEffect hook yang digunakan untuk menampilkan data boards berdasarkan workspaceID yang dipanggila
    useEffect(()=>{
      console.log('Fetching data boards from workspaceid:', workspaceId);
      loadBoards();
    },[workspaceId,loadBoards])

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


      //handle backgorund
      const handleBackgroundChange = async (newImageId) => {
        try{
          await updateBoardBackground(boardId,newImageId)
          setBackgroundImage(`updateBoardBackground`)
        }catch(error){
          console.error('Error updating background', error)
        }
      }

      // create board 
      const [alert1, setAlert1] = useState({show:false, message:'', severity:''})
      useEffect(()=>{
        console.log('Alert state updated:', alert1)
      }, [alert1])

      const handleCreateBoard = async () =>{
        try{
          const successResponse = await createBoard({ ...newBoard,workspace_id: workspaceId})

          if(successResponse && successResponse.status === 200){
            setAlert1({show:true, message:'Success create new board', severity:'success'})

            setTimeout(()=>{
              setAlert1(prevState => ({ ...prevState, show:false}));
            }, 5000)
          }else{
            setAlert1({show:true, message:'Failed to create new board', severity:'error'});
            setTimeout(()=>{
              setAlert1(prevState => ({ ...prevState, show:false}))
            },5000)
          }

          loadBoards();
          setShowForm(false);
        }catch(error){
          setAlert1({show:true, message:'Error occurred while creating board', severity:'error'})
          setTimeout(()=>{
            setAlert1(prevState => ({ ...prevState, show:false}))
          },5000);
          console.error('Error creating board', error)
        }
      }

    //duplicate 
    const handleDuplicateBoard = async (boardIdToDuplicate, targetWorkspaceId)=> {
      fetchBoards(workspaceId);
      const boardToDuplicate = boards.find(board => board.id === boardIdToDuplicate);

      if (boardToDuplicate){
        const duplicateBoardData = {
          name : `${boardToDuplicate.name} (Copy)`,
          description: boardToDuplicate.description,
          workspace_id: targetWorkspaceId, //menggunakan workspace tujuan
          backgroundImageUrl: boardToDuplicate.backgroundImageUrl
        };
        try{
          await createBoard(duplicateBoardData);
          loadBoards();
          alert(`Board berhasil diduplikasi ke workspace: ${targetWorkspaceId}`);
        }catch(error){
          console.error('Error duplicate board:', error)
        }
      }
    }

    //navigate
    const handleNavigateToBoardView = (boardId) =>{
        navigate(`/workspaces/${workspaceId}/boards/${boardId}`)
    }

    const handleBackToWorkspace = () =>{
        navigate('/')
    }

    const handleBoardDuplicate = async (workspaceId)=> {
      const updatedBoards = await getBoardByWorkspace(workspaceId);
      setBoards(updatedBoards);
    }


    return (
          <div 
            className='board-container' 
            style={{
              backgroundImage: selectBg ? `url(${selectBg.image_url})`: 'none' ,
              backgroundSize: 'cover', 
              backgroundPosition:'center'
              }}>
          <div className='nav-board' >
            <div className='nav-board2'>
              <h3 style={{display:'flex',textAlign:'left', color:'white', marginBottom:'0', margin:'0', width:'20vw', alignItems:'center', gap:'10px'}}>
                <button onClick={handleBackToWorkspace} className='btn-nav' >Workspace</button> 
                <HiChevronRight style={{ fontSize:'1.5rem', flexShrink:'0'}} />
                <button className='btn-nav' style={{textAlign:'left'}}>Board</button>
              </h3>
              <div style={{position:'relative'}}>
                <button className='btn-bg' onClick={toggleBgVisibility}>
                  {showBg ?
                  (<>Background <HiChevronUp size={20} className='btn-icon'/></>):(<>Select Background <HiChevronDown size={20} className='btn-icon'/></>)  
                }
                </button>
                {showBg && (
                  <div style={{
                      backgroundColor:'white',
                      border:'0.1px solid grey',
                      borderRadius:'5px',
                      boxShadow:'0px 4px 8px rgba(0,0,0,0.1)',
                      padding:'5px',
                      width:'137px',
                      height:'100px',
                      overflowY:'auto',
                      position:'absolute',
                      zIndex:'1000',
                      top:'100%'
                  }}>
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
            <h5 style={{textAlign:'left', color:'white',paddingLeft:'10px', margin:'0'}}>Happy days, here your boards!</h5>
          </div>

                  {/* Alert  */}
                  {alert.show && (
                    <AlertTitle
                      severity={alert.severity}
                      style={{marginBottom:'20px'}}
                    >
                      {alert.message}
                    </AlertTitle>
                  )}
                  {/* End Alert  */}
  
          <div className='board-list-container'>
            <div className='board-list'>
              {boards.map((board) => (
                  <div key={board.id} className='board-card' onClick={() => handleNavigateToBoardView(board.id)}>
                    <h4 style={{display:'flex', fontSize:'15px', fontWeight:'bold', justifyContent:'space-between', margin:'5px 0'}} >
                      {board.name} 
                      <HiDotsHorizontal 
                        className='dot-btn'
                        onClick={(e)=> toggleActionThreeDot(board.id, e)}
                        />
                    </h4>

                    {showAction === board.id && (
                      <div className='board-dropdown-menu-action' style={{height:'100px'}}>
                        <ul className='dropdown-ul'>
                          Actions
                          <li className='dropdown-li'>
                            <AiFillDelete className='ikon' size={15} />
                            <button className='btn-li' onClick={(e) => {e.stopPropagation(); handleDeleteClick(board.id)}}>
                              Delete <br />
                              <span style={{fontSize:'10px', fontWeight:'normal'}}>Delete Board</span>
                            </button>

                            {isPopupVisible && (
                              <div className='popup-overlay'>
                                <div className='popup-content'>
                                  <h3>Konfirmasi penghapusan</h3>
                                  <p>Apakah anda yakin ingin menghapus board ini?</p>
                                  <button className='btn-confirm' onClick={(e)=> {e.stopPropagation(); handleConfirmDelete()}}>Ya, hapus</button>
                                  <button className='btn-confirm' onClick={(e) => {e.stopPropagation(); handleCancleDelete()}}>Batal</button>
                                </div>
                              </div>
                            )}
                          </li>
                           <li className='dropdown-li'>
                            <HiArchive className='ikon' size={15} />
                            <button className='btn-li' onClick={(e) => {e.stopPropagation(); handleArchive(board.id)}}>
                              Archive <br />
                              <span style={{fontSize:'10px', fontWeight:'normal'}}>Archive your board</span>
                            </button>
                            {isArchivePopupVisible && (
                              <div className='popup-overlay'>
                                <div className='popup-content'>
                                  <p>Dengan memindahkan board kedalam archive, berarti menghapus workspace pada halaman ini <br /> Apa anda yakin?</p>
                                  <button className='btn-confirm' onClick={(e)=> {e.stopPropagation(); handleConfirmArchive(board.id)}}>Archive</button>
                                  <button className='btn-confirm' onClick={(e)=> {e.stopPropagation(); handleCancleArchive()}}>Cancle</button>
                                </div>
                              </div>
                            )}
                          </li>
                          {/*
                          <li onClick={(event) => handleAction(event, board.id, 'duplicate')} className='dropdown-li'>
                            <HiPlus className='ikon' size={15} />
                            <div >
                              Duplicate <br />
                              <span style={{ fontSize: '10px', fontWeight: 'normal' }}>Duplicate your boards</span>
                            </div>
                          </li> */}
                        </ul>
                      </div>
                    )}

                    {/* {showAction === board.id && (
                      <div className='board-dropdown-menu-action'>
                        <ul className='dropdown-ul'>
                          Actions
                          <li onClick={(event) => handleAction(event, board.id, 'delete')} className='dropdown-li'>
                            <AiFillDelete className='ikon' size={15} />
                            <div style={{ size: '10px' }}>
                              Delete <br />
                              <span style={{ fontSize: '10px', fontWeight: 'normal' }}>Delete workspace</span>
                            </div>
                          </li>
                          <li onClick={(event) => handleAction(event, board.id, 'archive')} className='dropdown-li'>
                            <HiArchive className='ikon' size={15} />
                            <div>
                              Archive <br />
                              <span style={{ fontSize: '10px', fontWeight: 'normal' }}>Archive your workspace</span>
                            </div>
                          </li>
                          <li onClick={(event) => handleAction(event, board.id, 'duplicate')} className='dropdown-li'>
                            <HiPlus className='ikon' size={15} />
                            <div >
                              Duplicate <br />
                              <span style={{ fontSize: '10px', fontWeight: 'normal' }}>Duplicate your boards</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                    {isPopupOpen && (
                      <DuplicateBoardPopup
                        isOpen={isPopupOpen}
                        onClose={closePopup}
                        workspace={workspaceId}
                        boardId={selectedBoard}
                        // onDuplicate={handleDuplicateBoard}
                        onBoardDuplicate={handleDuplicateBoard}
                      />
                    )} */}
                    <div style={{paddingRight:'5px', height:'4vh'}}>
                      <p className='board-description'>{board.description}</p>
                    </div>
                    <div className='board-icons'>
                      <p><HiOutlineServer size={15} style={{marginRight:'2px', color:'black'}}/>{listCount[board.id] || 0} lists</p>
                      <p><HiOutlineCalendar size={15} style={{marginRight:'2px', color:'black'}}/>{moment(board.create_at).format(('D MMMM YYYY'))}</p>
                      <p><LuUsers size={15} style={{marginRight:'2px', color:'black'}}/>0 member</p>
                    </div>
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

                {/* ALERT  */}
                {/* create board alert  */}
                {alert1.show && (
                  <AlertTitle
                    severity={alert1.severity}
                    style={{marginBottom:'20px'}}
                  >
                    {alert1.message}
                  </AlertTitle>
                )}

                {/* archive board  */}
                {alert2.show && (
                  <AlertTitle
                    severity={alert2.severity}
                    style={{marginBottom:'20px'}}
                  >
                    {alert.message}
                  </AlertTitle>
                )}
                {/* END ALERT  */}
          </div>
        </div>
      </div>
  )      
}

export default Board
