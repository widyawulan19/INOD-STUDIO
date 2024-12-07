import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import BoardView from '../component/BoardView';
import { getCards } from '../services/Api';
import { useNavigate, useParams } from 'react-router-dom';

// Date context
const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  //fungsi date
  const [selectedDates, setSelectedDates] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  // const navigate = useNavigate()
  // const {workspaceId, boardId} = useParams();
  // const [searchTerm, setSearchTerm] = useState('');


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
