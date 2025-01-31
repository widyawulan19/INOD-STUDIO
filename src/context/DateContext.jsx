import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import BoardView from '../component/BoardView';
import { getAssignCountForBoard, getCards, getUsersInBoard } from '../services/Api';
import { useNavigate, useParams } from 'react-router-dom';

// Date context
const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const {boardId} = useParams();
  //fungsi date
  const [selectedDates, setSelectedDates] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState({});

  //get user in board
  useEffect(()=>{
    if(boardId){
      const fetchUsers = async () => {
        try{
          const usersData = await getUsersInBoard(boardId);
          setUsers(usersData);
        }catch(error){
          console.error('Error fetching users:', error);
        }
      };
      const fetchUserCount = async () => {
        try {
            const data = await getAssignCountForBoard(boardId);
            setUserCount((prev) => ({
                ...prev,
                [boardId]: data.user_count, // Simpan dalam objek dengan boardId sebagai key
              }));
          } catch (error) {
              console.error('Failed to fetch user count:', error);
          }
      };

      fetchUsers();
      fetchUserCount();
    }
  },[boardId]);


  
  //cover
  const [selectedCover, setSelectedCover] = useState(null);
  const [covers, setCovers] = useState([]);

  const loadCards = useCallback(async () => {
    try{
      const response = await getCards();
      setCards(response.data);
    }catch(error){
      console.error('Error loading cards:', error)
    }
  },[])

  useEffect(()=>{
    loadCards();
  }, [loadCards])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Fungsi untuk mengatur tanggal berdasarkan cardId
  const setSelectedDate = (cardId, date) => {
    setSelectedDates(prevDates => ({ 
      ...prevDates,
      [cardId]: date,
    }));
  };

  const updateCards = (newCards)=>{
    setCards(newCards);
  }


  return (
    <DateContext.Provider value={{ 
        selectedDates, 
        setSelectedDate,  
        updateCards, 
        searchQuery, 
        setSearchQuery, 
        handleSearchChange, 
        showFilter, 
        setShowFilter,
        filteredCards, 
        setFilteredCards, 
        cards,
        setCards,
        //cover
        selectedCover,
        setSelectedCover,
        covers,
        setCovers,
        //assign
        users,
        userCount,
        boardId
        }}>
      {children}
      {/* <BoardView cards={cards}/> */}
    </DateContext.Provider>
  );
};

// Custom hook untuk menggunakan context tanggal
export const useDate = () => {
  return useContext(DateContext);
};
