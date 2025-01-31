import React, { useEffect, useState } from 'react'
import '../style/CoverSelect.css';
import { getNewAllCovers, getSelectedCoverForCard, selectAndSaveCover } from '../services/Api';
import { CiImageOn } from 'react-icons/ci';

const SelectorCover = ({cardId}) => {
    const [covers, setCovers] = useState([]);
    const [selectedCover, setSelectedCover] = useState(null);
    const [items, setItems] = useState([]);
    const [showSelectedCover, setShowSelectedCover] = useState(false);

    const toggleShowCover = () => {
        setShowSelectedCover(!showSelectedCover);
    }

    useEffect(()=>{
        console.log('Card IDnya adalah:', cardId);
        const fetchCovers = async() =>{
            try{
               const response = await getNewAllCovers();
               setCovers(response.data);
            }catch(error){
                console.error('Error landing covers:', error);
            }
        }
        
        const fetchSelectedCover = async () =>{
            if (!cardId) return;
            try{
                const data = await getSelectedCoverForCard(cardId);
                console.log('Fetched Cover:', data);
                setSelectedCover(data);
                console.log('Fetched Cover:', data);  // Cek apakah cover_color_code ada di sini
                if (data && data.cover_color_code) {
                    setSelectedCover(data);
                } else {
                    console.log('Cover data does not contain cover_color_code');
                }
            }catch(error){
                console.error('Error loading selected cover:', error);
            }
        }

        fetchCovers();
        fetchSelectedCover();
    },[cardId])

    // const handleSelectCover = async (coverId) => {
    //     try{
    //         // await selectAndSaveCover(cardId, coverId);
    //         // setSelectedCover({...selectedCover, cover_id:coverId});
    //         await selectAndSaveCover(cardId, coverId);
    //         const selectedCoverData = covers.find(cover => cover.id === coverId);
    //         setSelectedCover({ ...selectedCover, cover_id: coverId });
    //         setSelectedCover(selectedCoverData)
    //     }catch(error){
    //         console.error('Error selecting cover:', error);
    //     }
    // };
    const handleSelectCover = async (coverId) => {
        try {
            await selectAndSaveCover(cardId, coverId);
            const selectedCoverData = covers.find(cover => cover.id === coverId);
            if (selectedCoverData) {
                setSelectedCover(selectedCoverData); // Hanya satu kali pemanggilan
            } else {
                console.warn('Cover not found in the covers list.');
            }
        } catch (error) {
            console.error('Error selecting cover:', error);
        }
    };
    

    const coversWithColorCode = covers.filter(cover => cover.color_code && !cover.cover_image_url);
    const coversWithImageUrl = covers.filter(cover => cover.cover_image_url);
    // console.log('Selected Cover Color Code:', selectedCover.cover_color_code);

    return (
        <div className='cover-container'>
            {/* show cover  */}
            <div className="show-selected">
                {/* <h4>Selected cover</h4> */}
                {selectedCover ? (
                    console.log('Selected Cover Color Code:', selectedCover.color_code),
                    selectedCover.cover_image_url ? (
                        
                        <img
                            src={selectedCover.cover_image_url}
                            alt={selectedCover.cover_name}
                            style={{ 
                                width: '100%', 
                                height:'200px',
                                borderRadius: '4px'
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width:'100%',
                                height: '100px',
                                backgroundColor: selectedCover.color_code || 'grey',
                                borderRadius: '4px',
                            }}
                        />
                    )
                ) : (
                    <p>No cover selected</p>
                )} 
            </div>
            <button 
                className='cover-button' 
                onClick={toggleShowCover}
                style={{
                    marginTop:'5px'
                }}
            >
                <p>Select Cover</p>
                <CiImageOn/>
            </button>

            {/* SELECTION COVER  */}
            {showSelectedCover && (
                <div className="cover-select-container">
                    <div style={{ display: 'flex', flexDirection:'row', gap: '5px', border:'1px solid #eee', overflowX:'auto', padding:'10px', whiteSpace:'nowrap' }}>
                        {coversWithColorCode.map((cover) => (
                            <div
                                key={cover.id}
                                onClick={() => handleSelectCover(cover.id)}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: cover.color_code,
                                    flexShrink:0, 
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ color: 'blue' }}>{cover.name}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection:'row', gap: '5px', marginTop: '20px',border:'1px solid #eee',overflowX:'auto', padding:'10px', whiteSpace:'nowrap' }}>
                        {coversWithImageUrl.map((cover) => (
                            <div
                                key={cover.id}
                                onClick={() => handleSelectCover(cover.id)}
                                style={{
                                    width: '100px',
                                    height: 'fit-content',
                                    borderRadius: '4px',
                                    flexShrink:0,
                                    cursor: 'pointer'
                                }}
                            >
                                <img
                                    src={cover.cover_image_url}
                                    alt={cover.name}
                                    style={{ 
                                        width: '100%', 
                                        height: '70%', 
                                        borderRadius: '8px',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SelectorCover