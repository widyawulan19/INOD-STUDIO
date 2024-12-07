import React, { useState } from 'react';
import { updateCard } from '../services/Api';
import '../style/WorkspaceEdit.css';
import { IoClose, IoCloseOutline } from 'react-icons/io5'

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
        <div className="edit-title">
          <h5>Edit List</h5>
          <IoCloseOutline size={20} style={{color:'grey', cursor:'pointer'}} onClick={onClose}/>
        </div>
        <div className="edit-form">
          <div className='input-name'>
            <label>Name</label>
            <input 
              type='text'
              name='title'
              value={cardEdit.title} // Gunakan cardEdit.title, bukan cardEdit.name
              onChange={handleChange}
              placeholder='Card title'
              className='input-field'
              onClick={stopPropagation}
            />
          </div>
          <div className='input-desc'>
            <label>Description </label>
            <input  
              name='description' 
              value={cardEdit.description}
              onChange={handleChange}
              placeholder='Card description'
              className='field-input'
              onClick={stopPropagation}
            />
          </div>
        </div>
        
        <div className='edit-button'>
          <button className='save-btn' onClick={handleSave}>Save</button>
          {/* <button className='cancle-btn' onClick={onClose}>Cancel</button> */}
        </div>
      </div>
    </div>
  );
};

export default EditCard;
