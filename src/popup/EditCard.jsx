import React, { useState } from 'react';
import { updateCard } from '../services/Api';
import '../style/WorkspaceEdit.css';

const EditCard = ({ cardId, card, onClose, onSave }) => {
  const [cardEdit, setCardEdit] = useState({
    title: card.title || '',
    description: card.description || '',
  });

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardEdit((prev) => ({ ...prev, [name]: value }));
  };

//   const handleSave = async () => {
//     try {
//       const updateData = { title: cardEdit.title, description: cardEdit.description };
//       console.log('Update data:', updateData);
//       await updateCard(cardId, updateData); // Mengirim updateData, bukan cardEdit
//       onSave();
//       onClose();
//     } catch (error) {
//       console.error('Error updating card', error);
//     }
//   };

    const handleSave = async () => {
    try {
      await updateCard(card, cardEdit)
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating card', error);
    }
  };

  return (
    <div className='edit-popup-overlay' onClick={stopPropagation} style={{ margin: '0' }}>
      <div className='edit-popup-content' onClick={stopPropagation}>
        <h2>Edit Card</h2>
        <div className='input-name'>
          <input 
            type='text'
            name='title'
            value={cardEdit.title} // Gunakan cardEdit.title, bukan cardEdit.name
            onChange={handleChange}
            placeholder='Card title'
            onClick={stopPropagation}
          />
        </div>
        <div className='input-desc'>
          <textarea  
            name='description' 
            value={cardEdit.description}
            onChange={handleChange}
            placeholder='Card description'
            onClick={stopPropagation}
          />
        </div>
        <div className='modal-actions'>
          <button className='save-btn' onClick={handleSave}>Save</button>
          <button className='cancle-btn' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditCard;
