import React, { useEffect, useState } from 'react'
import { getCards, createCard, deleteList, archiveLists, deleteCard, archiveCard} from '../services/Api'
import { useNavigate, useParams } from 'react-router-dom';
import '../style/ListStyle.css'
import { BsThreeDots } from "react-icons/bs";
import { TfiCommentAlt } from "react-icons/tfi";
import { FaPlus, FaRegEdit} from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import { FaPlay } from "react-icons/fa6";
import { HiDotsVertical, HiArchive, HiChevronUp, HiChevronDown, HiPlus,HiOutlineViewList } from "react-icons/hi";
import { AiFillDelete } from "react-icons/ai";
import { Data_Cover } from '../data/DataCover.js';
import { AlertTitle } from '@mui/material';
import DuplicateListPopup from './DuplicateListPopup.jsx';
import DuplicateCardPopup from './DuplicateCardPopup.jsx';
import DeleteListPopup from '../popup/DeleteListPopup.jsx';
import ArchiveListPopup from '../popup/ArchiveListPopup.jsx';
import EditList from '../popup/EditList.jsx';
import EditCard from '../popup/EditCard.jsx';
import DeleteCard from '../popup/DeleteCard.jsx';
import ArchiveCard from '../popup/ArchiveCard.jsx';


const List=({listId, listName, loadLists, onDelete, handleAlert })=> {
    const {workspaceId, boardId} = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [cardId, setCardId] = useState(null);
    const [newCard, setNewCard] = useState({title:'', description:'', position:0, cover_image_url:null})
    const [showForm, setShowForm] = useState(false);
    const [showAction, setShowAction] = useState(null);
    const [showCover, setShowCover] = useState(false);
    const [selectCover, setSelectCover] = useState(null);
    //DELETE 
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [listToDelete, setListToDelete] = useState(null);
    const [alert, setAlert] = useState({show:false, message:'', severity:''})
    const [alert1, setAlert1] = useState({show:false, message:'', severity:''})
    //ARCHIVE
    const [isArchivePopupVisible, setIsArchivePopupVisible] = useState(false);
    //list popup
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    //edit list 
    const [editList, setEditList] = useState(null)
    const  [isEditListOpen, setIsEditListOpen] = useState(false);

    //EDIT LIST
    const handleEditListClick = (listId) => {
      setEditList(listId);
      setIsEditListOpen(true);
      console.log('List ID:', listId)
    }

    const handleCloseEditBoard = () =>{
      setEditList(null)
      setIsEditListOpen(false);
    }


    //FUNCION DELETE
    const handleDeleteClick = (listId) =>{
      setListToDelete(listId)
      setIsPopupVisible(true)
      console.log('tombol delete berhasil di klik')
    }

    const handleConfirmDelete = async()=>{
      if(listToDelete){
        await onDelete(listToDelete);
        setIsPopupVisible(false);
        setListToDelete(null);
        setAlert({ show: true, message: 'Successfully deleted list', severity: 'success' });
        console.log('list berhasil dihapus')
      }
    }

    useEffect(()=>{
      if (alert.show){
        setTimeout(()=>{
          setAlert({...alert, show:false})
        }, 5000)
      }
    }, [alert])

    const handleCancleDelete = () =>{
     setIsPopupVisible(false)
     setListToDelete(null)
     setAlert1({show:true, message:'batal menghapus list', severity:'success'})
    }
    
    const handleDelete = () =>{
      onDelete(listToDelete);
    }

  
    //END FUNCION DELETE

    //ARCHIVE 
    const handleConfirmArchive = async (id)=>{
      setIsArchivePopupVisible(false);
      console.log('Archiving list with ID:', listId);
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
    }, [])

    const handleArchive = () =>{
      setIsArchivePopupVisible(true)
      console.log('handleArchive success')
    }
    const handleCancleArchive= () =>{
      setIsArchivePopupVisible(false)
      console.log('handleCancle works')
    }
    //END ARVHIVE

    const toggleFormVisibility = () => {
      setShowForm(!showForm)
    }

    //cover
    const toggleCoverVisibility = ()=>{
      setShowCover(!showCover)
    }

    const handleCoverSelect = (cover) => {
      setSelectCover(cover.cover_image_url);//edit1
      setNewCard((prevCard) => ({
         ...prevCard,
          cover_image_url: cover.cover_image_url,//edit2
        }));
      setShowCover(false);
    }

    const toggleActionThreeDotList = (listId, event)=>{
      event.stopPropagation();
      setShowAction(showAction === listId ? null : listId)
      console.log('button pada list berhasil di klik')
    }

    const handleAction = (listId, action) => {
      console.log(`Action: ${action} for lists: ${listId}`)
      setShowAction(null);
    }

    const toggleActionCard = (cardId, event)=>{
      event.stopPropagation();
      setShowAction(showAction === cardId ? null : cardId)
      console.log('button berhasil di klik')
    }

    const loadCards = async () => {
      console.log('Loading cards for listId:', listId);
      try {
          const response = await getCards(listId);
          console.log('Received cards data:', response.data);
          setCards(response.data.filter(card => card.list_id === Number(listId)));
      } catch (error) {
          console.error('Failed to load cards:', error);
      }
  };

  useEffect(() => {
    if (listId){
      loadCards();
    }
  }, [listId]);

      const handleCreateCard = async () => {
        try{
          await createCard({
            ...newCard,
            list_id:listId
          })
          loadCards();
          setShowForm(false);
          setNewCard({
            title:'',
            description:'',
            position:'',
            cover_image_url:''
          })
        }catch(error){
          console.error('Failed to create card', error)
        }
      }


      const handleToCardModal = (cardId, event) => {
        event.stopPropagation();
        console.log(`Navigating to card modal with ID: ${cardId}`)
        navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}/modal`)
      }
      const handleToCardDetail = (cardId) => {
        console.log(`Navigating to card detail with ID : ${cardId}`)
        navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}`);
      };

      //DUPLICATE LIST
      const handleDuplicateClick = () =>{
        setSelectedList(listId);
        setIsPopupOpen(true);
      }

      //POPUP LIST
      const handleClosePopupList=() =>{
        setIsPopupOpen(false);
        setSelectedList(null);
      }

      //CARD 
      //CARD STATE
      //CARD DELETE
      const [isCardPopupVisible, setIsCardPopupVisible] = useState(false);
      const [cardToDelete, setCardToDelete] = useState(null);
      const [cardAlert, setCardAlert] = useState({
        show:false, message:'', severity:''
      })
      //CARD ARCHIVE
      const [isCardArchivePopupVisible, setIsCardArchivePopupVisible] = useState(false)
      //CARD DUPLICATE
      const [isPopupCardOpen, setIsPopupCardOpen] = useState(false);
      const [selectedCard, setSelectedCard] = useState(null);

      //CARD FUNGSIONALITAS
      //DELETE CARD
      const handleDeleteCardClick = (cardId) =>{
        setCardToDelete(cardId)
        setIsCardPopupVisible(true)
        console.log('tombol delete card berhasil di klik')
      }

      const handleConfirmDeleteCard = async () =>{
        if(cardToDelete){
          await deleteCard(cardToDelete);
          setIsCardPopupVisible(false);
          setCardToDelete(null);
          // setCardAlert({show:true, message:'Sucessfully deleted card', severity:'success'});
          handleAlert('Succesfully deleted card','success')
          loadCards();
          console.log('card berhasil dihapus')
        }
      }
      useEffect(()=>{
        if(cardAlert.show){
          setTimeout(()=>{
            setCardAlert({...cardAlert, show:false})
          }, 5000)
        }
      }, [cardAlert])

      const handleCancleDeleteCard = () =>{
        setIsCardPopupVisible(false);
        setCardToDelete(null)
        handleAlert('Batal menghapus list', 'error')
        // setCardAlert({show:true, message:'batal menghapus list', severity:'success'})
      }

      const handleDeleteCard = async(id) =>{
        try{
          await deleteCard(id);
          loadCards();
          return true;
        }catch(error){
          console.error('Error deleting card:', error)
          return false;
        }
      }

      //CARD ARCHIVE 
      const handleConfirmArchiveCard = async (cardId) =>{
        setIsCardArchivePopupVisible(false);
        console.log('Archiving card with Id', cardId);
        try{
          const response = await archiveCard(cardId);
          setAlert({show:true, message:'Card has been successfully archived', severity:'success'});
          setTimeout(()=>{
            setAlert(prevState => ({...prevState, show:false}))
          }, 5000)
          loadCards();
          console.log(response)
        }catch(error){
          setAlert({show:true, message:'Failed to archive card. Please try again later.', severity:'error'})
          setTimeout(()=>{
            setAlert(prevState => ({ ...prevState, show:false}))
          }, 5000)
          console.error('Error while archiving card:', error)
        }
      }
      useEffect(()=>{
        loadCards();
      },[])

      const handleArchiveCard = () =>{
        setIsCardArchivePopupVisible(true)
        console.log('fungsi handle archive card success')
      }
      const handleCancleArchiveCard = () =>{
        setIsCardArchivePopupVisible(false);
        console.log('fungsi handle cancle archive works!')
      }

      //DUPLICATE CARD
      const handleDuplicateCard = (cardId) =>{
        setSelectedCard(cardId);
        setIsPopupCardOpen(true);
      }

      const handleCardDuplicated = (newCard) => {
        setCards(prevCard => [...prevCard, newCard])
      };

      //POPUP LIST
      const handleClosePopupCard = ()=>{
        setIsPopupCardOpen(false);
        setSelectedCard(null);
      }

      //EDIT CARD
      const [editCard, setEditCard] = useState(null)
      const [isEditCardOpen, setIsEditCardOpen] = useState(false);

      const handleCardEditClick = (cardId) =>{
        setEditCard(cardId);
        setIsEditCardOpen(true);
        console.log('Card Id:', cardId)
      }
      const handleCloseEditCard = () =>{
        setEditCard(null);
        setIsEditCardOpen(false);
      }

      //END CARD 

      return (
        <div className='list-container'>
          <div className='title'>
            <p style={{display:'flex', alignItems:'center'}}>
              <FaPlay style={{marginRight:'8px', color:'#333'}}/>
              {listName}
            </p>
            <p>
              <BsThreeDots
                className='dot-btn'
                onClick={(e)=> toggleActionThreeDotList(listId, e)}
              />
              {showAction === listId && (
                <div className='dropdown-menu-action' style={{height:'27vh'}}>
                  <ul className='dropdown-ul'>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between',color:'#491519'}}>
                      Action 
                      <HiOutlineViewList/>
                    </div>
                    <hr style={{color:'#491519'}}/>
                    <li className='dropdown-li'>
                      <AiFillDelete className='ikon' size={20}/>
                      <button className='btn-li' onClick={(e)=> {e.stopPropagation(); handleDeleteClick(listId)}}>
                        Delete <br />
                        <span style={{fontSize:'10px', fontWeight:'normal'}}>Delete list</span>
                      </button>
                    </li>
                     <li className='dropdown-li'>
                      <HiArchive className='ikon' size={20}/>
                      <button className='btn-li' onClick={(e)=> {e.stopPropagation(); handleArchive(listId)}}>
                        Archive <br />
                        <span style={{fontSize:'10px', fontWeight:'normal'}}>Archive your list</span>
                      </button>
                    </li>
                    
                    <li className='dropdown-li'>
                      <HiPlus className='ikon' size={20}/>
                      <button className='btn-li' onClick={(e)=>  {e.stopPropagation(); handleDuplicateClick(listId)}}>
                        Duplicate <br />
                        <span style={{fontSize:'10px', fontWeight:'normal'}}>Duplicate your list</span>
                      </button>
                    </li>
                    <li className='dropdown-li'>
                        <FaRegEdit className='ikon' size={20}/>
                        <button className='btn-li' onClick={(e)=> {e.stopPropagation();handleEditListClick(listId) }}>
                          Edit <br />
                          <span style={{fontSize:'10px', fontWeight:'normal'}}>Edit your list</span>
                        </button>
                    </li>
                  </ul>
                </div>
              )}
            </p>
          </div>


          <hr style={{opacity:'50%'}}/>
          <div className='card-list-lists'>
          {cards.map((card) => (
            <div key={card.id} className='card-item-lists' onClick={() => handleToCardDetail(card.id)}>
              <div>
                <p style={{display: 'flex', justifyContent: 'space-between', margin: '0'}}>
                  <strong>{card.title}</strong>
                  <HiDotsVertical
                    className='dot-btn'
                    onClick={(e)=> toggleActionCard(card.id, e)}
                  />
                    {showAction === card.id && (
                    <div className='card-dropdown-menu-action'>
                      <ul className='dropdown-ul'>
                      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between',color:'#491519'}}>
                        Action 
                        <HiOutlineViewList/>
                      </div>
                      <hr style={{color:'#491519'}}/>
                        <li className='dropdown-li'>
                          <AiFillDelete className='ikon' size={20}/>
                          <button className='btn-li' onClick={(e) => {e.stopPropagation(); handleDeleteCardClick(card.id)}}>
                            Delete <br />
                            <span style={{fontSize:'10px', fontWeight:'normal'}}>Delete card</span>
                          </button>
                          {isCardPopupVisible && (
                            <div className='popup-overlay'>
                              <div className='popup-content'>
                                <h3>Konfirmasi Penghapusan</h3>
                                <p>Apakah anda ingin menghapus card ini?</p>
                                <button className='btn-confirm' onClick={(e)=> {e.stopPropagation(); handleConfirmDeleteCard()}}>Ya, hapus</button>
                                <button className='btn-confirm' onClick={(e) =>{e.stopPropagation(); handleCancleDeleteCard()}}>Cancle</button>
                              </div>
                            </div>
                          )}
                        </li>
                        <li className='dropdown-li'>
                          <HiArchive className='ikon' size={20}/>
                          <button className='btn-li' onClick={(e)=> {e.stopPropagation(); handleArchiveCard(card.id)}}>
                            Archive <br />
                            <span style={{fontSize:'10px', fontWeight:'normal'}}>Archive this card</span>
                          </button>
                          {isCardArchivePopupVisible &&(
                            <div className='popup-overlay'>
                              <div className='popup-content'>
                                <p>Dengan memindahkan card kedalam archive, <br /> berarti menghapus card pada halaman ini <br /> Apa anda yakin ? </p>
                                <button className='btn-confirm' onClick={(e) => {e.stopPropagation(); handleConfirmArchiveCard(card.id)}}>Archive</button>
                                <button className='btn-confirm' onClick={(e) => {e.stopPropagation(); handleCancleArchiveCard()}}>Batal</button>
                              </div>
                            </div>
                          )}
                        </li>
                        <li className='dropdown-li'>
                          <HiPlus className='ikon' size={20}/>
                          <button className='btn-li' onClick={(e)=> {e.stopPropagation(); handleDuplicateCard(card.id)}}>
                            Duplicate <br />
                            <span style={{fontSize:'10px', fontWeight:'normal'}}>Duplicate this card</span>
                          </button>
                        </li>
                        <li className='dropdown-li'>
                          <FaRegEdit className='ikon' size={20}/>
                          <button className='btn-li' onClick={(e)=> {e.stopPropagation(); handleCardEditClick(card.id) }}>
                            Edit <br />
                            <span style={{fontSize:'10px', fontWeight:'normal'}}>Edit your card</span>
                          </button>

                        </li>
                      </ul>
                    </div>
                  )}
                </p>
              </div>

              
             
              {cards.cover_image_url && (
                <div className='cover'>
                  <img src={cards.cover_image_url} alt={cards.name}/>
                </div>
              )}
             
              <p className='card-description'>{card.description}</p>

              <div style={{display: 'flex'}}>
                <div className='label'>
                  <button className='label1'>Ex 1</button>
                  <button className='label2'>Ex 2</button>
                  <button className='label3'>Ex 3</button>
                </div>
                <div className='fiture'>
                  <div className='fitur1'>
                    <TfiCommentAlt className='icon' size={13} />
                    <h6 style={{margin: '0'}}>12</h6>
                  </div>
                  <div className='fitur2'>
                    <GrAttachment className='icon' size={13} />
                    <h6 style={{margin: '0'}}>3</h6>
                  </div>
                </div>
              </div>
              <div className="fiture-container">
                <div>
                  <button onClick={(event) => handleToCardModal(card.id, event)} className='edit-btn'>
                    Edit Card
                  </button>
                </div>
              </div>
            </div>
          ))}

          </div>

          {/* Form input */}

          <button className='addButton' onClick={toggleFormVisibility}>
            {showForm ? 
              (<><ImCross style={{marginRight:'1vh'}}/>Cancle </>) : (<><FaPlus style={{marginRight:'1vh'}}/>Add Card</>)}
          </button>
              {showForm && (
                  <div className='card-form'>
                    <input
                      className='card-form-input'
                      type='text'
                      placeholder='Card Title'
                      value={newCard.title}
                      onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                    />
                    <input
                      className='card-form-input'
                      type='text'
                      placeholder='Description'
                      value={newCard.description}
                      onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                    />
                    <input
                      className='card-form-input'
                      type='text'
                      placeholder='Position'
                      value={newCard.position}
                      onChange={(e) => setNewCard({ ...newCard, position: e.target.value })}
                    />
                    <button className='btn' onClick={toggleCoverVisibility}>
                      {showCover ? 
                      (<>Select Cover <HiChevronUp/></>):(<>Select Cover <HiChevronDown/></>)  
                    }
                    </button>
                    {showCover && (
                      <div 
                      style={{
                          border:'0.1px solid grey',
                          borderRadius:'5px',
                          boxShadow:'0px 4px 8px rgba(0,0,0,0.1)',
                          padding:'5px',
                          width:'100px',
                          height:'130px',
                          overflowY:'auto'
                      }}>
                        {Data_Cover.map((cover)=>(
                          <div
                            className='coverImg'
                            key={cover.id}
                            onClick={()=> handleCoverSelect(cover)}
                            style={{marginBottom:'5px', cursor:'pointer'}}
                          >
                            <img src={cover.cover_image_url} alt={cover.name} />
                          </div>
                        ))}
                      </div>
                    )} 
                      <button className='add-btn' onClick={handleCreateCard}>Add Card</button>
                </div>
              )}

           {/* ALERT  */}
           {alert.show && (
              <AlertTitle className='alert-position' severity={alert.severity}>
                {alert.message}
              </AlertTitle>
            )}

            {/* LIST */}
            {isPopupVisible && (
              <DeleteListPopup
                listId={selectedList}
                isOpen={isPopupVisible}
                onClose={handleCancleDelete}
                onDeleteConfirm={handleConfirmDelete}
              />
            )}
            {isArchivePopupVisible && (
              <ArchiveListPopup
                listId={selectedList}
                isOpen={isArchivePopupVisible}
                onClose={handleCancleArchive}
                onArchiveConfirm={handleConfirmArchive}
              />
            )}
            {isPopupOpen && (
              <DuplicateListPopup
                listId={selectedList}
                isOpen={isPopupOpen}
                onClose={handleClosePopupList}
              />
            )}
            {isEditListOpen && (
              <EditList
                listId={listId}
                list = {editList}
                onClose={handleCloseEditBoard}
                onSave={loadLists}
              />
            )}

            {/* END LIST  */}

            {/* CARD  */}
            {isPopupCardOpen && (
              <DuplicateCardPopup
                cardId={selectedCard}
                isOpenCard={isPopupCardOpen}
                onCloseCard={handleClosePopupCard}
                loadCards={loadCards}
                onCardDuplicated = {handleCardDuplicated}
              />
            )}
            {isEditCardOpen && (
              <EditCard
                cardId={cardId}
                card = {editCard}
                onClose={handleCloseEditCard}
                onSave={loadCards}
              />
            )}
            {isCardPopupVisible && (
              <DeleteCard
                cardId={selectedCard}
                isOpen={isCardPopupVisible}
                onClose={handleCancleDeleteCard}
                onDeleteConfirm={handleConfirmDeleteCard}
              />
            )}
            {isCardArchivePopupVisible && (
              <ArchiveCard
                cardId={selectedCard}
                isOpen={isCardArchivePopupVisible}
                onClose={handleCancleArchiveCard}
                onArchiveConfirm={handleConfirmArchiveCard}
              />
            )}
            {/* END CARD  */}
            
          </div>
          
          
      );
}

export default List