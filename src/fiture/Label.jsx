import React, { useEffect, useState } from 'react';
import { getlabel, getCardLabels, saveCardLabels, updateCardLabels, removeLabelFromCard,deleteLabelFromCard, createLabel } from '../services/Api';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { IoListSharp,IoCalendarClearOutline, IoPricetagsOutline, IoCloseCircle } from 'react-icons/io5';
import '../style/Label.css';

const Label = ({ cardId }) => {
    const [labels, setLabels] = useState([]); // Semua label
    const [selectedLabels, setSelectedLabels] = useState([]); // Label yang dipilih
    const [cardLabels, setCardLabels] = useState([]); // Label yang sudah diterapkan pada kartu
    const [newLabelName, setNewLabelName] = useState('')
    const [showLabel, setShowLabel] = useState(false)
    const [showCreateLabel, setShowCreateLabel] = useState(false);

    const handleShowCreateForm = () =>{
        setShowCreateLabel(!showCreateLabel);
    }

    const handleShowLabel = () =>{
        setShowLabel(!showLabel)
    }


    // Fetch all labels saat komponen dimuat
    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const response = await getlabel(); // Ambil semua label dari API
                setLabels(response.data);
            } catch (error) {
                console.error('Error fetching labels:', error);
            }
        };
        fetchLabels();
    }, []);

    // Fetch labels yang diterapkan ke kartu saat `cardId` berubah
    const fetchCardLabels = async () => {
        if (cardId) {
            try {
                const response = await getCardLabels(cardId); // Ambil label dari kartu
                setCardLabels(response.data);
                setSelectedLabels(response.data.map(label => label.id)); // Sinkronkan label yang dipilih
            } catch (error) {
                console.error('Error fetching card labels:', error);
            }
        }
    };

    useEffect(() => {
        fetchCardLabels();
    }, [cardId]);

    // Handle seleksi label (tambah atau hapus label)
    const handleLabelSelect = (labelId) => {
        setSelectedLabels((prevSelectedLabels) => {
            if (prevSelectedLabels.includes(labelId)) {
                return prevSelectedLabels.filter((id) => id !== labelId); // Hapus jika sudah dipilih
            } else {
                return [...prevSelectedLabels, labelId]; // Tambah jika belum dipilih
            }
        });
    };

    // Simpan label yang dipilih
    const handleSaveLabels = async () => {
        try {
            const newLabels = selectedLabels.filter(
                (label_id) => !cardLabels.some((label) => label.id === label_id)
            );
            const removedLabels = cardLabels
                .filter((label) => !selectedLabels.includes(label.id))
                .map((label) => label.id);
    
            if (newLabels.length > 0) {
                await saveCardLabels(cardId, newLabels);
            }
    
            // if (removedLabels.length > 0) {
            //     await removeLabelFromCard(cardId, removedLabels);
            // }
    
            // Refresh data
            await fetchCardLabels();
            console.log('Labels saved and updated successfully');
        } catch (error) {
            console.error('Error saving or updating labels:', error);
        }
    };

    //handle delete label form card
    const handleRemoveLabel = async (labelId) => {
        try {
            // Call deleteLabelFromCard API to remove the label
            const response = await deleteLabelFromCard(cardId, labelId);
            if (response && response.status === 200) {
                console.log(`Label ${labelId} removed from card`);
                // Refresh the card labels after deletion
                await fetchCardLabels();
            } else {
                console.error('Failed to remove label from card');
            }
        } catch (error) {
            console.error('Error removing label from card:', error);
        }
    };

    //membuat label baru
    const handleCreateLabel = async()=>{
        if(!newLabelName.trim()){
            alert('Label name is required');
            return;
        }
        try{
            const response = await createLabel({name: newLabelName});
            if(response && response.status === 201){
                setLabels((prevLabels)=> [...prevLabels, response.data]);
                setNewLabelName('');
            }
        }catch(error){
            console.error('Error creating label:', error);
        }
    };

    const handleStopPropagation = (event) =>{
        event.stopPropagation();
    }
   
    return (
        <div>
            <div onClick={handleShowLabel} className='label-title'>
                <IoPricetagsOutline size={25}/>
                <div className='label-result'>
                    {cardLabels.map((label) => (
                        <div 
                            key={label.id} 
                            style={{
                                    backgroundColor: label.label_bg_color || 'white' ,
                                    padding:'5px',
                                    borderRadius:'4px',
                                    }}>
                             {label.label_name}
                             <IoCloseCircle 
                                onClick={() => handleRemoveLabel(label.label_id)} 
                                style={{
                                    marginLeft:'5px'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {showLabel && (
                <div className='label-container'>
                    {/* <h3>Labels for Card {cardId}</h3> */}
                    <h4>Select label here!</h4>
                    <div className="show-label">
                        {labels.map((label)=>(
                            <div key={label.id} className='label-box'>
                                <input
                                        type="checkbox"
                                        id={`label-${label.id}`}
                                        checked={selectedLabels.includes(label.id)} // Status checkbox
                                        onChange={() => handleLabelSelect(label.id)} // Ubah pilihan
                                    />
                                    <p
                                        style={{ 
                                            backgroundColor: label.bg_color || 'white',
                                            padding:'5px',
                                            borderRadius:'4px',
                                        }}
                                    >
                                        {label.name}
                                    </p>
                            </div>
                        ))}
                    </div>
                    <div className='label-action'>
                        <h4>Action</h4>
                        <div>
                            <button onClick={handleShowCreateForm}>
                                <AiOutlinePlus style={{marginRight:'5px'}}/>
                                New Label
                            </button>
                            <button 
                                className='button-save'
                                onClick={handleSaveLabels}
                            >
                                Save Label
                            </button>
                        </div>
                        {showCreateLabel && (
                            <div className="create-form">
                                <input 
                                    type="text" 
                                    placeholder='Enter label name'
                                    value={newLabelName}
                                    onChange={(e)=> setNewLabelName(e.target.value)}
                                />
                                <button onClick={handleCreateLabel}>CREATE</button>
                            </div>
                        )}
                        
                    </div>

                </div>
            )}
        </div>
    );
};

export default Label;




// import React, { useEffect, useState } from 'react';
// import { getlabel, getCardLabels, saveCardLabels, updateCardLabels, removeLabelFromCard,deleteLabelFromCard, createLabel } from '../services/Api';
// import { AiOutlineDelete } from 'react-icons/ai';

// const Label = ({ cardId }) => {
//     const [labels, setLabels] = useState([]); // Semua label
//     const [selectedLabels, setSelectedLabels] = useState([]); // Label yang dipilih
//     const [cardLabels, setCardLabels] = useState([]); // Label yang sudah diterapkan pada kartu
//     const [newLabelName, setNewLabelName] = useState('')

//     // Fetch all labels saat komponen dimuat
//     useEffect(() => {
//         const fetchLabels = async () => {
//             try {
//                 const response = await getlabel(); // Ambil semua label dari API
//                 setLabels(response.data);
//             } catch (error) {
//                 console.error('Error fetching labels:', error);
//             }
//         };
//         fetchLabels();
//     }, []);

//     // Fetch labels yang diterapkan ke kartu saat `cardId` berubah
//     const fetchCardLabels = async () => {
//         if (cardId) {
//             try {
//                 const response = await getCardLabels(cardId); // Ambil label dari kartu
//                 setCardLabels(response.data);
//                 setSelectedLabels(response.data.map(label => label.id)); // Sinkronkan label yang dipilih
//             } catch (error) {
//                 console.error('Error fetching card labels:', error);
//             }
//         }
//     };

//     useEffect(() => {
//         fetchCardLabels();
//     }, [cardId]);

//     // Handle seleksi label (tambah atau hapus label)
//     const handleLabelSelect = (labelId) => {
//         setSelectedLabels((prevSelectedLabels) => {
//             if (prevSelectedLabels.includes(labelId)) {
//                 return prevSelectedLabels.filter((id) => id !== labelId); // Hapus jika sudah dipilih
//             } else {
//                 return [...prevSelectedLabels, labelId]; // Tambah jika belum dipilih
//             }
//         });
//     };

//     // Simpan label yang dipilih
//     const handleSaveLabels = async () => {
//         try {
//             const newLabels = selectedLabels.filter(
//                 (label_id) => !cardLabels.some((label) => label.id === label_id)
//             );
//             const removedLabels = cardLabels
//                 .filter((label) => !selectedLabels.includes(label.id))
//                 .map((label) => label.id);
    
//             if (newLabels.length > 0) {
//                 await saveCardLabels(cardId, newLabels);
//             }
    
//             // if (removedLabels.length > 0) {
//             //     await removeLabelFromCard(cardId, removedLabels);
//             // }
    
//             // Refresh data
//             await fetchCardLabels();
//             console.log('Labels saved and updated successfully');
//         } catch (error) {
//             console.error('Error saving or updating labels:', error);
//         }
//     };

//     //handle delete label form card
//     const handleRemoveLabel = async (labelId) => {
//         try {
//             // Call deleteLabelFromCard API to remove the label
//             const response = await deleteLabelFromCard(cardId, labelId);
//             if (response && response.status === 200) {
//                 console.log(`Label ${labelId} removed from card`);
//                 // Refresh the card labels after deletion
//                 await fetchCardLabels();
//             } else {
//                 console.error('Failed to remove label from card');
//             }
//         } catch (error) {
//             console.error('Error removing label from card:', error);
//         }
//     };

//     //membuat label baru
//     const handleCreateLabel = async()=>{
//         if(!newLabelName.trim()){
//             alert('Label name is required');
//             return;
//         }
//         try{
//             const response = await createLabel({name: newLabelName});
//             if(response && response.status === 201){
//                 setLabels((prevLabels)=> [...prevLabels, response.data]);
//                 setNewLabelName('');
//             }
//         }catch(error){
//             console.error('Error creating label:', error);
//         }
//     };
   
//     return (
//         <div>
//             <h3>Labels for Card {cardId}</h3>
//             <div>
//                 <h5>Create new label</h5>
//                 <input 
//                     type="text" 
//                     placeholder='Enter label name'
//                     value={newLabelName}
//                     onChange={(e)=> setNewLabelName(e.target.value)}
//                 />
//                 <button onClick={handleCreateLabel}>Create label</button>
//             </div>

//             <div>
//                 <h4>Select Labels</h4>
//                 <ul>
//                     {labels.map((label) => (
//                         <li key={label.id}>
//                             <input
//                                 type="checkbox"
//                                 id={`label-${label.id}`}
//                                 checked={selectedLabels.includes(label.id)} // Status checkbox
//                                 onChange={() => handleLabelSelect(label.id)} // Ubah pilihan
//                             />
//                             <label
//                                 htmlFor={`label-${label.id}`}
//                                 style={{ backgroundColor: label.bg_color || 'white' }}
//                             >
//                                 {label.name}
//                             </label>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <button onClick={handleSaveLabels}>Save Selected Labels</button>

//             <div>
//                 <h4>Selected Labels:</h4>
//                 <ul>
//                     {cardLabels.map((label) => (
//                         <li key={label.id} style={{ backgroundColor: label.label_bg_color || 'white' }}>
//                             {label.label_name}
//                             <AiOutlineDelete onClick={() => handleRemoveLabel(label.label_id)} />
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default Label;
