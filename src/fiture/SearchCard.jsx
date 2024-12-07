import axios from 'axios';
import React, { useEffect, useState } from 'react'

const SearchCard=()=> {
    const [searchQuery, setSearchQuery] = useState('');
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(searchQuery){
            setLoading(true);
            axios
            .get('/api/cards/search',{
                params:{ query: searchQuery},
            })
            .then((response)=>{
                setCards(response.data);
                setLoading(false);
            })
            .catch((error)=>{
                console.error('Error fetching cards', error);
                setLoading(false);
            });
        }else{
            setCards([]);
        }
    },[searchQuery])
  return (
    <div className="search-container" style={{ position: 'relative' }}>
    <input
      type="text"
      placeholder="Search for a card..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{ width: '100%', padding: '8px' }}
    />
    
    {/* Tampilkan loading jika sedang mengambil data */}
    {loading && <p>Loading...</p>}

    {/* Dropdown hasil pencarian */}
    {searchQuery && cards.length > 0 && (
      <ul
        style={{
          position: 'absolute',
          top: '40px', // Menempatkan dropdown tepat di bawah input
          left: 0,
          width: '100%',
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '5px 0',
          margin: 0,
          listStyleType: 'none',
          zIndex: 1000,
        }}
      >
        {cards.map((card) => (
          <li
            key={card.id}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9',
              borderBottom: '1px solid #ddd',
            }}
            onClick={() => {
              // Anda bisa menambahkan aksi klik pada item hasil pencarian, misalnya mengarahkan ke detail card
              console.log(`Selected card: ${card.title}`);
            }}
          >
            <h4>{card.title}</h4>
            <p>{card.description}</p>
          </li>
        ))}
      </ul>
    )}

    {/* Tampilkan pesan jika tidak ada hasil pencarian */}
    {searchQuery && cards.length === 0 && (
      <ul
        style={{
          position: 'absolute',
          top: '40px',
          left: 0,
          width: '100%',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '5px 0',
          margin: 0,
          listStyleType: 'none',
          zIndex: 1000,
        }}
      >
        <li
          style={{
            padding: '10px',
            backgroundColor: '#f9f9f9',
            cursor: 'default',
          }}
        >
          No results found
        </li>
      </ul>
    )}
  </div>
  )
}

export default SearchCard