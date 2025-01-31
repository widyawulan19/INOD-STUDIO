import React, { useEffect, useState } from 'react'
import { getCardLabels } from '../services/Api';
import '../style/Label.css';


const DisplayLabel=({cardId})=> {
    const [labels, setLabels] = useState([]);

    useEffect(()=>{
        const fetchCardLabel = async() =>{
            if (!cardId || cardId === "null") {
                console.error('Invalid cardId');
                return;  // Jangan lanjutkan jika cardId tidak valid
            }
            
            try{
                const response = await getCardLabels(cardId);
                setLabels(response.data);
            }catch(error){
                console.error('Error fetching labels:', error);
            }
        }
        if(cardId){
            fetchCardLabel();
        }
    }, [cardId])
  return (
    <div className='display-label-container'>
                {labels.length > 0 ? (
                    <div className='display-label'>
                        {labels.map((label) =>(
                            <div 
                                style={{
                                    width:'fit-content',
                                    height:'fit-content',
                                    backgroundColor: label.label_bg_color,
                                    borderRadius:'4px',
                                    padding:'5px',
                                    margin:'2px',
                                    fontSize:'10px'

                                }}
                            >
                                {label.label_name}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No labels found for this card.</p>
                )}
        </div>
  )
}

export default DisplayLabel