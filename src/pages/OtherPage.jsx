import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const OtherPage = () => {
    //cover
    const [selectedCover, setSelectedCover] = useState([]);
    //label
      const [selectedLabels, setSelectedLabels] = useState([]);
      const location = useLocation();
      const {cardId} = useParams();


useEffect(()=>{
    if(location.state && location.state.selectedLabels){
        setSelectedLabels(location.state.selectedLabels);
    }else{
        const savedLabels = localStorage.getItem(`selectedLabel_${cardId}`);
        if(savedLabels){
            setSelectedLabels(JSON.parse(savedLabels));
        }
    }
}, [location])


  return (
    <div>
      <h3>Selected Labels:</h3>
      <div>
        {selectedLabels.map((label)=>(
            <div
            key={label.id}
            style={{
              backgroundColor: label.bgColor || 'lightgray', // Default background if bgColor is not defined
              color: label.color || 'black', // Default color if color is not defined
              padding: '10px',
              borderRadius: '3px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {label.name}
          </div>
        ))}
      </div>
      {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {selectedLabels.length > 0 ? (
          selectedLabels.map((label) => (
            <div
              key={label.id}
              style={{
                backgroundColor: label.bgColor || 'lightgray', // Default background if bgColor is not defined
                color: label.color || 'black', // Default color if color is not defined
                padding: '10px',
                borderRadius: '3px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {label.name}
            </div>
          ))
        ) : (
          <p>No labels selected.</p> // Message if no labels are selected
        )}
      </div> */}
    </div>
  );
};

export default OtherPage;
