import React, { useEffect, useState } from 'react'
import '../style/ChecklistFitur.css';
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
import { PiDotsThreeBold } from "react-icons/pi";
import { createChecklist, createChecklistItem, deleteChecklist, deleteChecklistItem, getChecklistItems, getChecklists, updateChecklistItem, updateChecklist  } from '../services/Api';


const ChecklistTest=({cardId,checklistId,currentName})=> {
    const [checklists, setChecklist] = useState([]);
    const [newChecklistName, setNewChecklistName] = useState('');
    const [newItemDescription, setNewItemDescription] = useState('');
    const [showChecklistAction, setShowChecklistAction] = useState(false);
    const [showChecklistId, setShowChecklistId] = useState(null);
    const [showItemAction, setShowItemAction] = useState(null);
    const [showItem, setShowItem] = useState(false);
    const [showAllChecklist, setShowAllChecklist] = useState(false);
    //Edit
    const [name,setName] = useState(currentName);
    const [isLoading, setIsLoading] = useState(false);
    const [updateChecklist, setUpdateChecklist] = useState(false);

    //handle show toggle edit checklist 
    const handleShowToggleEditChecklist = () => {
        setShowChecklistAction(!showChecklistAction);
    }

    const handleUpdate = async()=>{
        setIsLoading(true);
        try{
            const updatedChecklist = await updateChecklist(checklistId, name);
            console.log('Checklist updated:', updatedChecklist);
        }catch(error){
            console.error('Error updating checklist:', error);
        }finally{
            setIsLoading(false);
        }
    };


    const showChecklistAll = () =>{
        setShowAllChecklist(!showAllChecklist);
    }

    const showChecklistUsingId = (id) => {
        if (showChecklistId === id) {
            setShowChecklistAction(!showChecklistAction); // Toggle jika id yang sama diklik lagi
        } else {
            setShowChecklistId(id);  // Set id baru
            setShowChecklistAction(true);  // Tampilkan action
        }
    };

    // Fungsi untuk menampilkan dan menyembunyikan action
    const showItemA = (id) => {
        // Jika item yang sama diklik, toggle status showItem
        if (showItemAction === id) {
            setShowItem(!showItem);
        } else {
            setShowItemAction(id);
            setShowItem(true); // Menampilkan action untuk item yang baru diklik
        }
    }

    useEffect(()=>{
        fetchChecklists();
    },[cardId]);

    const fetchChecklists = async () =>{
        try{
            const data = await getChecklists(cardId);

            //fetch checklits items for each checklist
            const checklistsWithItems = await Promise.all(
                data.map(async (checklist) => {
                    const items = await getChecklistItems(checklist.id);
                    return{...checklist, items};
                })
            );
            setChecklist(checklistsWithItems);
        }catch(error){
            console.error('Error loading checklist:', error);
        }
    };

    //handle adding a new checklist
    const handleAddChecklist = async () =>{
        if(!newChecklistName) return alert('Checklist name cannot be empty');
        try{
            await createChecklist(cardId, newChecklistName);
            setNewChecklistName('');
            fetchChecklists();
        }catch(error){
            console.error('Error adding a new checklist', error);
        }
    };

    const handleAddChecklistItem = async (checklistId) => {
        if (!newItemDescription.trim()) {
            alert('Checklist item description cannot be empty');
            return;
        }
        try {
            await createChecklistItem(checklistId, newItemDescription);
            setNewItemDescription('');
            fetchChecklists();
        } catch (error) {
            console.error('Error adding checklist item:', error);
        }
    };
    

    //handle updating the checklist item status
    const handleToggleItemStatus = async (itemId, currentStatus) =>{
        try{
            await updateChecklistItem(itemId, !currentStatus);
            fetchChecklists();
        }catch(error){
            console.error('Error updating checklist item:', error)
        }
    };

    const handleDeleteChecklist = async(checklistId) =>{
        try{
            await deleteChecklist(checklistId);
            fetchChecklists();
        }catch(error){
            console.error('Error deleting checklist:', error);
        }
    };

    //handle deleting a checklist item
    const handleDeleteChecklistItem = async(itemId)=>{
        try{
            await deleteChecklistItem(itemId);
            fetchChecklists();
        }catch(error){
            console.error('Error deleting checklist item:', error);
        }
    }

    //calculate progress for progres bar
    const calculateProgress = (items) => {
        if (!items || !Array.isArray(items) || items.length === 0) return 0;
        const completedItems = items.filter(item => item.is_checked).length;
        return Math.round((completedItems / items.length) * 100);
    };

    return (
        <div className='checklist-container'>        
            {/* Form menambahkan checklist baru */}
            <div className="checklist-title">
                <h4>Checklists</h4>
                <div className="input-checklist">
                    <div className="form-create">
                        <input
                            type="text"
                            placeholder="Add new checklist..."
                            value={newChecklistName}
                            onChange={(e) => setNewChecklistName(e.target.value)}
                        />
                        <button onClick={handleAddChecklist}> 
                            <AiOutlinePlus className='add-btn'/>
                            Checklist
                        </button>
                    </div>
                    <div className="show">
                        <button onClick={showChecklistAll}>
                            {showAllChecklist ? 
                            <>Hide Checklist <AiFillCaretUp size={15} style={{marginLeft:'4px'}}/>  </>
                            :
                            <>Show Checklist <AiFillCaretDown size={15} style={{marginLeft:'4px'}}/> </>
                            }
                            {showAllChecklist && (
                             <div>


                             </div> 
                            )}
                        </button>
                    </div>
                </div>    
            </div>

            {/* Menampilkan semua checklist */}
            {showAllChecklist && (
            <div>
            {checklists.length > 0 ? (
                checklists.map((checklist) => {
                    const progress = calculateProgress(checklist.items);
                    return (
                        <div key={checklist.id} className='show-checklist'>
                            <div className="show-title">
                                <h4>
                                    {checklist.name}
                                    <PiDotsThreeBold 
                                        className='show-ikon'
                                        onClick={() => showChecklistUsingId(checklist.id)}
                                    />
                                </h4>

                                {showChecklistId === checklist.id && showChecklistAction && ( // Perbaikan disini
                                    <div className="show-action">
                                        <button className='action-edit'>
                                            <AiOutlineEdit className='action-ikon'/>
                                            <p>Rename checklist</p>
                                        </button>
                                        <button 
                                            className='action-delete'
                                            onClick={() => handleDeleteChecklist(checklist.id)}
                                        >
                                            <AiOutlineDelete className='action-ikon'/>
                                            <p>Delete checklist</p>
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* <button onClick={() => handleDeleteChecklist(checklist.id)}>Delete Checklist</button> */}
                            
                            {/* Progress Bar dengan Style yang Lebih Smooth */}
                            <div className="progress-bar">
                                <div
                                    style={{
                                        width: `${progress}%`,
                                        background: `linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)`,
                                        height: '12px',
                                        borderRadius: '12px',
                                        transition: 'width 0.5s ease-in-out',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }}
                                >
                                </div>
                                <p>{progress}% Completed</p>
                            </div>

                            {/* Menampilkan checklist items */}
                            {checklist.items && checklist.items.length > 0 ? (
                                checklist.items.map((item) => (
                                    <div key={item.id} className='show-item'>
                                        {/* Menggunakan ikon sebagai pengganti checkbox */}
                                        {item.is_checked ? (
                                            <IoCheckmarkDoneCircle 
                                                size={24} 
                                                color="green" 
                                                onClick={() => handleToggleItemStatus(item.id, item.is_checked)} 
                                                style={{ cursor: 'pointer' }}
                                            />
                                        ) : (
                                            <RiCheckboxBlankCircleLine 
                                                size={24} 
                                                color="#eee" 
                                                onClick={() => handleToggleItemStatus(item.id, item.is_checked)} 
                                                style={{ cursor: 'pointer' }}
                                            />
                                        )}

                                        <p>{item.description}</p>
                                        <PiDotsThreeBold 
                                            className='show-ikon'
                                            onClick={() => showItemA(item.id)} // Menjalankan fungsi untuk menampilkan action
                                        />
                                        {showItemAction === item.id && showItem && ( // Mengecek jika item yang dipilih dan action ditampilkan
                                        <div className="show-action-item" >
                                            <button className='action-edit'>
                                                <AiOutlineEdit className='action-ikon'/>
                                                <p>Rename item</p>
                                            </button>
                                            <button className='action-delete'
                                                onClick={()=> handleDeleteChecklistItem(item.id)}
                                            >
                                                <AiOutlineDelete  className='action-ikon'/>
                                                <p>Delete item</p>
                                            </button>
                                        </div>
                                        )}
                                        
                                    </div>
                                ))
                            ) : (
                                <p 
                                    style={{
                                        // border:'1px solid #eee',
                                        margin:'10px',
                                        color:'grey',
                                        fontSize:'10px'
                                    }}>
                                        No items yet.
                                </p>
                            )}

                            {/* Form menambahkan checklist item */}
                            <div className="add-item">
                                <AiOutlinePlus size={15} style={{margin:'0px 5px', color:'grey'}}/>
                                <input
                                    type="text"
                                    placeholder="Add new item..."
                                    value={newItemDescription}
                                    onChange={(e) => setNewItemDescription(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddChecklistItem(checklist.id);
                                        }
                                    }}                            
                                />
                                {/* <button onClick={() => handleAddChecklistItem(checklist.id)}>Add Item</button> */}
                            </div>

                        </div>
                    );
                })
            ) : (
                <p>No checklists available.</p>
            )}
        </div>
        )}
        </div>
    );
}

export default ChecklistTest

// import React, { useEffect, useState } from 'react'
// import '../style/ChecklistFitur.css';
// import { IoCheckmarkDoneCircle } from "react-icons/io5";
// import { RiCheckboxBlankCircleLine } from "react-icons/ri";
// import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
// import { PiDotsThreeBold } from "react-icons/pi";
// import { createChecklist, createChecklistItem, deleteChecklist, deleteChecklistItem, getChecklistItems, getChecklists, updateChecklistItem, updateChecklist  } from '../services/Api';


// const ChecklistTest=({cardId,checklistId,currentName})=> {
//     const [checklists, setChecklist] = useState([]);
//     const [newChecklistName, setNewChecklistName] = useState('');
//     const [newItemDescription, setNewItemDescription] = useState('');
//     const [showChecklistAction, setShowChecklistAction] = useState(false);
//     const [showChecklistId, setShowChecklistId] = useState(null);
//     const [showItemAction, setShowItemAction] = useState(null);
//     const [showItem, setShowItem] = useState(false);
//     const [showAllChecklist, setShowAllChecklist] = useState(false);
//     //Edit
//     const [name,setName] = useState(currentName);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleUpdate = async()=>{
//         setIsLoading(true);
//         try{
//             const updatedChecklist = await updateChecklist(checklistId, name);
//             console.log('Checklist updated:', updatedChecklist);
//         }catch(error){
//             console.error('Error updating checklist:', error);
//         }finally{
//             setIsLoading(false);
//         }
//     };


//     const showChecklistAll = () =>{
//         setShowAllChecklist(!showAllChecklist);
//     }

//     const showChecklistUsingId = (id) => {
//         if (showChecklistId === id) {
//             setShowChecklistAction(!showChecklistAction); // Toggle jika id yang sama diklik lagi
//         } else {
//             setShowChecklistId(id);  // Set id baru
//             setShowChecklistAction(true);  // Tampilkan action
//         }
//     };

//     // Fungsi untuk menampilkan dan menyembunyikan action
//     const showItemA = (id) => {
//         // Jika item yang sama diklik, toggle status showItem
//         if (showItemAction === id) {
//             setShowItem(!showItem);
//         } else {
//             setShowItemAction(id);
//             setShowItem(true); // Menampilkan action untuk item yang baru diklik
//         }
//     }

//     useEffect(()=>{
//         fetchChecklists();
//     },[cardId]);

//     const fetchChecklists = async () =>{
//         try{
//             const data = await getChecklists(cardId);

//             //fetch checklits items for each checklist
//             const checklistsWithItems = await Promise.all(
//                 data.map(async (checklist) => {
//                     const items = await getChecklistItems(checklist.id);
//                     return{...checklist, items};
//                 })
//             );
//             setChecklist(checklistsWithItems);
//         }catch(error){
//             console.error('Error loading checklist:', error);
//         }
//     };

//     //handle adding a new checklist
//     const handleAddChecklist = async () =>{
//         if(!newChecklistName) return alert('Checklist name cannot be empty');
//         try{
//             await createChecklist(cardId, newChecklistName);
//             setNewChecklistName('');
//             fetchChecklists();
//         }catch(error){
//             console.error('Error adding a new checklist', error);
//         }
//     };

//     const handleAddChecklistItem = async (checklistId) => {
//         if (!newItemDescription.trim()) {
//             alert('Checklist item description cannot be empty');
//             return;
//         }
//         try {
//             await createChecklistItem(checklistId, newItemDescription);
//             setNewItemDescription('');
//             fetchChecklists();
//         } catch (error) {
//             console.error('Error adding checklist item:', error);
//         }
//     };
    

//     //handle updating the checklist item status
//     const handleToggleItemStatus = async (itemId, currentStatus) =>{
//         try{
//             await updateChecklistItem(itemId, !currentStatus);
//             fetchChecklists();
//         }catch(error){
//             console.error('Error updating checklist item:', error)
//         }
//     };

//     const handleDeleteChecklist = async(checklistId) =>{
//         try{
//             await deleteChecklist(checklistId);
//             fetchChecklists();
//         }catch(error){
//             console.error('Error deleting checklist:', error);
//         }
//     };

//     //handle deleting a checklist item
//     const handleDeleteChecklistItem = async(itemId)=>{
//         try{
//             await deleteChecklistItem(itemId);
//             fetchChecklists();
//         }catch(error){
//             console.error('Error deleting checklist item:', error);
//         }
//     }

//     //calculate progress for progres bar
//     const calculateProgress = (items) => {
//         if (!items || !Array.isArray(items) || items.length === 0) return 0;
//         const completedItems = items.filter(item => item.is_checked).length;
//         return Math.round((completedItems / items.length) * 100);
//     };

//     return (
//         <div className='checklist-container'>        
//             {/* Form menambahkan checklist baru */}
//             <div className="checklist-title">
//                 <h4>Checklists</h4>
//                 <div className="input-checklist">
//                     <div className="form-create">
//                         <input
//                             type="text"
//                             placeholder="Add new checklist..."
//                             value={newChecklistName}
//                             onChange={(e) => setNewChecklistName(e.target.value)}
//                         />
//                         <button onClick={handleAddChecklist}> 
//                             <AiOutlinePlus className='add-btn'/>
//                             Checklist
//                         </button>
//                     </div>
//                     <div className="show">
//                         <button onClick={showChecklistAll}>
//                             {showAllChecklist ? 
//                             <>Hide Checklist <AiFillCaretUp size={15} style={{marginLeft:'4px'}}/>  </>
//                             :
//                             <>Show Checklist <AiFillCaretDown size={15} style={{marginLeft:'4px'}}/> </>
//                             }
//                             {showAllChecklist && (
//                              <div>


//                              </div> 
//                             )}
//                         </button>
//                     </div>
//                 </div>    
//             </div>

//             {/* Menampilkan semua checklist */}
//             {showAllChecklist && (
//             <div>
//             {checklists.length > 0 ? (
//                 checklists.map((checklist) => {
//                     const progress = calculateProgress(checklist.items);
//                     return (
//                         <div key={checklist.id} className='show-checklist'>
//                             <div className="show-title">
//                                 <h4>
//                                     {checklist.name}
//                                     <PiDotsThreeBold 
//                                         className='show-ikon'
//                                         onClick={() => showChecklistUsingId(checklist.id)}
//                                     />
//                                 </h4>

//                                 {showChecklistId === checklist.id && showChecklistAction && ( // Perbaikan disini
//                                     <div className="show-action">
//                                         <button className='action-edit'>
//                                             <AiOutlineEdit className='action-ikon'/>
//                                             <p>Rename checklist</p>
//                                         </button>
//                                         <button 
//                                             className='action-delete'
//                                             onClick={() => handleDeleteChecklist(checklist.id)}
//                                         >
//                                             <AiOutlineDelete className='action-ikon'/>
//                                             <p>Delete checklist</p>
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                             {/* <button onClick={() => handleDeleteChecklist(checklist.id)}>Delete Checklist</button> */}
                            
//                             {/* Progress Bar dengan Style yang Lebih Smooth */}
//                             <div className="progress-bar">
//                                 <div
//                                     style={{
//                                         width: `${progress}%`,
//                                         background: `linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)`,
//                                         height: '12px',
//                                         borderRadius: '12px',
//                                         transition: 'width 0.5s ease-in-out',
//                                         boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
//                                     }}
//                                 >
//                                 </div>
//                                 <p>{progress}% Completed</p>
//                             </div>

//                             {/* Menampilkan checklist items */}
//                             {checklist.items && checklist.items.length > 0 ? (
//                                 checklist.items.map((item) => (
//                                     <div key={item.id} className='show-item'>
//                                         {/* Menggunakan ikon sebagai pengganti checkbox */}
//                                         {item.is_checked ? (
//                                             <IoCheckmarkDoneCircle 
//                                                 size={24} 
//                                                 color="green" 
//                                                 onClick={() => handleToggleItemStatus(item.id, item.is_checked)} 
//                                                 style={{ cursor: 'pointer' }}
//                                             />
//                                         ) : (
//                                             <RiCheckboxBlankCircleLine 
//                                                 size={24} 
//                                                 color="#eee" 
//                                                 onClick={() => handleToggleItemStatus(item.id, item.is_checked)} 
//                                                 style={{ cursor: 'pointer' }}
//                                             />
//                                         )}

//                                         <p>{item.description}</p>
//                                         <PiDotsThreeBold 
//                                             className='show-ikon'
//                                             onClick={() => showItemA(item.id)} // Menjalankan fungsi untuk menampilkan action
//                                         />
//                                         {showItemAction === item.id && showItem && ( // Mengecek jika item yang dipilih dan action ditampilkan
//                                         <div className="show-action-item" >
//                                             <button className='action-edit'>
//                                                 <AiOutlineEdit className='action-ikon'/>
//                                                 <p>Rename item</p>
//                                             </button>
//                                             <button className='action-delete'
//                                                 onClick={()=> handleDeleteChecklistItem(item.id)}
//                                             >
//                                                 <AiOutlineDelete  className='action-ikon'/>
//                                                 <p>Delete item</p>
//                                             </button>
//                                         </div>
//                                         )}
                                        
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p 
//                                     style={{
//                                         // border:'1px solid #eee',
//                                         margin:'10px',
//                                         color:'grey',
//                                         fontSize:'10px'
//                                     }}>
//                                         No items yet.
//                                 </p>
//                             )}

//                             {/* Form menambahkan checklist item */}
//                             <div className="add-item">
//                                 <AiOutlinePlus size={15} style={{margin:'0px 5px', color:'grey'}}/>
//                                 <input
//                                     type="text"
//                                     placeholder="Add new item..."
//                                     value={newItemDescription}
//                                     onChange={(e) => setNewItemDescription(e.target.value)}
//                                     onKeyDown={(e) => {
//                                         if (e.key === 'Enter') {
//                                             handleAddChecklistItem(checklist.id);
//                                         }
//                                     }}                            
//                                 />
//                                 {/* <button onClick={() => handleAddChecklistItem(checklist.id)}>Add Item</button> */}
//                             </div>

//                         </div>
//                     );
//                 })
//             ) : (
//                 <p>No checklists available.</p>
//             )}
//         </div>
//         )}
//         </div>
//     );
// }

// export default ChecklistTest