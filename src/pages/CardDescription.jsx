import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCardDetails } from '../services/Api';

const CardDescription=()=> {
    const {cardId} = useParams();
    const [cardDetails, setCardDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(()=>{
        const fetchCardDetails = async ()=>{
            try{
                const data = await getCardDetails(cardId);
                setCardDetails(data[0]);
                setLoading(false);
            }catch(err){
                setError(err.message);
                setLoading(false);
            }
        }
        fetchCardDetails();
    },[cardId]);

    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>{error}</div>
    }

  return (
    <div>
      <h2>Card Details</h2>
      <p><strong>Name:</strong> {cardDetails.name}</p>
      <p><strong>Description:</strong> {cardDetails.card_description}</p>
      <p><strong>Input By:</strong> {cardDetails.input_by}</p>
      <p><strong>Buyer Name:</strong> {cardDetails.buyer_name}</p>
      <p><strong>Code Order:</strong> {cardDetails.code_order}</p>
      <p><strong>Deadline:</strong> {cardDetails.deadline}</p>
      <p><strong>Project Type:</strong> {cardDetails.project_type}</p>
      <p><strong>Price:</strong> {cardDetails.price_normal}</p>
      <p><strong>Duration:</strong> {cardDetails.duration}</p>
      <p><strong>Details:</strong> {cardDetails.detail_project}</p>
      {/* Tampilkan data lainnya sesuai dengan struktur yang diinginkan */}
    </div>
  )
}

export default CardDescription