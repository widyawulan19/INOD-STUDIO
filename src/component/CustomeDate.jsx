import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advanceFormat from 'dayjs/plugin/advancedFormat';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/id';
import '../style/Date.css';
import DisplayDate from './DisplayDate';
import { useDate } from '../context/DateContext';

dayjs.extend(customParseFormat);
dayjs.extend(advanceFormat);
dayjs.extend(isBetween);
dayjs.locale('id');

const CustomeDate = ({ cardId, dueDate }) => {
  const { selectedDates, setSelectedDate } = useDate();
  const selectedDate = selectedDates[cardId] || null;

  useEffect(() => {
    const storedDate = localStorage.getItem(`selectedDate_${cardId}`);
    if (storedDate) {
      const parsedDate = dayjs(storedDate, 'YYYY-MM-DD');
      if (parsedDate.isValid()) {
        setSelectedDate(cardId, parsedDate);
      }
    }
  }, [cardId, setSelectedDate]);

  const handleDateChange = (date) => {
    if (date && dayjs.isDayjs(date) && date.isValid()) {
      setSelectedDate(cardId, date);
      localStorage.setItem(`selectedDate_${cardId}`, date.format('YYYY-MM-DD'));
    } else {
      setSelectedDate(cardId, null);
      localStorage.removeItem(`selectedDate_${cardId}`);
    }
  };

  const isNearDueDate = (date) => {
    if (!dueDate) return false;
    const dueDateDayjs = dayjs(dueDate, 'YYYY-MM-DD');
    return date.isBetween(dueDateDayjs.subtract(2, 'day'), dueDateDayjs, 'day', '[]');
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={['DatePicker']}
          className="custom-date-container"
        >
          <DatePicker
            label="Pilih Tanggal"
            value={selectedDate}
            onChange={handleDateChange}
            format="D MMMM YYYY"
            slotProps={{
              textField: {
                className: `date-picker-input ${selectedDate && isNearDueDate(selectedDate) ? 'near-due-date' : ''}`,
              },
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
      {/* {selectedDate && (
        <h3>Date: {selectedDate.format('D MMMM YYYY')}</h3>
      )} */}
      {/* <DisplayDate  cardId={cardId}/> */}
    </div>
  );
};

export default CustomeDate;
