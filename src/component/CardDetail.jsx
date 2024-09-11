import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCardDescriptionById } from '../services/Api';
import '../style/CardDetail.css'

 
const CardDetail = () => {
    const {workspaceId, boardId, listId, cardId} = useParams();
    const [cardDetail,setCardDetail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCardDetail = async () => {
          try {
            const response = await getCardDescriptionById(cardId);
            setCardDetail(response.data[0]);
          } catch (error) {
            console.error('Error fetching card detail:', error);
          }
        };
    
        fetchCardDetail();
      }, [cardId]);
    
      if (!cardDetail) {
        return <p>Loading...</p>;
      }
      const handleBackToBoardView = () => {
        navigate(`/workspaces/${workspaceId}/boards/${boardId}`);
      };

      return (
        <div className='card-detail-container'>
          <div className='title'>
              <h3>title</h3>
          </div>
          <div className='description'>
            <h2>Card Details</h2>
            <p><strong>Order Number:</strong> {cardDetail.order_number}</p>
            <p><strong>Buyer Name:</strong> {cardDetail.buyer_name}</p>
            <p><strong>Order Type:</strong> {cardDetail.order_type}</p>
            <p><strong>Price:</strong> {cardDetail.price}</p>
            {/* Tambahkan field lainnya sesuai kebutuhan */}
            <button onClick={handleBackToBoardView}>back to card</button>
          </div>
        </div>
      );
}

export default CardDetail

