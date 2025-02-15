import React, { useEffect, useState } from 'react'
import { getCards, createCard, deleteList, archiveLists, deleteCard, archiveCard, getCardById, getCardLabels, getSelectedCoverForCard} from '../services/Api'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../style/ListStyle.css'
import '../style/WorkspaceStyle.css'
import { BsArchive, BsThreeDots } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { FaPlus, FaRegEdit,FaGripLinesVertical} from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import { IoCloseOutline } from "react-icons/io5";
import { BsCalendar2Date } from "react-icons/bs";
import { HiOutlineChatBubbleOvalLeftEllipsis} from "react-icons/hi2";
import { HiDotsVertical, HiArchive, HiPlus, } from "react-icons/hi";
import { AiFillDelete, AiOutlineDelete } from "react-icons/ai";
import { AlertTitle } from '@mui/material';
import DuplicateListPopup from './DuplicateListPopup.jsx';
import DuplicateCardPopup from './DuplicateCardPopup.jsx';
import DeleteListPopup from '../popup/DeleteListPopup.jsx';
import ArchiveListPopup from '../popup/ArchiveListPopup.jsx';
import EditList from '../popup/EditList.jsx';
import EditCard from '../popup/EditCard.jsx';
import DeleteCard from '../popup/DeleteCard.jsx';
import ArchiveCard from '../popup/ArchiveCard.jsx';
import {  IoIosCard } from "react-icons/io";
import { useDate } from '../context/DateContext.jsx';
import DisplayDate from './DisplayDate.jsx';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiShoppingTag } from "react-icons/ci";
import LabelDisplay from '../fiture/LabelDisplay.jsx';
import SelectedLabel from './SelectedLabel.jsx';
import DisplayLabel from '../fiture/DisplayLabel.jsx';
import DisplayCover from '../fiture/DisplayCover.jsx';

const List=({listId, 
            listName, 
            loadLists,
            handleEditListClick, 
            handleCloseEditList,
            isEditListOpen,
            editList, 
            isPopupVisible,
            onClose,
            onDeleteConfirm,
            handleDeleteClick,
            // handleCancleDelete,
            handleConfirmDelete, 
            handleAlert,
            cardCount,
            handleDuplicateClick,
            handleClosePopupList,
            selectedList,
            isPopupOpen,
            handleArchive,
            handleCancleArchive,
            isArchivePopupVisible,
            handleConfirmArchive,
            card
          })=> {
    const {workspaceId, boardId} = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [cardId, setCardId] = useState(null);
    const [newCard, setNewCard] = useState({title:'', description:'', position:0, cover_image_url:null})
    const [showForm, setShowForm] = useState(false);
    const [showAction, setShowAction] = useState(null);
    const [showCover, setShowCover] = useState(false);
    //cover 
    // const {selectedCover} = useDate();
    const {covers} = useDate();

    
    const location = useLocation();
    //Search query
    const {searchQuery, setSearchQuery} = useDate();
    const [filteredCards, setFilteredCards] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    
    const [coverImage, setCoverImage] = useState(null);
    // const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState({});
    const [cover, setCover] = useState({});
    const [alert, setAlert] = useState({show:false, message:'', severity:''})

    //labels
    const {selectedLabels} = useDate();

    useEffect(()=>{
      console.log('Selected Labels:', selectedLabels);
    },[selectedLabels]);
    // const [labels, setLabels] = useState([]);

    // COVER 
    useEffect(() => {
      // Fetch cover data for each card on component mount
      cards.forEach((card) => {
        const savedCover = getCoverFromLocalStorage(card.id);
        if (savedCover) {
          setSelectedImage((prevState) => ({
            ...prevState,
            [card.id]: savedCover,
          }));
        }
      });
    }, [cards]);

    const getCoverFromLocalStorage = (cardId) => {
      const cover = localStorage.getItem(`cover_${cardId}`);
      return cover ? JSON.parse(cover) : null;
    };

    const isImage = (coverData) => {
      // Check if the cover is a valid image (data URL or image URL)
      return coverData.startsWith("data:image") || /\.(jpeg|jpg|png|gif)$/.test(coverData);
};

    // Efek pencarian
    useEffect(() => {
      const result = cards.filter(card =>
          card.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCards(result);
      setShowFilter(searchQuery.length > 0 && result.length > 0);
  }, [searchQuery, cards]);

  const handleCardSelect = (cardId) => {
      setSearchQuery('');  // Clear search after selection
      setShowFilter(false);  // Hide dropdown after selection
      // Arahkan ke detail card
      navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}`);
  };

 
   
  //NEW SELECT COVER

  const fetchImageForCard = (cardId) =>{
    try{
      const savedImage = localStorage.getItem(`cover_${cardId}`);
      if(savedImage){
        setSelectedImage(prevState => ({
          ...prevState,
          [cardId]: JSON.parse(savedImage)
        }));
      }
    } catch(error){
      console.error('Error loading card cover image:', error);
      setSelectedImage(prevState => ({
        ...prevState,
        [card.id]:null
      }))
    }
  }

  useEffect(()=>{
    cards.forEach(card =>{
      fetchImageForCard(card.id);
    })
  },[cards]);



    const toggleFormVisibility = () => {
      setShowForm(!showForm)
    }

    //cover
    const toggleCoverVisibility = ()=>{
      setShowCover(!showCover)
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

          // Pastikan setiap kartu memiliki cover_id
          // const validCards = filteredCards.filter(card => card.cover_id);
          // setCards(validCards);
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

      //POPUP CARD
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

      const [labelCard, setLabelCard] = useState([]);
      useEffect(() => {
        console.log('Current cardId:', cardId)
        if (!cardId || cardId === "null") {
          console.error('Invalid card ID', cardId);
          setLabelCard([]);
          return;
        }

        const fetchLabelCard = async () => {
          
          try {
            const response = await getCardLabels(cardId);
            if(response && response.data){
              setLabelCard(response.data);
            }else{
              console.error('Invalid card data', response);
              setLabelCard([]);
            }
          } catch (error) {
            console.error('Failed to fetch card label', error);
          }
        };
        fetchLabelCard();
      }, [cardId]);


      //END CARD 

      return (
        <div>
          <div className='search-bar'>
        <div className='list-container' >
          <div className='title'>
            <p>
              <FaGripLinesVertical style={{marginRight:'8px', color:'#6b1c14'}}/>
              {listName}
            </p>
            <p>
              <BsThreeDots
                className='dot-btn'
                onClick={(e)=> toggleActionThreeDotList(listId, e)}
              />
            </p>
          </div>
          {showAction === listId && (
            <div className="dropdown-menu-action active">
              <h5>View</h5>
              <div className="dropdown-action">
                <div className="action-btn">
                  <FaRegEdit className='ikon'/>
                  <button 
                    onClick={(e) => {e.stopPropagation(); handleEditListClick(listId)}}
                  >Edit List</button>
                </div>
                <div className="action-btn">
                  <BsArchive className='ikon'/>
                  <button onClick={(e) => {e.stopPropagation(); handleArchive(listId)}}
                  >Archive List</button>
                </div>
                <div className="action-btn">
                  <HiPlus className='ikon'/>
                  <button
                    onClick={(e)=> {e.stopPropagation(); handleDuplicateClick(listId)}}
                  >Duplicate List</button>
                </div>
                <div className="action-btn-remove">
                  <AiOutlineDelete className='ikon-remove'/>
                  <button
                    onClick={(e)=> {e.stopPropagation(); handleDeleteClick(listId)}}
                  >Delete List</button>
                </div>
              </div>
            </div>
          )}
          <hr style={{ color:'grey',border:'0.5px solid grey',opacity: '50%' }} />
          <div className='card-list-lists' >
            {/* tempat render card  */}
            {cards.map((card, index) => {
              // const cover = covers.find(c => c.id === card.cover_id)

              return ( // Mengembalikan elemen JSX
                <div key={card?.id|| index} className='card-item-lists' onClick={() => handleToCardDetail(card.id)}>
                  <div className="card-cover-container">
                  <DisplayCover cardId={card.id}/>
                </div>
                
                  
                   
                {/* DISPLAY LABEL */}
                  <p className='card-description'><strong>{card.title}</strong></p>
                  <div className="labels">
                    {/* <h5>Selected label:</h5> */}
                    <DisplayLabel cardId={card.id}/>
                  </div>
                    


                  <div className='card-footer'>
                    <div className='card-footer-content'>
                      <HiOutlineChatBubbleOvalLeftEllipsis />
                      <span className='card-footer-text' style={{ fontSize: '10px' }}>{card.comments_count}0</span>
                    </div>
                    <div className='card-footer-content'>
                      <GrAttachment size={12} />
                      <span className='card-footer-text' style={{ fontSize: '10px' }}>{card.comments_count}2</span>
                    </div>
                    <div className="card-footer-content-right">
                      <BsCalendar2Date size={10} style={{marginRight:'2px', marginBottom:'1px'}}/>
                      <DisplayDate cardId={card.id}/>
                    </div>  
                    <div style={{ padding: '5px', position: 'relative' }}>
                      <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0' }}>
                        <HiDotsVertical 
                          size={13}
                          className='dot-btn'
                          onClick={(e) => toggleActionCard(card.id, e)}
                          style={{ position: 'relative' }}
                        />
                        {/* edit her for action card  */}
                        {showAction === card.id && (
                          <div className="dropdown-menu-action active">
                            <h5>View</h5>
                            <div className="dropdown-action">
                              <div className="action-btn" onClick={(e)=> {e.stopPropagation(); handleCardEditClick(card.id) }}>
                                <FaRegEdit className='ikon' />
                                <button>Edit Card</button>
                              </div>
                              <div className="action-btn" onClick={(e)=> {e.stopPropagation(); handleArchiveCard(card.id)}}>
                                <BsArchive className='ikon'/>
                                <button>Archive Card</button>
                              </div>
                              <div className="action-btn" onClick={(e)=> {e.stopPropagation(); handleDuplicateCard(card.id)}}>
                                <HiPlus className='ikon'/>
                                <button>Duplicate Card</button>
                              </div>
                              <div className="action-btn-remove" onClick={(e)=> {e.stopPropagation(); handleDeleteCardClick(card.id) }}>
                                <AiOutlineDelete className='ikon-remove'/>
                                <button>Delete Card</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </p>
                    </div>
    
                  </div>

                </div>
              );
            })}

          </div>


          {/* Form input */}
          <div className="footer-list">
            <div>
              <button className='addButton' onClick={toggleFormVisibility}>
                {showForm ? 
                  (<><IoCloseOutline className='ikon-list' />Cancle </>) : (<><FiPlus className='ikon-list'/>Add Card</>)}
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
                        <button className='add-btn' onClick={handleCreateCard}>Add Card</button>
                    </div>
                  )}
            </div>
            <div className='card-count'>
              <IoIosCard className='ikon-list'/>
              {cardCount}
            </div>
          </div>
          

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
                onClose={onClose}
                onDeleteConfirm={onDeleteConfirm}
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
                workspaceId={workspaceId}
              />
            )}
            {isEditListOpen && (
              <EditList
                listId={listId}
                list = {editList}
                onClose={handleCloseEditList}
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
                card
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
            </div>
          </div>
          
          
      );
}

export default List