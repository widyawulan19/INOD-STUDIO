import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getMarketingDataById } from '../services/Api';
import '../style/CardMarketingDetail.css'

const CardMarketingDetail=({cardId, marketing_id})=> {
    const [cardData,setCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]= useState(null); 
    const [marketing, setMarketing] = useState([]);
    const [showData, setSHowData] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleShowData = () => {
      setSHowData(!showData);
    }

    const handleExpandedOpen = ()=>{
      setIsExpanded(!isExpanded);
    }

    useEffect(()=>{
        const fetchCardMarketingData = async () =>{
            console.log('fetching data from cardID', cardId)
            try{
                setLoading(true);
                const response = await axios.get(`http://localhost:3002/api/cards-marketing/${cardId}`);
                console.log('Respon data', response.data);
                setCardData(response.data);
            }catch(err){
                setError('Error fetching data');
                console.error(err);
            }finally{
                setLoading(false);
            }
        };
        fetchCardMarketingData();
    },[cardId]);

    useEffect(()=>{
      const fetchDataMarketingById = async () =>{
        try{
          const response = await getMarketingDataById(marketing_id);
          setMarketing(response.data);
        }catch(error){
          console.error('Error fetching data marketing by id', error);
        }
      }
      fetchDataMarketingById()
    },[marketing_id])

    if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>{error}</div>;
      }
    
      if (!cardData) {
        return <div>No data found</div>;
      }

  return (
    <div className='show-data-container'>
      <button onClick={handleShowData}>Data Marketing</button>
      {showData && (
        <div>
          <h1>{cardData.title}</h1>
          {/* <p>{cardData.description}</p> */}
          <h3>Marketing Data:</h3>
          <ul>
              {/* <li><strong>Marketing ID:</strong> {cardData.marketing_id}</li> */}
              <li><strong>Input By:</strong> {cardData.input_by}</li>
              <li><strong>Acc By:</strong> {cardData.acc_by}</li>
              <li><strong>Buyer Name:</strong> {cardData.buyer_name}</li>
              <li><strong>Code Order:</strong> {cardData.code_order}</li>
              <li><strong>Jumlah Track:</strong> {cardData.jumlah_track}</li>
              <li><strong>Order Number:</strong> {cardData.order}</li>
              <li><strong>Account:</strong> {cardData.account}</li>
              <li><strong>Deadline:</strong> {cardData.deadline}</li>
              <li><strong>Jumlah Revisi:</strong> {cardData.jumlah_revisi}</li>
              <li><strong>Order Type:</strong> {cardData.order_type}</li>
              <li><strong>Offer Type:</strong> {cardData.offer_type}</li>
              <li><strong>Jenis Track:</strong> {cardData.jenis_track}</li>
              <li><strong>Genre:</strong> {cardData.genre}</li>
              <li><strong>Price Normal:</strong> {cardData.price_normal}</li>
              <li><strong>Price Discount:</strong> {cardData.price_discount}</li>
              <li><strong>Discount :</strong> {cardData.discount}</li>
              <li><strong>Basic Price:</strong> {cardData.basic_price}</li>
              <li><strong>GIG Link:</strong> {cardData.gig_link}</li>
              <li><strong>Required File:</strong> {cardData.required_files}</li>
              <li><strong>Project Type:</strong> {cardData.project_type}</li>
              <li><strong>Duration:</strong> {cardData.duration}</li>
              <li><strong>Reference Link:</strong> {cardData.reference_link}</li>
              <li><strong>File and Chat:</strong> {cardData.file_and_chat_link}</li>
              <li><strong>Detail Project:</strong> {cardData.detail_project}</li>
          {/* Tambahkan elemen lainnya sesuai dengan data yang diterima */}
          </ul>
        </div>
      )}
      </div>
  )
}

export default CardMarketingDetail