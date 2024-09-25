import React, { useCallback, useEffect, useState } from 'react'
import { createCard, getCards } from '../services/Api';
import { useNavigate, useParams } from 'react-router-dom';
import '../style/CardStyle.css'
import { Data_Cover, Data_Bg } from '../data/DataCover';

const Card = ()=> {
    const {boardId, listId, workspaceId} = useParams()
    const [cards, setCards] = useState([]);
    const [newCard, setNewCard] = useState({title:'', description:'', position:0})
    const navigate = useNavigate();


    const loadCards = useCallback(async () => {
      console.log('Loading cards for listId:', listId);
      try {
          const response = await getCards(listId);
          console.log('Received cards data:', response.data);
          setCards(response.data);
      } catch (error) {
          console.error('Failed to load cards:', error);
      }
  }, [listId]);

      useEffect(()=>{
        if(listId){
          loadCards();
        }
    }, [listId,loadCards])

    const handleCreateCard = async () => {
        await createCard({ ...newCard, list_id: listId});
        loadCards();
    }

    const handleBackToList = () => {
        navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists`); // Navigasi ke halaman Lists
    };

    const handleToCardDetail = (cardId) => {
        navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}`);
    }

return (
    <div className='card-container'>
      <h4>Cards</h4>
      <div className='card-list'>
        {cards.map((card) => (
          <div key={card.id} className='card-item'>
            <h6>{card.title}</h6>
            <p>{card.description}</p>
            {/* Button to navigate to card detail */}
            <button onClick={() => handleToCardDetail(card.id)}>
              View Card
            </button>
          </div>
        ))}  
      </div>
      <div className='card-form'>
        <input
          type='text'
          placeholder='Card Title'
          value={newCard.title}
          onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
        />
        <input
          type='text'
          placeholder='Description'
          value={newCard.description}
          onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
        />
        <input
          type='text'
          placeholder='Position'
          value={newCard.position}
          onChange={(e) => setNewCard({ ...newCard, position: e.target.value })}
        />
        
        <button onClick={handleCreateCard}>Add Card</button>
        <button onClick={handleBackToList}>Back To List</button>
      </div>
    </div>
  );
}
 
export default Card
