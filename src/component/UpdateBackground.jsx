import React, { useState } from 'react'

function UpdateBackground({boardId}) {
    const [selectedImageId, setSelectedImageId] = useState('');

    const handleUpdateBackground = async () => {
        const response = await fetch(`/boards/${boardId}/background`, {
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({image_id: selectedImageId}),
        });

        const data = await response.json();
        console.log('Board update with background:', data);
    };

  return (
    <div>
        <h3>Select Image ID for background</h3>
        <input 
            type="text"
            value={selectedImageId}
            onChange={(e)=> setSelectedImageId(e.target.value)}
            placeholder='Enter image Id'
        />
        <button onClick={handleUpdateBackground}>Set Background</button>
    </div>
  )
}

export default UpdateBackground