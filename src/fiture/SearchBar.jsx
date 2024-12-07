import React, { useEffect, useState } from 'react';
import { useDate } from '../context/DateContext';  // Assuming the searchQuery is managed via context
import { useNavigate } from 'react-router-dom';
import { IoIosCard } from 'react-icons/io';
import '../style/SearchBarStyle.css'

const SearchBar = () => {
  const { searchQuery, setSearchQuery, cards,  } = useDate();  // Fetch searchQuery and setSearchQuery from context
  const [filteredCards, setFilteredCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() && Array.isArray(cards)) {
      const filtered = cards.filter(card =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards([]);
    }
  }, [searchQuery, cards]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);  // Update searchQuery when the user types
  };

  const handleCardSelect = (cardId) => {
    setSearchQuery('');  // Clear the search bar after selecting a card
    // Navigate to the selected card's details page
    navigate(`/workspaces/${cardId.workspaceId}/boards/${cardId.boardId}/lists/${cardId.listId}/cards/${cardId.id}`);
  };




  return (
    <div className='searchBar-container'>
      <input 
        type="text" 
        placeholder="Search cards..."
        value={searchQuery}
        onChange={handleSearchChange}
        className='search-input'
      />

      {filteredCards.length > 0 && (
        <div className='dropdown-result'>
          {filteredCards.map((card) => (
            <div 
              key={card.id} 
              className="dropdown-item"
              onClick={() => handleCardSelect(card)}
            >
              <IoIosCard style={{marginRight:'10px'}}/>
              {card.title}
            </div>
          ))}
        </div>
      )}
  </div>
  );
};

export default SearchBar;
