import React, { useEffect, useState } from 'react';
import { duplicateCard, getLists } from '../services/Api';
import { AlertTitle } from '@mui/material';
import '../style/DuplicateBoardStyle.css';
import { IoCloseOutline } from 'react-icons/io5';

const DuplicateCardPopup = ({ cardId, isOpenCard, onCloseCard, onCardDuplicated }) => {
    const localCardData = JSON.parse(localStorage.getItem(`card-${cardId}`)) || {};
    const { date, label, cover } = localCardData;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState('');
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        severity: ''
    });

    // Fetch lists
    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await getLists();
                console.log('Fetched lists:', response.data);
                if (Array.isArray(response.data)) {
                    setLists(response.data);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch lists:', error);
            }
        };
        fetchLists();
    }, []);
    

    // Handle card duplication
    // const handleDuplicateCard = async () => {
    //     if (!selectedListId || !cardId) {
    //         setAlert({ show: true, message: 'Card ID or List ID is missing.', severity: 'error' });
    //         return;
    //     }
    //     console.log('Card ID:', cardId);
    //     console.log('Selected List ID:', selectedListId);
    
    //     try {
    //         const response = await duplicateCard(cardId, selectedListId);
    //         setAlert({ show: true, message: 'Card successfully duplicated!', severity: 'success' });
    //         if (onCardDuplicated) onCardDuplicated();
            
    //         setTimeout(() => {
    //             setAlert({ ...alert, show: false });
    //             onCloseCard();
    //         }, 3000);
    //     } catch (error) {
    //         console.error('Failed to duplicate card:', error);
    //         setAlert({ show: true, message: `Failed to duplicate card: ${error.message}`, severity: 'error' });
    //         setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    //     }
    // };
    const handleDuplicateCard = async () => {
            if (!selectedListId || !cardId) {
                setAlert({ show: true, message: 'Card ID or List ID is missing.', severity: 'error' });
                return;
            }
    
            // Pastikan selectedListId adalah integer
            const listIdInt = parseInt(selectedListId, 10);
            if (isNaN(listIdInt)) {
                setAlert({ show: true, message: 'Please select a valid list.', severity: 'error' });
                return;
            }
    
            console.log('Card ID:', cardId);
            console.log('Selected List ID:', listIdInt);
    
            try {
                const response = await duplicateCard(cardId, listIdInt);
                setAlert({ show: true, message: 'Card successfully duplicated!', severity: 'success' });
                if (onCardDuplicated) onCardDuplicated();
    
                setTimeout(() => {
                    setAlert({ ...alert, show: false });
                    onCloseCard();
                }, 3000);
            } catch (error) {
                console.error('Failed to duplicate card:', error);
                setAlert({ show: true, message: `Failed to duplicate card: ${error.message}`, severity: 'error' });
                setTimeout(() => setAlert({ ...alert, show: false }), 3000);
            }
        };

    return (
        isOpenCard && (
            <div className="popup-overlay">
                <div className="popup-content" style={{ border: '1px solid white' }}>
                    <div className="duplicate-header">
                        <h5>Duplicate Card</h5>
                        <IoCloseOutline
                            style={{ color: 'grey', cursor: 'pointer' }}
                            size={20}
                            onClick={onCloseCard}
                        />
                    </div>
                    <div className="duplicate-body">
                        <label>Select List:</label>
                        <div
                            className="dropdown-container"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <div className="dropdown-selected">
                                {selectedListId
                                    ? lists.find((list) => list.id === selectedListId)?.name
                                    : 'Select a List'}
                            </div>
                            {dropdownOpen && (
                                <ul className="dropdown-list">
                                    {lists.length > 0 ? (
                                        lists.map((list) => (
                                            <li
                                                key={list.id}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setSelectedListId(list.id);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                {list.name}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No lists available</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="duplicate-btn">
                        <button
                            className="duplicate-btn"
                            onClick={handleDuplicateCard}
                            disabled={!selectedListId}
                        >
                            Duplicate Card
                        </button>
                    </div>
                </div>
                {alert.show && (
                    <AlertTitle
                        className="alert-position"
                        severity={alert.severity}
                        onClose={() => setAlert({ ...alert, show: false })}
                    >
                        {alert.message}
                    </AlertTitle>
                )}
            </div>
        )
    );
};

export default DuplicateCardPopup;



/*
import React, { useEffect, useState } from 'react'
import { duplicateCard, getCards, getLists } from '../services/Api';
import { AlertTitle } from '@mui/material';
import duplicate from '../assets/duplication.png'
import '../style/DuplicateBoardStyle.css'
import { IoCloseOutline } from 'react-icons/io5'

const DuplicateCardPopup=({cardId,isOpenCard,onCloseCard, onCardDuplicated})=> {
    // const [cards, setCards] = useState([]);
    const localCardData = JSON.parse(localStorage.getItem(`card-${cardId}`)) || {};
    const {date, label, cover} = localCardData;
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [card, setCard]  = useState([]);
    const [lists, setList] = useState([]);
    const [selectedListId, setSelectedListId] = useState('')
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        severity:''
    })

    const loadCards = async()=>{
        try{
            const response = await getCards();
            setCard(response.data);
        }catch(error){
            console.log('Failed to fetch cards:', error);
        }
    };
    useEffect(()=>{
        loadCards();
    },[])

    useEffect(()=>{
        const fetchList = async () =>{
            try{
                const response = await getLists();
                setList(response.data);
                console.log('data list berhasil diambil')
            }catch(error){
                console.log('Failed to fetch list:', error);
            }
        };
        fetchList();
    },[])


    const handleDuplicateCard = async() =>{
        if(!selectedListId){
            setAlert({show:true, message:'Please select a board', severity:'error'})
            return;
        }
        console.log('Request data:', {cardId, lists_id:selectedListId})

        try{
            await duplicateCard(cardId, {list_id:selectedListId});
            setAlert({show:true, message:'Card successfully duplicated!', severity:'success'})
            setTimeout(()=>{
                setAlert({...alert, show:false})
                onCloseCard();
            },3000)
        }catch(error){
            console.error('Duplicate Error:', error);
            setAlert({show:true, message:'Failed to duplicate list:' + error.message, severity:'error'})
            setTimeout(()=>{
                setAlert({...alert, show:false})
            },3000)
        }
    }


  return (
    isOpenCard && (
        <div className='popup-overlay'>
            <div className='popup-content' style={{border:'1px solid white'}}>
                <div className="duplicate-header">
                    <h5>Duplicate Card</h5>
                    <IoCloseOutline style={{color:'grey', cursor:'pointer', margin:'0'}} size={20} onClick={onCloseCard}/>
                </div>
                <div className="duplicate-body">
                    <label>
                        Select List :
                    </label>
                    <div 
                        className="dropdown-container"
                        onClick={()=> setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="dropdown-selected">
                            {selectedListId
                                ? lists.find((ls)=> ls.id === selectedListId)?.name
                                : 'Selected List'
                            }
                        </div>
                        {dropdownOpen && (
                            <ul className='dropdown-list'>
                                {lists.map((list)=>(
                                    <li
                                        key={list.id}
                                        className='dropdown-item'
                                        onClick={()=>{
                                            setSelectedListId(list.id);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        {list.name}
                                    </li>
                                ))}

                            </ul>
                        )}
                    </div>
                </div>
                <div className="duplicate-btn">
                    <button className='duplicate-btn' onClick={handleDuplicateCard} disabled={!selectedListId}>Duplicate card</button>
                </div>
            </div>
            {alert.show && (
                <AlertTitle className='alert-position' severity={alert.severity} onClose={()=> setAlert({...alert, show:false})}>
                    {alert.message}
                </AlertTitle>
             )}
        </div>
    )
  )
}

export default DuplicateCardPopup

*/