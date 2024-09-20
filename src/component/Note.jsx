/*
import { useState, useEffect } from 'react';
import { getCardById, updateCardLabels } from './api'; // Pastikan API ini sudah ada

const CardDetail = ({ cardId }) => {
    const [card, setCard] = useState(null);
    const [selectedLabels, setSelectedLabels] = useState([]); // State untuk label yang dipilih

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const response = await getCardById(cardId);
                setCard(response.data);
                // Set initial selected labels from card data
                const initialLabels = response.data.labels.map(label => label.id);
                setSelectedLabels(initialLabels);
            } catch (error) {
                console.error("Failed to fetch card: ", error);
            }
        };

        fetchCard();
    }, [cardId]);

    const handleLabelChange = (labelId) => {
        setSelectedLabels(prev =>
            prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
        );
    };

    const handleSave = async () => {
        try {
            await updateCardLabels(cardId, selectedLabels); // Panggil API untuk memperbarui label
            alert("Labels saved successfully!");
        } catch (error) {
            console.error("Failed to save labels: ", error);
        }
    };

    if (!card) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card-detail">
            <h3>{card.title}</h3>
            <p>{card.description}</p>

            {/* Render label selection *
            <div className="label-selection">
                {card.labels.map(label => (
                    <label key={label.id}>
                        <input
                            type="checkbox"
                            checked={selectedLabels.includes(label.id)}
                            onChange={() => handleLabelChange(label.id)}
                        />
                        {label.name}
                    </label>
                ))}
            </div>

            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default CardDetail;


return (
        <div className='card-detail-container'>
          <div className="description-container">
            <div className='cover'></div>
            <div className="container">
              <div className="description">
              <div className="labels">
                {card-labels && card-labels.map(label => (
                    <span 
                        key={label.id} 
                        style={{ backgroundColor: label.color, padding: '5px', margin: '5px', color: '#fff' }}>
                        {label.name}
                    </span>
                ))}
              </div>
                
                <h5 style={{textAlign:'left'}}> <HiOutlineCreditCard size={25}/>New Project-1track-alexxpiinksz-SWQUENCE-1D343 EXTRA FAST</h5>
                <div className='select-option'>
                    <strong>Select Label</strong>
                    <div>
                      {labels.map((label)=>(
                        <button key={label.id} style={{backgroundColor: label.color}} onClick={()=> handleLabelSelection(label)}>
                          {selectedLabels.includes(label) ? 'Unselect' : 'Select'} {label.name}
                        </button>
                      ))}
                    </div>

                    
                    {/* <select
                        multiple={true}
                        onChange={handleLabelChange}
                        style={{
                            backgroundColor: '#323940',
                            color: '#B6C2CE',
                            fontWeight: 'bold',
                            marginLeft: '10px',
                            height: "30px",
                            border: '1px solid #B6C2CE',
                            borderRadius: '4px'
                        }}
                    >
                        <option disabled>Select a label</option>
                        {labels.map((label) => (
                            <option
                                key={label.id}
                                value={label.id}
                                style={{ backgroundColor: label.color, color: 'white' }}
                            >
                                {label.name}
                            </option>
                        ))}
                    </select> 
                    </div>

                    {/* Display Selected Labels 
                    <div className='selected-labels-container' style={{ marginTop: '10px', border:'1px solid blue' }}>
                        <strong>Selected Labels:</strong>
                        <div className='selected-labels'>
                          <div>
                            {selectedLabels.map((label)=> (
                              <span key={label.id} style={{ backgroundColor: label.color, padding: '5px', margin: '2px' }}>
                                {label.name}
                              </span>
                            ))}
                          </div>
                            {/* {selectedLabels.length > 0 ? (
                                selectedLabels.map((label) => (
                                    <div
                                        key={label.id}
                                        className='label'
                                        style={{
                                            backgroundColor: label.color,
                                            color: '#fff',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            marginBottom: '5px',
                                            display: 'inline-block',
                                            marginRight: '5px',
                                        }}
                                    >
                                        {label.name}
                                        <button
                                            onClick={() => handleLabelRemove(label.id)}
                                            style={{
                                                marginLeft: '5px',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                color: '#fff',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            x
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No labels selected</p>
                            )} 
                        </div>
                    </div>
    
    
                      
                    {/* <div className="label-selected-container">
                                <h5>Selected Labels</h5>
                                <select
                                    multiple={true}
                                    onChange={handleLabelChange}
                                    style={{ width: '200px', height: '100px' }}
                                >
                                    {labels.map((label) => (
                                        <option key={label.id} value={label.id} style={{ backgroundColor: label.color }}>
                                            {label.name}
                                        </option>
                                    ))}
                                </select>
                                <div className='selected-labels' style={{ marginTop: '10px' }}>
                                    {selectedLabels.length > 0 ? (
                                        selectedLabels.map((label) => (
                                            <div
                                                key={label.id}
                                                className='label'
                                                style={{
                                                    backgroundColor: label.color,
                                                    color: '#fff',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    marginBottom: '5px',
                                                    display: 'inline-block',
                                                    marginRight: '5px',
                                                }}
                                            >
                                                {label.name}
                                                <button
                                                    onClick={() => handleLabelRemove(label.id)}
                                                    style={{
                                                        marginLeft: '5px',
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No labels selected</p>
                                    )}
                                </div>
                            </div> 
                            <div className="cover">
                              {cover.map((cover)=>(
                                <img 
                                key={cover.id}
                                src={cover.cover_image_url} 
                                alt={cover.name}
                                style={{ width: '100%', height: 'auto' }}
                              />
                              ))}
                            </div>
*/