import React, { useEffect, useState } from 'react';
import { getAllImage, updateBoardBackground } from '../services/Api';

const Background = ({boardId, onChangeBackground }) => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState('');

  useEffect(() => {
    const fetchBackgrounds = async () => {
      console.log('Received boardId:', boardId)
      console.log('Selected image id:', selectedImageId)
      try {
        const response = await getAllImage(); // Mengambil semua gambar
        setBackgrounds(response.data);
      } catch (error) {
        console.error('Error fetching backgrounds:', error);
      }
    };
    fetchBackgrounds();
  }, [selectedImageId,boardId]);

  // Fungsi untuk handle update background
  const handleUpdateBackground = async (e) => {
    const newImageId = e.target.value;
    setSelectedImageId(newImageId);

    console.log('Selected Image ID:', newImageId); // Debugging
    console.log('Board ID:', boardId); // Debugging

    if (onChangeBackground) {
      onChangeBackground(newImageId);
    }

    try {
      await updateBoardBackground(boardId, newImageId);
      console.log('Background updated');
    } catch (error) {
      console.error('Error updating background:', error);
    }
  };

  return (
    <div style={{
      width: '10vw',
      backgroundColor: 'white',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      height: '4vh',
      borderRadius: '5px',
      marginRight: '1vw',
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px',
    }}>
      <select
        onChange={handleUpdateBackground}
        value={selectedImageId}
        style={{ width: '100%', backgroundColor: 'white' }}
      >
        <option value="">Select Background</option>
        {backgrounds.map((bg) => (
          <option key={bg.id} value={bg.id}>
            {bg.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Background;
