import React, { useEffect, useState } from 'react'
import { getMarketingDesignById, getMarketingDesignJoinCard } from '../services/Api';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaRegEdit } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';
import { AiOutlineDelete } from 'react-icons/ai';
import '../style/CardMarketingDetail.css'

const CardMarketingDesign=({cardId, marketing_desgin_id})=> {
  const [marketingDesignCard, setMarketingDesignCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const fetchCardMarketingDesign = async () =>{
      console.log('fetching data form cardId:', cardId);
      try{
        setLoading(true);
        const response = await getMarketingDesignJoinCard(cardId);
        console.log('Response data', response.data);
        setMarketingDesignCard(response.data);
      }catch(err){
        setError('Error fetching data');
        console.error(err);
      }finally{
        setLoading(false);
      };
    };
    fetchCardMarketingDesign();
  },[cardId]);

  useEffect(()=>{
    const fetchCardMarketingDesignById = async () =>{
      try{
        const response = await getMarketingDesignById(cardId);
        setMarketing(response.data);
      }catch(error){
        console.error('Error fetching data marketing by card_id', error);
      }
    }
    fetchCardMarketingDesignById()
  },[cardId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!marketingDesignCard) {
    return <div>No data found</div>;
  }

  //parse link
  const parseLinks = (text) =>{
    if(!text) return "";

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
  };

  return (
    <div className='show-data-container'>
      <div className="data-container">
        <div className="data-header">
          <h3>{marketingDesignCard.title}</h3>
          <IoSettingsOutline
            className='header-ikon'
            onClick={toggleShowAction}
          />
          {showAction && (
            <div className="action-button">
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
                {marketingDesignCard.input_by}
              </div>
            </div>

            {/* <div className="data-content">
              <div className="title">
                Acc by
              </div>
              <div className="body">
                {marketingDesignCard.acc_by}
              </div>
            </div> */}

            <div className="data-content">
              <div className="title">
                Buyer Name
              </div>
              <div className="body">
                {marketingDesignCard.buyer_name}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Order Number
              </div>
              <div className="body">
                {marketingDesignCard.order_number}
              </div>
            </div>

            {/* periksa penampilan data deadline  */}
            <div className="data-content">
              <div className="title">
                Deadline
              </div>
              <div className="body">
                {marketingDesignCard.deadline}
              </div>
            </div>
          </div>

          {/* DETAIL PESANAN  */}
          <div className="data-body2" style={{marginTop:'10px'}}>
            <h4>DETAIL PESANAN</h4>

            <div className="data-content">
              <div className="title">
                Jumlah Revisi
              </div>
              <div className="body">
                {marketingDesignCard.jumlah_revisi}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Order Type
              </div>
              <div className="body">
                {marketingDesignCard.order_type}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Offer Type
              </div>
              <div className="body">
                {marketingDesignCard.offer_type}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Style
              </div>
              <div className="body">
                {marketingDesignCard.style}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Resolutin
              </div>
              <div className="body">
                {marketingDesignCard.resolution}
              </div>
            </div>
          </div>
          {/* END DETAIL PESANAN  */}

          {/* PRICE INFORMATION  */}
          <div className="data-body2" style={{marginTop:'10px'}}>
            <h4>DETAIL PESANAN</h4>

            <div className="data-content">
              <div className="title">
                Price Normal
              </div>
              <div className="body">
                {marketingDesignCard.price_normal}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Price Discount 
              </div>
              <div className="body">
                {marketingDesignCard.price_discount}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Discount Precentage:
              </div>
              <div className="body">
                {marketingDesignCard.discount_percentage}
              </div>
            </div>
          </div>
          {/* END PRICE INFORMATION  */}

          {/* FILE DAN REFERENSI  */}
          <div className="data-body2" style={{marginTop:'10px'}}>
            <h4>FILE AND REFERENCE</h4>

            <div className="data-content">
              <div className="title">
                Required File:
              </div>
              <div className="body">
                {marketingDesignCard.required_files}
              </div>
            </div>

            <div className="data-content">
              <div className="title">
                Project Type
              </div>
              <div className="body">
                {marketingDesignCard.project_type}
              </div>
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
                dangerouslySetInnerHTML={{ __html: parseLinks(marketingDesignCard.reference) }}
              />
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
                dangerouslySetInnerHTML={{ __html: parseLinks(marketingDesignCard.file_and_chat) }}
              />
              {/* <div className="body">
                {marketingDesignCard.file_and_chat}
              </div> */}
            </div>
          </div>  
          {/* END FILE DAN REFERENSI  */}

          {/* RINCIAN PROJECT  */}
          <div className="data-body2" style={{marginTop:'10px'}}>
            <h4>RINCIAN PROJECT</h4>

            <div className="data-content" 
                 style={{
                  display:'flex',
                  alignItems:'flex-start',
                  justifyContent:'flex-start'
                 }}>
              <div className="title"
                    style={{
                      marginTop:'0px'
                    }}
              >
                Detail Type
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
                dangerouslySetInnerHTML={{ __html: parseLinks(marketingDesignCard.detail_project) }}
              />
            </div>
          </div>
          {/* END RINCIHAN PROJECT  */}
          
        </div>
      </div>
    </div>
  )
}

export default CardMarketingDesign