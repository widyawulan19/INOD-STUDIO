import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/id';
import '../style/Date.css';
import { useDate } from '../context/DateContext';
import { getCardById, updateDueDate } from '../services/Api';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.locale('id');
 
const CustomeDate = ({ cardId}) => {
  const { selectedDates, setSelectedDate } = useDate();
  const selectedDate = selectedDates[cardId] || '';

  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);
  const [dueDate, setDueDate] = useState(null);

  useEffect(()=>{
    const fetchDueDate = async () =>{
      try{
        const cardData = await getCardById(cardId);
        if(cardData.due_date){
          setDueDate(cardData.due_date);
          setLocalSelectedDate(dayjs(cardData.due_date).format('YYYY-MM-DD'));
        }
      }catch(error){
        console.error('Error fetching due date:', error);
      }
    };
    fetchDueDate();
  },[cardId]);

//   useEffect(() => {
//     const storedDate = localStorage.getItem(`selectedDate_${cardId}`);
//     if (storedDate) {
//       const parsedDate = dayjs(storedDate, 'YYYY-MM-DD');
//       // if (parsedDate.isValid()) {
//       if(parsedDate.isValid() && parsedDate.format('YYYY-MM-DD') != localSelectedDate){
//         setSelectedDate(cardId, parsedDate);
//         setLocalSelectedDate(parsedDate.format('YYYY-MM-DD'));
//       }
//     }
//   // }, [cardId, setSelectedDate]);
// }, [cardId, setSelectedDate, localSelectedDate]);

  const handleDateChange = async (e) => {
    const date = e.target.value;
    if (date) {
      const parsedDate = dayjs(date, 'YYYY-MM-DD');
      if (parsedDate.isValid()) {
        setSelectedDate(cardId, parsedDate);
        setLocalSelectedDate(date);
        localStorage.setItem(`selectedDate_${cardId}`, date);

        try{
          await updateDueDate(cardId,date);
          setDueDate(date);
        }catch(error){
          console.error('Failed to update due date:', error);
        }
      }
    } else {
      setSelectedDate(cardId, null);
      setLocalSelectedDate('');
      localStorage.removeItem(`selectedDate_${cardId}`);

      try{
        await updateDueDate(cardId, null);
        setDueDate(null);
      }catch(error){
        console.error('Failed to clear due date:', error);
      }
    }
  };

  const isNearDueDate = (date) => {
    if (!dueDate) return false;
    const dueDateDayjs = dayjs(dueDate, 'YYYY-MM-DD');
    const selectedDateDayjs = dayjs(date, 'YYYY-MM-DD');
    return selectedDateDayjs.isBetween(
      dueDateDayjs.subtract(2, 'day'),
      dueDateDayjs,
      'day',
      '[]'
    );
  };


  return (
    <div className="date-picker-container">
      {/* <label htmlFor={`date-picker-${cardId}`} className="date-picker-label">
        Select a Date:
      </label> */}
      <input
        type="date"
        id={`date-picker-${cardId}`}
        value={localSelectedDate}
        onChange={handleDateChange}
        className={`date-picker-input ${localSelectedDate && isNearDueDate(localSelectedDate) ? 'near-due-date' : ''}`}
      />
      {/* {localSelectedDate && (
        <p className="selected-date">
          Selected Date: {dayjs(localSelectedDate).format('D MMMM YYYY')}
        </p>
      )} */}
    </div>
  );
};

export default CustomeDate;
