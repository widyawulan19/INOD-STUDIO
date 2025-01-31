import React, { useEffect, useState } from 'react'
import { getSelectedCoverForCard } from '../services/Api';
import '../style/CoverSelect.css';

const DisplayCover=({cardId})=> {
    const [selectedCover, setSelectedCover] = useState(null);

    useEffect(()=>{
        const fetchSelectedCover = async () =>{
            if(!cardId) return; //memastikan cardId tersedia
            try{
                const data = await getSelectedCoverForCard(cardId);
                console.log('Fetched Cover:', data);
                setSelectedCover(data);
                console.log('Fetched Cover:', data);  // Cek apakah cover_color_code ada di sini
                if (data && data.color_code) {
                    setSelectedCover(data);
                } else {
                    console.log('Cover data does not contain cover_color_code');
                }
            }catch(error){
                console.error('Error loading selected cover:', error);
            }
        };

        fetchSelectedCover();
    },[cardId]);

  return (
    <div className='card-cover-container'>
        {selectedCover ? (
            selectedCover.cover_image_url ? (
            <img
                src={selectedCover.cover_image_url}
                alt={selectedCover.name || 'Card Cover'}
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '4px',

                }}
            />
            ) : (
            <div
                style={{
                width: '190px',
                height: '50px',
                backgroundColor: selectedCover.color_code || 'grey', // default color jika tidak ada cover_color_code
                borderRadius: '8px',
                }}
            />
            )
        ) : (
            <p>No cover selected</p> // Jika tidak ada cover
      )}
    </div>
  )
}

export default DisplayCover