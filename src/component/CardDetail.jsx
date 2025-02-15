import React, { useEffect, useState } from 'react'
import '../style/NewCardDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserCountByCard, getAssignedUsersForCard, getCardById, getCards, getUsersInBoard } from '../services/Api';
import { HiOutlineX } from 'react-icons/hi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoListSharp,IoCalendarClearOutline, IoPricetagsOutline } from 'react-icons/io5';
import { AiOutlineUser } from "react-icons/ai";
import CoverSelected from '../fiture/CoverSelected';
import DescriptionActivities from './DescriptionActivities';
import PostComment from './PostComment';
import DisplayDate from './DisplayDate';
import Label from '../fiture/Label';
import {getRandomColor} from '../fiture/Label';
import CustomeDate from './CustomeDate';
import SelectorCover from '../fiture/SelectorCover';
import DisplayCover from '../fiture/DisplayCover';
import Assignment from '../fiture/Assignment';
import AssignmentCard from '../fiture/AssignmentCard';
import ChatRoom from '../fiture/ChatRoom';


const CardDetail=()=> {
  const navigate = useNavigate();
  const {cardId, listId, workspaceId, boardId} = useParams();
  console.log('Card Id in cardDetail:', cardId);
  const [cardDetails, setCardDetail]= useState({});
  const [cards, setCards] = useState([]);

  //show cover
  const [coverImage, setCoverImage] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);
  const [showAssign, setShowAssign] = useState(false);

  //user assign 
  const [usersCard, setUsersCard] = useState([]);
  const [userCount, setUserCount] = useState(null);

  //function user assign
  useEffect(()=>{
    const fetchUserCard = async()=>{
      try{
        const usersDataCard = await getAssignedUsersForCard(cardId);
        setUsersCard(usersDataCard.assignedUsers);
      }catch(error){
        console.error('Error fetching users:', error);
      }
    };
    fetchUserCard();
  },[cardId]);

  //count users
     useEffect(() => {
         const fetchTotalData = async () => {
             try {
                 const data = await getUserCountByCard(cardId);
                 console.log("User count response:", data);
     
                 // Pastikan array tidak kosong sebelum mengakses user_count
                 if (data.cardUserCounts && data.cardUserCounts.length > 0) {
                     const userCountValue = parseInt(data.cardUserCounts[0].user_count, 10); // Konversi ke angka
                     setUserCount(userCountValue);
                 } else {
                     console.error("User count data is missing or empty:", data);
                 }
             } catch (error) {
                 console.error("Failed to fetch user count:", error);
             }
         };
     
         if (boardId && cardId) { 
             fetchTotalData();
         }
     }, [cardId, boardId]);

  //end function user assign

  //generate profile users
  const generateProfileInitials = (name) =>{
    if(!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join('');
    return initials.slice(0,2);
  }

  const handleShowAssign = () =>{
    setShowAssign(!showAssign);
  }

  const fetchCardDetail = async () => {
    try {
      const cardData = await getCardById(cardId);  // Fetch card data
      console.log('card detail response', cardData);
  
      if (cardData) {
        setCardDetail(cardData); // Set the card detail directly
        setCoverImage(cardData.cover.id);  // Update cover image
        console.log('Cover id', cardData.cover.id);
      } else {
        console.error('No card details found');
      }
    } catch (error) {
      console.error('Failed to fetch card data', error);
    }
  };
  

  const fetchCard = async() => {
    try{
          const response = await getCards(listId);
          console.log('Received cards data', response.data);
          setCards(response.data.filter(cards => cards.listId === Number(listId)));
        }catch(error){
          console.error('Failed to load cards:', error);
        }
  }

  //fungsi untuk menerima cover image
  const handleCoverSelect = (coverImage) => {
    const coverId = coverImage.id;
    setSelectedCover(coverId);
  }

  useEffect(()=>{
    fetchCardDetail();
    fetchCard()
  }, [cardId, listId])


  //navigate
  const handleBackToBoardView = () =>{
    navigate(`/workspaces/${workspaceId}/boards/${boardId}`);
  }

  const handleStopPropagation = (event) =>{
    event.stopPropagation();
  }

        // {/* <h5>{cardDetails.title}</h5> */}

  return (
    <div className="card-detail-container">
      <div className="description-container" >
        <div className="header-icon">
          <HiOutlineX className='header' size={20} onClick={handleBackToBoardView} />
          {cardDetails && cardDetails.title && (
            <h4>{cardDetails.title}</h4>
          )}
          <RxHamburgerMenu className='header-cloud' size={20} />
        </div>
       <div className="button-nav">
          <button onClick={handleBackToBoardView}>
            <IoListSharp style={{ marginRight: '5px' }} />
            Lists
          </button>
          /
          <button className='non-active'>Card Detail</button>
       </div>

       {/* <CoverSelected cardId={cardId} card={cards} onCoverSelect={handleCoverSelect}/> */}
        <SelectorCover cardId={cardId}/>

        <div className="sub-title">
            <div className="sub1">
              <div className="sub1-title">
                <AiOutlineUser size={14} className='sub-ikon'/>
                <p>Assignes</p>
              </div>
              <div className="sub1-body" onClick={handleShowAssign}>
                {/* <p>Assign to  </p> */}
                <p>
                  {usersCard.map(user =>(
                    <div className='up-container'>
                      <div className="up-user-photo">
                          <span>{generateProfileInitials(user.username)}</span>
                      </div>
                    </div>
                  ))}
                  <div>
                    {userCount !== null ? (
                      <p>Member: {userCount}</p>
                    ) : (
                        <p>Loading...</p>
                    )}
                  </div>
                </p>
                {showAssign && (
                  <div className="assignment-container" onClick={(event)=> handleStopPropagation(event)}>
                    {/* <Assignment boardId={boardId} /> */}
                    <AssignmentCard boardId={boardId} cardId={cardId}/>
                  </div>
                )}
                {/* <Assignment boardId={boardId}/> */}
              </div>
            </div>
            <div className="sub2">
              <div className="sub2-title">
                <IoCalendarClearOutline  className='sub-ikon'/>
                <p>Due Date</p>
              </div>
              <div className="sub2-body">
                {/* <p>Empty</p> */}
                <p><CustomeDate cardId={cardId}/></p>
                {/* <p><DisplayDate cardId={cardId}/></p> */}
              </div>
            </div>
            <div className="sub3">
              <div className="sub3-title">
                <IoPricetagsOutline className='sub-ikon'/>
                <p>Tags</p>
              </div>
              <div className="sub3-body">
                {/* <p>Empty</p> */}
                <p><Label cardId={cardId}/></p>
                {/* <p><DisplayCover cardId={cardId}/></p> */}
              </div>
            </div>
        </div>

       <div className="description">
        <DescriptionActivities cardId={cardId}/>
       </div>
      </div>
      <div className="discussion">
        {/* <PostComment/> */}
        <ChatRoom cardId={cardId} usersCard={usersCard}/>
      </div>
    </div>
  )
}

export default CardDetail