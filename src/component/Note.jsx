
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCardDescriptionById, getlabel,  getCardById, getAllCover, getCardDetails, getMarketingDataByCardId, getCards,updateCard } from '../services/Api';
import {  IoIosCard } from "react-icons/io";
import { HiOutlineUserAdd,HiOutlinePaperClip,HiOutlineArrowRight,HiOutlineDuplicate, HiOutlineArchive,HiOutlineX,HiOutlineCloud } from "react-icons/hi";
import {  FaCcDiscover, FaRegEdit } from "react-icons/fa";
import { TbTags } from "react-icons/tb";
import '../style/CardDetail.css'
import { Data_Cover } from '../data/DataCover.js'
import { Data_Lable } from '../data/DataLabel.js';
import { Data_User } from '../data/DateUser.js';
import CustomeDate from './CustomeDate.jsx';
import DescriptionActivities from './DescriptionActivities.jsx';
import { BsPlus } from 'react-icons/bs';
import profil3 from '../assets/profil/profil3.jpg'
import DisplayDate from './DisplayDate.jsx';
import EditCard from '../popup/EditCard.jsx';
import CardMarketingDetail from './CardMarketingDetail.jsx';
 
const CardDetail = () => {
    const {workspaceId, boardId, listId, cardId} = useParams();
    const [cardDetail,setCardDetail] = useState([]);
    const [labels, setLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([])
    const navigate = useNavigate();
    const [card, setCard] = useState([]);
    // const [cards, setCards] = useState([]);
    const [cover, setCover] = useState([]);
    // const [covers, setCovers] = useState(Data_Cover);
    const [cardCover, setCardCover] = useState([]);
    const [showOption, setShowOption] = useState(false);
    const [showCover, setShowCover] = useState(false);
    const [selectCover, setSelectCover] = useState(null);
    //select label
    const [selectedLabel, setSelectedLabel] = useState([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    //card description
    const [cardData, setCardData] = useState(null);
    const [marketingData, setMarketingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //state to edit card
    const [editCard, setEditCard] = useState(null);
    const [isEditCardOpen, setIsEditCardOpen] = useState(false);

    //edit card
    const handleCardEditClick = (cardId)=>{
      setEditCard(cardId);
      setIsEditCardOpen(true);
      console.log('Card Id:', cardId);
    }
    const handleCloseEditCard = () => {
      setEditCard(null);
      setIsEditCardOpen(false);
    }


    // LABEl 
    useEffect(()=>{
      const saveLabel = localStorage.getItem(`selectedLabel_${cardId}`);
      if(saveLabel){
        try{
          const parsedLabel = JSON.parse(saveLabel);
          if(Array.isArray(parsedLabel)){
            setSelectedLabel(parsedLabel);
          }
        }catch(error){
          console.error('Error parsing selected Label:', error)
        }
      }
    },[cardId]);
    
    const handleLabel = (label) => {
      const isSelected = selectedLabel.some((lbl)=> lbl.id === label.id);
      const updateSelection = isSelected
      ?  selectedLabel.filter((lbl)=> lbl.id !== label.id)
      :  [...selectedLabel, label]

      setSelectedLabel(updateSelection);
      localStorage.setItem(`selectedLabel_${cardId}`, JSON.stringify(updateSelection))
    }

    //END LABEL

    const hexToRgba = (hex, opacity) => {
      // Pastikan hex dimulai dengan '#' dan panjangnya 7 karakter
      if (!hex || hex[0] !== '#' || hex.length !== 7) {
        console.error('Invalid hex color:', hex);
        return 'rgba(0, 0, 0, 0)'; // Warna default bila hex tidak valid
      }
    
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);
    
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    
    
    //dropdown option
    const toggleOptionVisibility = () => {
      setShowOption(prevState => !prevState);
    }
    const closeDropdown = () => {
      setShowOption(false);
    };


    //cover
    const toggleCoverVisibility = () =>{
      setShowCover(!showCover);
      console.log('data label', Data_Cover)
    }

    useEffect(() => {
      const fetchCard = async () => {
        try {
            const response = await getCardById(cardId); // Panggil API untuk mendapatkan detail kartu dan label
            setCard(response.data); // Simpan data kartu ke state
        } catch (error) {
            console.error("Failed to fetch card: ", error);
        }
      };
     
      const fetchCardDetails = async () => {
        try {
          const response = await fetch(`/api/cardDetails/${cardId}`);
          
          // Mengecek apakah respons berhasil
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
  
          const data = await response.json();
          
          // Menyimpan data ke state
          setCardData(data.card);
          setMarketingData(data.marketing);
        } catch (err) {
          setError('Gagal mengambil data card dan marketing');
          console.error(err);
        }
      };
  
      const fetchLabels = async () => {
          try {
              const response = await getlabel();
              setLabels(response.data);
          } catch (error) {
              console.error('Error fetching labels:', error);
          }
      };

      const fetchCover = () => {
        try{
          const storedCoverData = localStorage.getItem('coverData');
          if(storedCoverData){
            const coverData = JSON.parse(storedCoverData);
            setCover(coverData);
          }else{
            localStorage.setItem('coverData', JSON.stringify(Data_Cover));
            setCover(Data_Cover);
          }
          const savedCover = localStorage.getItem(`cardCover_${cardId}`);
          if(savedCover){
            setSelectCover(JSON.parse(savedCover));
          }
        }catch(error){
          console.error('Error fetching cover image:', error);
        }
      };

      const fetchMarketingData = async () => {
        try {
            const response = await getMarketingDataByCardId(cardId);
            setMarketingData(response.data); // Store marketing data
        } catch (error) {
            console.error('Error fetching marketing data:', error);
        }
    };

    const fetchCardsData = async () =>{
      try{
        const response = await getCards(listId);
        console.log('Received cards data:', response.data);
        setCard(response.data.filter(card => card.listId === Number(listId)))
      }catch(error){
        console.error('Failed to load cards:', error);
      }
    }
      
  
      fetchCardDetails();
      fetchLabels();
      fetchCard();
      fetchCardsData();
      fetchCover();
      fetchMarketingData();
      //fetchCardLabels();
  }, [cardId],[listId]);


  const handleSaveEditCard = async(updateCard) =>{
    try{
      const response = await updateCard();
      if(response.ok){
        const data = await response.json();
        setEditCard(data);
        setIsEditCardOpen(false);
      }else{
        console.error('Failed to update card data');
      }
    }catch(error){
      console.error('Error saving card data:', error);
    }
  };



  const handleCoverSelect = (cover) => {
    setSelectCover(cover);
    localStorage.setItem(`cardCover_${cardId}`, JSON.stringify(cover)); // Save selected cover to local storage
};

  useEffect(()=> {
    const fetchCovers = async () => {
      try {
          const response = await getAllCover();
          setCardCover(response.data); // Simpan data cover ke state
          console.log(cover);
      } catch (error) {
          console.error('Error fetching covers:', error);
      }
  }
  fetchCovers();
  }, []);
  

      const handleLabelSelect = (e) =>{
        const labelId = e.target.value;
        if(!selectedLabels.includes(labelId)){
          setSelectedLabels([...selectedLabels, labelId])
        }
      };

      const handleLabelSelection = (label) => {
          if(selectedLabels.includes(label)){
            setSelectedLabels(selectedLabels.filter((l)=> l !== label))
          }else{
            setSelectedLabels([...selectedLabels, label])
          }
      }

      const handleBackToBoardView = () => {
        navigate(`/workspaces/${workspaceId}/boards/${boardId}`);
      };
      
      const handleToOther = () => {
        localStorage.setItem(`selectedLabel_${cardId}`, JSON.stringify(selectedLabel));
        navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}/other-page`);
      }
      const handleToExample = () => {
        navigate(`/example`);
      }
      const handleDesc = () => {
        navigate(`/description`)
      }

    const handleLabelChange = (e) => {
      const selectedOptions = Array.from(e.target.selectedOptions);
      const selectedIds = selectedOptions.map(option => parseInt(option.value, 10));
      const selected = labels.filter(label => selectedIds.includes(label.id));
      setSelectedLabels(selected);
      console.log(selectedLabels);
  };
  
  const handleLabelRemove = (labelId) => {
      setSelectedLabels(selectedLabels.filter((label) => label.id !== labelId));
  };

      return (
        <div className='card-detail-container'>
          <div className="description-container">
            <div className='header-icon' >
              <HiOutlineX className='header' size={20} onClick={handleBackToBoardView}/>
              <h4>CARD DETAIL</h4>
              <HiOutlineCloud className='header-cloud' size={20}/>
            </div>
            <div className='cover'>
              {selectCover &&(
                <div className='imgCover'>
                  <img src={selectCover.cover_image_url} alt={selectCover.name} />
                </div>
              )}
            </div> 
            <div className="container">
              <div className="description" style={{}}>
              {card.map((c)=>(
                <div key={c.id} className="description-title">

                <IoIosCard size={25} style={{marginRight:'0.5vw'}}/>
                <h2>{c.title}</h2>
              </div>
              ))}
                
                {/* <hr style={{width:'100%', border:'0.1px solid grey'}}/> */}

                <div className='sub-title'>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'27vw'}}>
                    <p>Assignes </p>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                      {Data_User.map((user)=>(
                        <div key={user.id}
                          style={{
                            
                            borderRadius:'10px',
                            padding:'8px',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            height:'12px',
                            marginRight:'2px',
                            width:'85px',
                            boxShadow:'0px 4px 8px rgba(0,0,0,0.1)',
                            border:'0.3px solid #521422'
                            // backgroundColor:'#ddd',
                            
                          }}
                        >
                            <img src={user.profil} alt={user.name} style={{
                              width:'30px',
                              height:'20px',
                              borderRadius:'20px'
                            }}/>
                            <p  style={{margin:'0px', fontSize:'12px', fontWeight:'normal', color:'black'}}>{user.name}</p>
                        </div>
                      ))}
                      <div
                      style={{
                        borderRadius:'50%',
                        border:'0.3px solid #521422',
                        boxShadow:'0px 4px 8px rgba(0,0,0,0.1)',
                        padding:'5px',
                        height:'15px'
                      }}
                      >
                        <BsPlus size={15}/>
                      </div>
                    </div>
                    
                  </div>
                  <div  style={{display:'flex', alignItems:'center', justifyContent:'space-between',width:'17vw'}}>
                    <p>Due Date</p>
                    <DisplayDate cardId={cardId}/>
                  </div>
                  
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between',width:'18vw', marginBottom:'10px'}}>
                    <p>Create By</p>
                    <div
                      style={{
                        borderRadius:'10px',
                        boxShadow:'0px 4px 8px rgba(0,0,0,0.1)',
                        border:'0.3px solid #521422',
                        padding:'8px',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        height:'12px',
                        marginRight:'2px',
                        width:'85px',
                        // backgroundColor:'#ddd',
                      }}
                    >
                      <img src={profil3} alt='profil 3' style={{width:'30px',height:'20px',borderRadius:'20px'}}/>
                      <p  style={{margin:'0px', fontSize:'12px', fontWeight:'normal',color:'black'}}>John Doe</p>
                    </div>
                  </div>
                </div>
                
                {/* Display Selected Labels */}
               <div className='selected-labels-container'>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'left'}}>
                    <button className='btn' onClick={()=> setIsDropdownOpen(!isDropdownOpen)}>
                        <TbTags size={15} className='action-icon'/>  
                        {/* {selectedLabel ? selectedLabel.name : 'Select Label'} */}
                        {selectedLabel.length > 0
                          ? `${selectedLabel.length} label(s) selected`
                          :  'Select Label'
                        }
                      </button>
                      <CustomeDate cardId={cardId}/>
                  </div>
                  {/* Display label selected */}
                  <div className='display-label'>
                    <p>Labels </p>
                      {isDropdownOpen && (
                        <ul className='label-dropdown-list'>
                            {Data_Lable.map((label)=>(
                              <li 
                              key={label.id} 
                              onClick={() => handleLabel(label)} 
                              style={{
                                backgroundColor: `${label.bgColor}`,
                                color: `${label.color}`,
                                border: selectedLabel.some((lbl) => lbl.id === label.id)
                                  ? '1px solid #521422'
                                  : `1px solid ${label.color}`,
                                borderRadius:'5px',
                                marginBottom:'5px',
                                fontSize:'8px',
                                fontWeight:'bold'
                              }}
                            >
                              {label.name} {/* Pastikan properti yang ditampilkan benar */}
                            </li>
                            ))}
                        </ul>
                      )}
                    {selectedLabel.length > 0  && (
                      <div>
                        {/* <h3>Selected Label:</h3> */}
                        <div style={{display:'flex',
                                alignItems:'center',
                                justifyContent:'left'
                                }}>
                          {selectedLabel.map((label)=> (
                              <div  style={{
                                backgroundColor: `${label.bgColor}`,
                                // backgroundColor:'white',
                                // border: `1px solid ${label.color}`,
                                color: `${label.color}`,
                                border:`1px solid ${label.color}`,
                                borderRadius: '5px',
                                padding: '10px',
                                marginTop: '10px',
                                marginRight:'5px',
                                height:'10px',
                                fontSize:'8px',
                                fontWeight:'bold'
                              }}>
                                {label.name}
                              </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                </div>
                   

                
                <div >
                  {/* <TextEditor/> */}
                  <DescriptionActivities/>
                </div>
                <div>
                  <CardMarketingDetail cardId={cardId}/>
                </div>
              </div>

              <div className="action">
                <h4>ACTIONS</h4>
                <button 
                  className='btn'
                  onClick={()=> handleCardEditClick(cardId) }
                >
                  <FaRegEdit className='action-icon'/>
                  Edit Card
                </button>
                <button 
                  className='btn'
                >
                  <HiOutlineUserAdd className='action-icon'/>
                  Add Member
                </button>
                <button 
                  className='btn'
                >
                  <HiOutlinePaperClip className='action-icon'/>
                  Attachment
                </button>
                <button 
                  className='btn'
                >
                  <HiOutlineArrowRight className='action-icon'/>
                  Move
                </button>
                <button 
                  className='btn'
                >
                  <HiOutlineDuplicate className='action-icon'/>
                  Copy
                </button>
                <button 
                  className='btn'
                >
                  <HiOutlineArchive className='action-icon'/>
                  Archive
                </button>
                
                
                {/* End Display label  */}
                <button className='btn' onClick={toggleCoverVisibility}>
                  {showCover ?
                 (<><FaCcDiscover className='action-icon'/>Pilih Cover</>):(<><FaCcDiscover className='action-icon'/>Cover</>)   
                }
                </button>
                {showCover && (
                  <div style={{
                      border:'0.1px solid grey',
                      borderRadius:'5px',
                      boxShadow:'0 4px 8px rgba(0,0,0,0.1)',
                      padding:'5px',
                      width:'100px',
                      height:'130px',
                      overflowY:'auto'
                  }}>
                    {cover.map((cover)=>(
                      <div 
                        className='coverImg' 
                        key={cover.id}
                        onClick={()=> handleCoverSelect(cover)}
                        style={{marginBottom:'5px', cursor:'pointer'}}
                      >
                        <img 
                          src={cover.cover_image_url} 
                          alt={cover.name} />
                      </div>
                    ))}
                  </div>
                )}

                {/* {menampilkan hasil cover} */}
              </div>

              {/* ACTION CALL  */}
                {isEditCardOpen && (
                  <EditCard
                    cardId={cardId}
                    card={editCard}
                    onClose={handleCloseEditCard}
                    onSave={handleSaveEditCard}
                  />
                )}
              {/* END ACTION CALL  */}

            </div>
          </div>
        </div>
      );
}

export default CardDetail



import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAssignCountForBoard } from '../services/Api';

// Buat Context
const UserCountContext = createContext();

export const UserCountProvider = ({ children, boardId }) => {
    const [userCount, setUserCount] = useState({}); // Gunakan objek agar bisa menyimpan banyak board

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const data = await getAssignCountForBoard(boardId);
                setUserCount(prev => ({
                    ...prev,
                    [boardId]: data.user_count, // Simpan `userCount` berdasarkan `boardId`
                }));
            } catch (error) {
                console.error('Failed to fetch user count:', error);
            }
        };

        if (boardId) {
            fetchUserCount();
        }
    }, [boardId]);

    return (
        <UserCountContext.Provider value={{ userCount }}>
            {children}
        </UserCountContext.Provider>
    );
};

// Hook untuk mengambil data dari context
export const useUserCount = () => {
    return useContext(UserCountContext);
};

