import React, { useEffect, useState } from 'react'
import { duplicateCard, getCards, getLists } from '../services/Api';
import { AlertTitle } from '@mui/material';
import duplicate from '../assets/duplication.png'
import '../style/DuplicateBoardStyle.css'

const DuplicateCardPopup=({cardId,isOpenCard,onCloseCard, onCardDuplicated})=> {
    // const [cards, setCards] = useState([]);
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
            <div className='popup-content'>
                <h2>Duplicate Card</h2>
                <img src={duplicate} alt={duplicate} />
                <label className='popup-label' >
                    Select List: <br />
                    <select
                        value={selectedListId}
                        onChange={(e)=>setSelectedListId(e.target.value)}
                        style={{border:'1px solid #491519'}}
                    >
                        <option value="">Select Lists</option>
                        {lists.map((list)=>(
                            <option key={list.id} value={list.id}>
                                {list.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button className='duplicate-btn' onClick={handleDuplicateCard} disabled={!selectedListId}>Duplicate card</button>
                <button className='cancle-btn' onClick={onCloseCard}>Cancle</button>
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