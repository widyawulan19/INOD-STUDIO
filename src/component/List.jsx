import React, { useEffect, useState } from 'react'
import { getCards, createCard, getLists, createList} from '../services/Api'
import { useNavigate, useParams } from 'react-router-dom';
import '../style/ListStyle.css'
import { BsThreeDots } from "react-icons/bs";
import { TfiCommentAlt } from "react-icons/tfi";
import { FaPlus} from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import { FaPlay } from "react-icons/fa6";
import { HiDotsVertical, HiArchive } from "react-icons/hi";
import { AiFillDelete } from "react-icons/ai";


const List=({listId, listName})=> {
    const {workspaceId, boardId} = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useState([])
    const [newCard, setNewCard] = useState({title:'', description:'', position:0})
    const [showForm, setShowForm] = useState(false);
    const [showAction, setShowAction] = useState(null)

    const toggleFormVisibility = () => {
      setShowForm(!showForm)
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

    const handleActionCard = (cardId, action)=>{
      console.log(`Action: ${action} for cards: ${cardId}`)
      setShowAction(null)
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
        await createCard({ ...newCard, list_id: listId });
        loadCards();
        setShowForm(false);
        setNewCard({title:'', description:'', position:''})
      };
    
      const handleToCardModal = (cardId, event) => {
        event.stopPropagation();
        console.log(`Navigating to card modal with ID: ${cardId}`)
        navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}/modal`)
      }
      const handleToCardDetail = (cardId) => {
        console.log(`Navigating to card detail with ID : ${cardId}`)
        navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}`);
      };


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
                <div className='dropdown-menu-action'>
                  <ul className='dropdown-ul'>
                    Action
                    <li
                      className='dropdown-li'
                      onClick={()=> handleAction(listId, 'delete')}
                    >
                      <AiFillDelete className='ikon' size={15}/>
                      <div style={{size: '10px'}}>
                        Delete <br />
                        <span style={{fontSize: '10px', fontWeight: 'normal'}}>Delete this card</span>
                      </div>
                    </li>
                    <li
                      className='dropdown-li'
                      onClick={()=> handleAction(listId, 'archive')}
                    >
                      <HiArchive className='ikon' size={15}/>
                      <div>
                        Archive <br />
                        <span style={{fontSize: '10px', fontWeight: 'normal'}}>Archive this card</span>
                      </div>
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
                        Actions
                        <li onClick={() => handleActionCard(card.id, 'delete')} className='dropdown-li'>
                          <AiFillDelete className='ikon' size={15} />
                          <div style={{size: '10px'}}>
                            Delete <br />
                            <span style={{fontSize: '10px', fontWeight: 'normal'}}>Delete this card</span>
                          </div>
                        </li>
                        <li onClick={() => handleActionCard(card.id, 'archive')} className='dropdown-li'>
                          <HiArchive className='ikon' size={15} />
                          <div>
                            Archive <br />
                            <span style={{fontSize: '10px', fontWeight: 'normal'}}>Archive this card</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </p>
              </div>
              <div className='cover'></div>
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
                    <button className='add-btn' onClick={handleCreateCard}>Add Card</button>
                </div>
              )}
          </div>
          
      );
}

export default List

