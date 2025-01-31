import React, { useEffect, useState } from 'react';
import { useDate } from '../context/DateContext';
import dayjs from 'dayjs';

const DisplayDate = ({ cardId }) => {
    const { selectedDates, setSelectedDate } = useDate();
    const [localStoredDate, setLocalStoredDate] = useState(null);
    const selectedDate = selectedDates[cardId] || localStoredDate;

    useEffect(()=>{
        if(!selectedDates[cardId]){
            const storedDate = localStorage.getItem(`selectedDate_${cardId}`);
            if(storedDate){
                const parsedDate = dayjs(storedDate, 'YYYY-MM-DD');
                if(parsedDate.isValid()){
                    setLocalStoredDate(parsedDate);
                    setSelectedDate(cardId,parsedDate)
                }
            }
        }
    },[cardId,selectedDates,setSelectedDate]);

    return (
        <div>
            {selectedDate ? (
                <h5 
                    style={{
                        color:'black',
                        fontWeight:'normal',
                        fontSize:'10px',
                        marginLeft:'2px'
                        // backgroundColor:'green'
                    }}>
                        {selectedDate.format('D MMMM YYYY')}
                </h5>
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default DisplayDate;


