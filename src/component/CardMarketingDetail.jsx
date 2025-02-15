import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoSettingsOutline } from "react-icons/io5";
import {FaRegEdit} from "react-icons/fa";
import {HiPlus, } from "react-icons/hi";
import {AiOutlineDelete } from "react-icons/ai";
import { getDataMarketingByCardId, getMarketingDataById, getMarketingDataJoinCard } from '../services/Api';
import '../style/CardMarketingDetail.css'

const CardMarketingDetail=({cardId, marketing_id})=> {
    const [cardData,setCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]= useState(null); 
    const [marketing, setMarketing] = useState([]);
    const [showData, setSHowData] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAction, setShowAction] = useState(false);

    const toggleShowAction = () =>{
      setShowAction(!showAction);
    }

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
                const response = await getMarketingDataJoinCard(cardId);
                // const response = await axios.get(`http://localhost:3002/api/cards-marketing/${cardId}`);
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
      const fetchDataMarketingByCardId = async () =>{
        try {
          const response = await getDataMarketingByCardId(cardId);
          setMarketing(response.data);
        }catch(error){
          console.error('Error fething data marketing by card_id', error);
        }
      }
      fetchDataMarketingByCardId()
    },[cardId]);

    if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>{error}</div>;
      }
    
      if (!cardData) {
        return <div>No data found</div>;
      }

      //parse link
      const parseLinks = (text) =>{
        if(!text) return "";

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
      };

  return(
    <div className="show-data-container">
      <div className="data-container">
        <div className="data-header">
          <h3>{cardData.title}</h3>
          <IoSettingsOutline 
            className='header-ikon' 
            onClick={toggleShowAction}
          />
          {showAction && (
          <div className='action-button'>
            <button>
              <FaRegEdit className='button-ikon'/>  
              <p>Edit</p>
            </button>
            <button>
              <HiPlus className='button-ikon'/>
              <p>Duplicate</p>
            </button>
            <button className='delete'>
              <AiOutlineDelete className='button-ikon'/>
              <p>Delete</p>
            </button>
          </div>
        )}
        </div>
        
        <div className="data-body">
          <div className="data-body2">
            <h4>INFORMASI DASAR</h4>
            <div className="data-content">
              <div className="title">
                Input by
              </div>
              <div className="body">
                {cardData.input_by}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Acc by
              </div>
              <div className="body">
                {cardData.acc_by}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Buyer Name
              </div>
              <div className="body">
                {cardData.buyer_name}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Order Number
              </div>
              <div className="body">
                {cardData.order_number}
              </div>
            </div>

            {/* periksa penampilan data deadline  */}
            <div className="data-content">
              <div className="title">
                Deadline
              </div>
              <div className="body">
                {cardData.deadline}
              </div>
            </div>

          </div>

          {/* DETAIL PESANAN  */}
          <div className="data-body2" style={{marginTop:'10px'}}>
            <h4>DETAIL PESANAN</h4>

            <div className="data-content">
              <div className="title">
                Jumlah Track
              </div>
              <div className="body">
                {cardData.jumlah_track}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Code Order
              </div>
              <div className="body">
                {cardData.code_order}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Order Type
              </div>
              <div className="body">
                {cardData.order_type}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Offer Type
              </div>
              <div className="body">
                {cardData.offer_type}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Jenis Track
              </div>
              <div className="body">
                {cardData.jenis_track}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Genre
              </div>
              <div className="body">
                {cardData.genre}
              </div>
            </div>

          </div>

          {/* END DETAIL PESANAN  */}

          {/* INFORMASI HARGA  */}
          <div className="data-body2" style={{marginTop:'10px'}}>
            <h4>INFORMASI HARGA</h4>

            <div className="data-content">
              <div className="title">
                Price Normal
              </div>
              <div className="body">
                {cardData.price_normal}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Discount 
              </div>
              <div className="body">
                {cardData.discount}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Price Discount
              </div>
              <div className="body">
                {cardData.price_discount}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Basic Price
              </div>
              <div className="body">
                {cardData.basic_price}
              </div>
            </div>

          </div>
          {/* END INFORMASI HARGA  */}

          {/* FILE DAN REFERENSI  */}
          <div className="data-body2" style={{marginTop:'10px'}}>
            <h4>FILE AND REFERENCE</h4>

            <div className="data-content">
              <div className="title">
                Required File
              </div>
              <div className="body">
                {cardData.required_files}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                GIG Link
              </div>
              <div 
                className="body"
                style={{
                  wordWrap:'break-word',
                  overflowWrap:'break-word',
                  whiteSpace:'pre-wrap',
                  maxWidth:'100%',
                  overflowX:'auto'
                }}
                dangerouslySetInnerHTML={{ __html: parseLinks(cardData.gig_link) }}
              />
              {/* <div className="body">
                {cardData.gig_link}
              </div> */}
            </div>

            <div className="data-content">
              <div className="title">
                Reference File
              </div>
              <div 
                className="body"
                style={{
                  wordWrap:'break-word',
                  overflowWrap:'break-word',
                  whiteSpace:'pre-wrap',
                  maxWidth:'100%',
                  overflowX:'auto'
                }}
                dangerouslySetInnerHTML={{ __html: parseLinks(cardData.reference_link) }}
              />
              {/* <div className="body">
                {cardData.reference_link}
              </div> */}
            </div>

            <div className="data-content">
              <div className="title">
                File and Chat
              </div>
              <div 
                className="body"
                style={{
                  wordWrap:'break-word',
                  overflowWrap:'break-word',
                  whiteSpace:'pre-wrap',
                  maxWidth:'100%',
                  overflowX:'auto'
                }}
                dangerouslySetInnerHTML={{ __html: parseLinks(cardData.file_and_chat_link) }}
              >
                {/* {cardData.file_and_chat_link} */}
              </div>
            </div>

          </div>  
          {/* END FILE AND REFERENSI  */}

          {/* RINCIAN PROJECT  */}
          <div className="data-body2" style={{marginTop:'10px'}}>
            <h4>RINCIAN PROJECT</h4>

            <div className="data-content">
              <div className="title">
                Project Type
              </div>
              <div className="body">
                {cardData.project_type}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Duration
              </div>
              <div className="body">
                {cardData.duration}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Detail Project
              </div>
              <div 
                className="body"
                style={{
                  wordWrap:'break-word',
                  overflowWrap:'break-word',
                  whiteSpace:'pre-wrap',
                  maxWidth:'100%',
                  overflowX:'auto'
                }}
                dangerouslySetInnerHTML={{ __html: parseLinks(cardData.detail_project) }}
              />
              {/* <div className="body">
                {cardData.detail_project}
              </div> */}
            </div>

            <div className="data-content">
              <div className="title">
                Jumlah Revisi
              </div>
              <div className="body">
                {cardData.jumlah_revisi}
              </div>
            </div>

          </div>
          {/* END RINCIHAN PROJECT  */}

        </div>
      </div>
    </div>
  )
}

export default CardMarketingDetail