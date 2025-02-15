import React, { useEffect, useState } from 'react';
import { duplicateCard, getLists } from '../services/Api';
import { AlertTitle } from '@mui/material';
import '../style/DuplicateBoardStyle.css';
import '../style/DuplicateCard.css';
import { IoCloseOutline } from 'react-icons/io5';

const DuplicateCardPopup = ({ cardId, isOpenCard, onCloseCard, onCardDuplicated }) => {
    const localCardData = JSON.parse(localStorage.getItem(`card-${cardId}`)) || {};
    const { date, label, cover } = localCardData;
    //filter fiture
    const [filteredLists, setFilteredLists] = useState([]);
    const [searchList, setSearchList] = useState('');
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
                    setFilteredLists(response.data);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch lists:', error);
            }
        };
        fetchLists();
    }, []);

    //search input
    useEffect(()=>{
        if(searchList === ''){
            setFilteredLists(lists);
        }else{
            // const filtered = lists.filter((list)=>
            //     list.name.toLowerCase().includes(searchList.toLocaleLowerCase())
            // );
            // setFilteredLists(filtered);
            const filteredLists = lists.filter((list) =>
                list.name.toLowerCase().includes(searchList.toLowerCase())
            );
            setFilteredLists(filteredLists);
        }
    },[searchList,lists])
    //end search input
    
    const handleDuplicateCard = async () => {
        if (!selectedListId || !cardId) {
            setAlert({ show: true, message: 'Card ID or List ID is missing.', severity: 'error' });
            return;
        }
    
        const listIdInt = parseInt(selectedListId, 10);
        if (isNaN(listIdInt)) {
            setAlert({ show: true, message: 'Please select a valid list.', severity: 'error' });
            return;
        }
    
        try {
            const response = await duplicateCard(cardId, listIdInt);
            setAlert({ show: true, message: 'Card successfully duplicated!', severity: 'success' });
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
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Search List"
                                    value={searchList}
                                    onChange={(e) => setSearchList(e.target.value)}
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="search-input"
                                />
                               
                                <div className="dropdown-container-card">
                                    {/* <div className="dropdown-selected" >
                                        {selectedListId
                                            ? lists.find((list) => list?.id === selectedListId)?.name
                                            : ''}
                                    </div> */}

                                    {dropdownOpen && (
                                        <ul className="dropdown-list">
                                            {searchList && filteredLists.length > 0 ? (
                                                filteredLists.map((list) => (
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
                                                <p className='no'>No lists available</p>
                                            )}
                                        </ul>
                                    )}
                                </div>
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
    
    const handleDuplicateCard = async () => {
        if (!selectedListId || !cardId) {
            setAlert({ show: true, message: 'Card ID or List ID is missing.', severity: 'error' });
            return;
        }
    
        const listIdInt = parseInt(selectedListId, 10);
        if (isNaN(listIdInt)) {
            setAlert({ show: true, message: 'Please select a valid list.', severity: 'error' });
            return;
        }
    
        try {
            const response = await duplicateCard(cardId, listIdInt);
            setAlert({ show: true, message: 'Card successfully duplicated!', severity: 'success' });
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
                                ? lists.find((list) => list?.id === selectedListId)?.name
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
*/