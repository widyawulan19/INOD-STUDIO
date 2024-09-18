//just for note

/*
import React, { useEffect, useState } from "react";

const Background = ({ boardId, onChangeBackground }) => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState('');

  // Mengambil daftar background dari database saat komponen dimuat
  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const response = await fetch('/api/images');  // Panggil endpoint '/api/images'
        const data = await response.json();
        console.log('Backgrounds fetched:', data); // Debugging
        setBackgrounds(data);  // Simpan data gambar ke state
      } catch (error) {
        console.error('Error fetching backgrounds:', error);
      }
    };

    fetchBackgrounds();
  }, []);

  // Fungsi untuk mengupdate background ketika pilihan berubah
  const handleUpdateBackground = async (e) => {
    const newImageId = e.target.value;
    setSelectedImageId(newImageId);

    // Panggil onChangeBackground jika ada
    if (onChangeBackground) {
      onChangeBackground(newImageId);
    }

    // Update background di database dengan API
    try {
      const response = await fetch(`/api/boards/${boardId}/background`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_id: newImageId }), // Kirim image_id untuk update background board
      });

      const result = await response.json();
      console.log('Background updated:', result); // Debugging
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
        {backgrounds.length > 0 ? (
          backgrounds.map((bg) => (
            <option key={bg.id} value={bg.id}>
              {bg.name} {/* Pastikan bg.name sesuai dengan kolom nama pada tabel image 
              </option>
            ))
          ) : (
            <option disabled>No backgrounds available</option>
          )}
        </select>
      </div>
    );
  };
  
  export default Background;
  
*/