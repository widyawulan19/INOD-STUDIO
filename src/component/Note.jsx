// // import React, { useCallback, useEffect, useState } from 'react'
// // import { getCards, createCard, deleteList, getLists, createList, archiveLists} from '../services/Api'
// // import { useNavigate, useParams } from 'react-router-dom';
// // import '../style/ListStyle.css'
// // import { BsThreeDots } from "react-icons/bs";
// // import { TfiCommentAlt } from "react-icons/tfi";
// // import { FaPlus} from "react-icons/fa";
// // import { GrAttachment } from "react-icons/gr";
// // import { ImCross } from "react-icons/im";
// // import { FaPlay } from "react-icons/fa6";
// // import { HiPlus,HiDotsVertical, HiArchive, HiChevronUp, HiChevronDown } from "react-icons/hi";
// // import { AiFillDelete } from "react-icons/ai";
// // import { Data_Cover } from '../data/DataCover.js';
// // import { AlertTitle } from '@mui/material';


// // const List=({listId, listName, onDelete })=> {
// //     const {workspaceId, boardId} = useParams();
// //     const navigate = useNavigate();
// //     const [cards, setCards] = useState([])
// //     const [newCard, setNewCard] = useState({title:'', description:'', position:0, cover_image_url:null})
// //     const [showForm, setShowForm] = useState(false);
// //     const [showAction, setShowAction] = useState(null);
// //     const [showCover, setShowCover] = useState(false);
// //     const [selectCover, setSelectCover] = useState(null);
// //     //DELETE 
// //     const [isPopupVisible, setIsPopupVisible] = useState(false)
// //     const [listToDelete, setListToDelete] = useState(null);
// //     const [alert, setAlert] = useState({show:false, message:'', severity:''})
// //     const [lists, setLists] = useState([]);
// //     //CREATE NEW LIST
// //     const [newListName, setNewListName] = useState('')
// //     const [isFormVisible, setIsFormVisible] = useState(false)
// //     //ARCHIVE
// //     const [isArchivePopupVisible, setIsArchivePopupVisible] = useState(false);
// //     const [listToArchive, setListToArchive] = useState(null);


// //     //FUNCION DELETE
// //     const handleDeleteClick = (listId) =>{
// //       setListToDelete(listId)
// //       setIsPopupVisible(true)
// //       console.log('tombol delete berhasil di klik')
// //     }

// //     const handleConfirmDelete = async()=>{
// //       if(listToDelete){
// //         const deleteResponse = await handleDelete(listToDelete);
// //         setIsPopupVisible(false);
// //         setListToDelete(null);
// //         if(deleteResponse){
// //           setAlert({show:true, message:'Successfully delete list', severity:'success'})
// //           setTimeout(()=>{
// //             setAlert({...alert, show:false})
// //           }, 5000)
// //         }else{
// //           setAlert({show:true, message:'Error to delete list', severity:'error'})
// //           setTimeout(()=>{
// //             setAlert({...alert, show:false})
// //           })
// //         }
// //       }
// //     }

// //     const handleCancleDelete = () =>{
// //      setIsPopupVisible(false)
// //      setListToDelete(null)
// //     }
    
// //     const handleDelete = async(id) =>{
// //       try{
// //         await deleteList(id);
// //         loadList();
// //         return true;
// //       }catch(error){
// //         console.error('Error deleting list:', error)
// //         return false;
// //       }
// //     }
// //     //END FUNCION DELETE

// //     //LOAD LIST
// //     const loadList = useCallback(async () => {
// //       try{
// //         const response = await getLists(boardId);
// //         console.log('Receive data:', response.data);

// //         //pastikan boardId dan board_id dalam data memiliki tipe data yang sama
// //         const filteredLists = response.data.filter(list => list.board_id == Number(boardId));
// //         setLists(filteredLists);
// //       }catch(error){
// //         console.error('Failed to load Lists', error);
// //       }
// //     }, [boardId]);

// //     useEffect(()=>{
// //       loadList();
// //     }, [loadList])

// //     //END LOAD LIST

// //     //CREATE LIST
// //     const handleCreateList = async(e) => {
// //       e.preventDefault();
// //       if(!newListName.trim()){
// //         alert('List name cannot be empty')
// //         return;
// //       }

// //       try{
// //         const newPosition = lists.length + 1;
// //         const newList = await createList({board_id: Number(boardId), name: newListName, position: newPosition})

// //         //update the state to include the new list
// //         setLists([...lists, newList.data]);
// //         setNewListName('');
// //         setIsFormVisible(false);
// //       }catch(error){
// //         console.error('Error creating list:', error);
// //         alert('Failerd to create lists')
// //       }
// //     }
// //     const handleButtonCancle = () =>{
// //       setNewListName('');
// //       setIsFormVisible(false)
// //     }
// //     //END CREATE LIST



// //     //ARCHIVE
// //     const handleConfirmArchive = async(id)=>{
// //       setIsArchivePopupVisible(false);
// //       try{
// //         await archiveLists(id);
// //         setAlert({show:true, message:'Lists has been successfully archived', severity:'success'})
// //         setTimeout(()=>{
// //           setAlert(prevState => ({...prevState, show:false}))
// //         }, 5000)
// //         loadList();
// //       }catch(error){
// //         setAlert({show:true, message:'Failed to archive  lists, please try again later', severity:'error'})
// //         setTimeout(()=>{
// //           setAlert(prevState => ({...prevState, show:false}))
// //         }, 5000)
// //       }
// //     };
// //     useEffect(()=>{
// //       loadList();
// //     })

// //     const handleArchive = () =>{
// //       setIsArchivePopupVisible(true)
// //     }
// //     const handleCancleArchive = () =>{
// //       setIsArchivePopupVisible(false)
// //     }

// //     //END ARCHIVE


// //     const toggleFormVisibility = () => {
// //       setShowForm(!showForm)
// //     }

// //     //cover
// //     const toggleCoverVisibility = ()=>{
// //       setShowCover(!showCover)
// //     }

// //     const handleCoverSelect = (cover) => {
// //       setSelectCover(cover.cover_image_url);//edit1
// //       setNewCard((prevCard) => ({
// //          ...prevCard,
// //           cover_image_url: cover.cover_image_url,//edit2
// //         }));
// //       setShowCover(false);
// //     }

// //     const toggleActionThreeDotList = (listId, event)=>{
// //       event.stopPropagation();
// //       setShowAction(showAction === listId ? null : listId)
// //       console.log('button pada list berhasil di klik')
// //     }

// //     const handleAction = (listId, action) => {
// //       console.log(`Action: ${action} for lists: ${listId}`)
// //       setShowAction(null);
// //     }

// //     const toggleActionCard = (cardId, event)=>{
// //       event.stopPropagation();
// //       setShowAction(showAction === cardId ? null : cardId)
// //       console.log('button berhasil di klik')
// //     }

// //     const handleActionCard = (cardId, action)=>{
// //       console.log(`Action: ${action} for cards: ${cardId}`)
// //       setShowAction(null)
// //     }

// //     const loadCards = async () => {
// //       console.log('Loading cards for listId:', listId);
// //       try {
// //           const response = await getCards(listId);
// //           console.log('Received cards data:', response.data);
// //           setCards(response.data.filter(card => card.list_id === Number(listId)));
// //       } catch (error) {
// //           console.error('Failed to load cards:', error);
// //       }
// //   };

// //   useEffect(() => {
// //     if (listId){
// //       loadCards();
// //     }
// //   }, [listId]);

// //       const handleCreateCard = async () => {
// //         try{
// //           await createCard({
// //             ...newCard,
// //             list_id:listId
// //           })
// //           loadCards();
// //           setShowForm(false);
// //           setNewCard({
// //             title:'',
// //             description:'',
// //             position:'',
// //             cover_image_url:''
// //           })
// //         }catch(error){
// //           console.error('Failed to create card', error)
// //         }
// //       }


// //       const handleToCardModal = (cardId, event) => {
// //         event.stopPropagation();
// //         console.log(`Navigating to card modal with ID: ${cardId}`)
// //         navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}/modal`)
// //       }
// //       const handleToCardDetail = (cardId) => {
// //         console.log(`Navigating to card detail with ID : ${cardId}`)
// //         navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}`);
// //       };


// //       return (
// //         <div className="board-view-container" >
// //           <div className="list-container" style={{display:'flex', alignItems:'center', justifyContent:'center', paddingLeft:'10px'}}>
// //             {lists.map((list)=>(
// //               <div>
// //                 <div className="list-wrapper" key={list.id} style={{marginRight:'5px'}}>
// //                   {/* <p>{list.id}</p>
// //                   <p>{list.name}</p> */}
// //                   <div className="list-container">
// //                     <div className="title">
// //                       <p style={{display:'flex', alignItems:'center'}}>
// //                         <FaPlay style={{marginRight:'8px', color:'#333'}}/>
// //                         {list.name}
// //                       </p>
// //                       <p>
// //                         <BsThreeDots
// //                           className='dot-btn'
// //                           onClick={(e) => toggleActionThreeDotList(listId ,e)}
// //                         />
// //                         {showAction === lists.id && (
// //                           <div className='dropdown-menu-action'>
// //                             <ul className='dropdown-ul'>
// //                               Action
// //                               <li className='dropdown-li'>
// //                                 <AiFillDelete className='ikon' size={20}/>
// //                                 <button className='btn-li' onClick={(e)=> {e.stopPropagation(); handleDeleteClick(list.id)}}>
// //                                   Delete <br />
// //                                   <span style={{fontSize:'10px', fontWeight:'normal'}}>Delete lists</span>
// //                                 </button>
// //                                 {isPopupVisible && (
// //                                   <div className='popup-overlay'>
// //                                     <div className='popup-content'>
// //                                       <h3>Konfirmasi penghapusan</h3>
// //                                       <p>Apakah anda yakin ingin menghapus list ini?</p>
// //                                       <button className='btn-confirm' onClick={(e)=> {e.stopPropagation(); handleConfirmDelete()}}>Ya, hapus</button>
// //                                       <button className='btn-confirm' onClick={(e)=> {e.stopPropagation(); handleCancleDelete()}}>Batal</button>
// //                                     </div>
// //                                   </div>
// //                                 )}
// //                               </li>
// //                               <li className='dropdown-li'>
// //                                 <HiArchive className='ikon' size={20}/>
// //                                 <button className='btn-li' onClick={(e) => {e.stopPropagation(); handleArchive(list.id)}}>
// //                                   Archive <br />
// //                                   <span style={{fontSize:'10px', fontWeight:'normal'}}>Archive your list</span>
// //                                 </button>
// //                                 {isArchivePopupVisible && (
// //                                   <div className='popup-overlay'>
// //                                     <div className='popup-content'>
// //                                       <p>Dengan memindahkan list kedalam archive, <br /> berarti menghapus list pada halaman ini <br />Apakah anda yakin? </p>
// //                                       <button className='btn-confirm' onClick={(e)=>{e.stopPropagation(); handleConfirmArchive(list.id)}}>Archive</button>
// //                                       <button className='btn-confirm' onClick={(e) => {e.stopPropagation(); handleCancleArchive()}}>Cancle</button>
// //                                     </div>
// //                                   </div>
// //                                 )}
// //                               </li>
// //                             </ul>
// //                           </div>
// //                         )}
// //                       </p>
// //                     </div>
// //                     {alert.show && (
// //                       <AlertTitle className='alert-position' severity={alert.severity}>
// //                         {alert.message}
// //                       </AlertTitle>
// //                     )}

// //                     <hr style={{opacity:'50%'}}/>
// //                     <div className='card-list-lists' style={{border:'1px solid red'}}>
// //                       {cards.map((card)=>(
// //                         <div  key={card.id} className='card-item-lists' onClick={()=> handleToCardDetail(card.id)}>
// //                           <div>
// //                             <p style={{display:'flex', justifyContent:'space-between', margin:'0'}}>
// //                               <strong>{card.title}</strong>
// //                               <HiDotsVertical
// //                                 className='dot-btn'
// //                                 onClick={(e)=> toggleActionCard(card.id, e)}
// //                               />
// //                               {showAction === card.id &&(
// //                                 <div className='card-dropdown-menu-action'>
// //                                   <div className='dropdown-ul'>
// //                                     Actions
// //                                     <li onClick={() => handleActionCard(card.id, 'delete')} className='dropdown-li'>
// //                                       <AiFillDelete className='ikon' size={15}/>
// //                                       <div style={{size:'10px'}}>
// //                                         Delete <br />
// //                                         <span style={{fontSize:'10px', fontWeight:'normal'}}>Delete this card</span>
// //                                       </div>
// //                                     </li>
// //                                     <li onClick={()=> handleActionCard(card.id, 'archive')} className='dropdown-li'>
// //                                       <HiArchive className='ikon' size={15}/>
// //                                       <div>
// //                                         Archive <br />
// //                                         <span style={{fontSize:'10px', fontWeight:'normal'}}>Archive this card</span>
// //                                       </div>
// //                                     </li>
// //                                   </div>
// //                                 </div>
// //                               )}
// //                             </p>
// //                           </div>
// //                           {cards.cover_image_url && (
// //                             <div className='cover'>
// //                               <img src={cards.cover_image_url} alt={cards.name} />
// //                             </div>
// //                           )}
// //                           <p className='card-description'>{cards.description}</p>

// //                           <div style={{display:'flex'}}>
// //                             <div className='label'>
// //                               <button className='label1'>Examp 1</button>
// //                               <button className='label1'>Examp 2</button>
// //                               <button className='label1'>Examp 3</button>
// //                             </div>
// //                             <div className='fiture'>
// //                               <div className='fiture1'>
// //                                 <TfiCommentAlt className='icon' size={13}/>
// //                                 <h6 style={{margin:'0'}}>12</h6>
// //                               </div>
// //                               <div className='fiture2'>
// //                                 <TfiCommentAlt className='icon' size={13}/>
// //                                 <h6 style={{margin:'0'}}>12</h6>
// //                               </div>
// //                             </div>
// //                           </div>
// //                           <div className='fiture-container'>
// //                             <div>
// //                               <button onClick={(event)=> handleToCardModal(card.id, event)} className='edit-btn'>
// //                                 Edit Card
// //                               </button>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>

// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
            
// //           </div>

// //           {/* Form input */}
// //           <button className='addButton' onClick={toggleFormVisibility}>
// //             {showForm ? 
// //               (<><ImCross style={{marginRight:'1vh'}}/>Cancle </>) : (<><FaPlus style={{marginRight:'1vh'}}/>Add Card</>)}
// //             </button>
// //               {showForm && (
// //                   <div className='card-form'>
// //                     <input
// //                       className='card-form-input'
// //                       type='text'
// //                       placeholder='Card Title'
// //                       value={newCard.title}
// //                       onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
// //                     />
// //                     <input
// //                       className='card-form-input'
// //                       type='text'
// //                       placeholder='Description'
// //                       value={newCard.description}
// //                       onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
// //                     />
// //                     <input
// //                       className='card-form-input'
// //                       type='text'
// //                       placeholder='Position'
// //                       value={newCard.position}
// //                       onChange={(e) => setNewCard({ ...newCard, position: e.target.value })}
// //                     />
// //                     <button className='btn' onClick={toggleCoverVisibility}>
// //                       {showCover ? 
// //                       (<>Select Cover <HiChevronUp/></>):(<>Select Cover <HiChevronDown/></>)  
// //                     }
// //                     </button>
// //                     {showCover && (
// //                       <div 
// //                       style={{
// //                           border:'0.1px solid grey',
// //                           borderRadius:'5px',
// //                           boxShadow:'0px 4px 8px rgba(0,0,0,0.1)',
// //                           padding:'5px',
// //                           width:'100px',
// //                           height:'130px',
// //                           overflowY:'auto'
// //                       }}>
// //                         {Data_Cover.map((cover)=>(
// //                           <div
// //                             className='coverImg'
// //                             key={cover.id}
// //                             onClick={()=> handleCoverSelect(cover)}
// //                             style={{marginBottom:'5px', cursor:'pointer'}}
// //                           >
// //                             <img src={cover.cover_image_url} alt={cover.name} />
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}
// //                     <button className='add-btn' onClick={handleCreateCard}>Add Card</button>
// //                 </div>
// //               )}
// //         </div>  
// //       );
// // }

// // export default List


// // const handleDelete = (listId) => {
// //     console.log("Deleting list with ID:", listId);
// //     deleteList(listId)
// //         .then(response => {
// //             console.log("Response:", response.data);
// //             loadLists(); // Memperbarui daftar setelah penghapusan
// //         })
// //         .catch(error => {
// //             console.error("Error deleting list:", error);
// //         });
// // };


// import React from 'react';
// import List from './List';
// import { deleteList } from '../services/Api';

// const BoardView = () => {
//   // Fungsi untuk menghapus list
//   const handleDeleteList = async (listId) => {
//     try {
//       await deleteList(listId); // Panggil API untuk menghapus list berdasarkan listId
//       // Lakukan reload data atau update state setelah penghapusan
//       loadLists(); // Panggil fungsi untuk memuat ulang daftar list
//     } catch (error) {
//       console.error('Failed to delete list:', error);
//       // Tangani error jika diperlukan
//     }
//   };

//   return (
//     <div>
//       {/* Mungkin Anda memiliki state untuk list yang harus Anda map */}
//       {lists.map((list) => (
//         <List
//           key={list.id}
//           listId={list.id}
//           listName={list.name}
//           loadLists={loadLists}
//           onDelete={() => handleDeleteList(list.id)} // Kirim fungsi penghapusan
//         />
//       ))}
//     </div>
//   );
// };

// export default BoardView;


// const handleConfirmDelete = async() => {
//     if(listToDelete) {
//       await onDelete(listToDelete); // Panggil fungsi penghapusan yang dikirim dari props
//       setIsPopupVisible(false);
//       setListToDelete(null);
//       setAlert({ show: true, message: 'Successfully deleted list', severity: 'success' });
//       setTimeout(() => {
//         setAlert({ ...alert, show: false });
//       }, 5000);
//     }
//   };
  
// const handleConfirmDelete = async()=>{
//     if(listToDelete){
//       await onDelete(listToDelete);
//       setIsPopupVisible(false);
//       setListToDelete(null);
//       const newAlert = { show: true, message: 'Successfully deleted list', severity: 'success' };
//       setAlert(newAlert);
//       console.log('Alert state before setTimeout:', alert); // Add this line to check the alert state
//       setTimeout(() => {
//         console.log('Alert state before hiding:', alert); // Add this line to check the alert state
//         setAlert({ ...alert, show: false });
//       }, 5000);
//     }
//   }


app.post('/api/lists/:id/duplicate-to-board', async (req, res) => {
    const { id } = req.params; // ID dari list yang ingin diduplikasi
    const { board_id } = req.body; // Board ID tujuan dari body request

    try {
        // Mulai transaksi
        await client.query('BEGIN');

        // 1. Mengambil data list asli berdasarkan ID
        const listQuery = 'SELECT * FROM lists WHERE id = $1';
        const listResult = await client.query(listQuery, [id]);

        // Periksa apakah list ditemukan
        if (listResult.rows.length === 0) {
            return res.status(404).send('List not found');
        }
        const originalList = listResult.rows[0];

        // 2. Buat duplikat list untuk board baru
        const newListQuery = `
            INSERT INTO lists (name, board_id, position) 
            VALUES ($1, $2, $3) RETURNING id
        `;
        const newListResult = await client.query(newListQuery, [
            originalList.name + ' (Copy)', // Nama list baru ditambah '(Copy)'
            board_id, // Masukkan board_id dari request body
            originalList.position // Posisi list di board baru
        ]);
        const newListId = newListResult.rows[0].id;

        // 3. Mengambil semua cards dari list asli
        const cardsQuery = 'SELECT * FROM cards WHERE list_id = $1';
        const cardsResult = await client.query(cardsQuery, [id]);

        // 4. Duplikat setiap card dari list asli ke list baru
        for (const card of cardsResult.rows) {
            const newCardQuery = `
                INSERT INTO cards (list_id, title, description, position, cover_id) 
                VALUES ($1, $2, $3, $4, $5)
            `;
            await client.query(newCardQuery, [
                newListId, // Pastikan ini adalah list_id baru dari list yang diduplikasi
                card.title,
                card.description,
                card.position,
                card.cover_id // Jika ada cover_id, duplikasikan juga
            ]);
        }

        // Commit transaksi setelah semua berhasil
        await client.query('COMMIT');
        res.status(201).send({ newListId, message: 'List duplicated to board successfully' });
    } catch (error) {
        // Rollback transaksi jika ada kesalahan
        await client.query('ROLLBACK');
        console.error('Error duplicating list to board:', error);
        res.status(500).send('Error duplicating list to board');
    }
});


app.post('/api/lists/:listId/duplicate-to-board', async (req, res) => {
    const { listId } = req.params;
    const { board_id } = req.body;

    try {
        await client.query('BEGIN');

        // Ambil data list asli
        const listsQuery = 'SELECT * FROM lists WHERE id = $1';
        const listsResult = await client.query(listsQuery, [listId]);

        if (listsResult.rows.length === 0) {
            return res.status(404).send('List not found');
        }

        const originalList = listsResult.rows[0];

        // Duplikat list ke board yang dituju
        const newListQuery = `
            INSERT INTO lists (name, board_id, position) 
            VALUES ($1, $2, $3) RETURNING id
        `;
        const newListResult = await client.query(newListQuery, [
            originalList.name + ' (Copy)',
            board_id,  // Board ID tujuan
            originalList.position
        ]);
        const newListId = newListResult.rows[0].id;

        // Ambil cards dari list asli
        const cardsQuery = 'SELECT * FROM cards WHERE list_id = $1';
        const cardsResult = await client.query(cardsQuery, [listId]);

        // Duplikat setiap card ke list yang baru
        for (const card of cardsResult.rows) {
            const newCardQuery = `
                INSERT INTO cards (list_id, title, description, position, cover_id)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await client.query(newCardQuery, [
                newListId, // ID list baru
                card.title,
                card.description,
                card.position,
                card.cover_id
            ]);
        }

        await client.query('COMMIT');
        res.status(201).send({ newListId, message: 'List duplicated to board successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error duplicating list to board:', error);
        res.status(500).send('Error duplicating list to board');
    }
});

export const duplicateList = async (listId, { workspace_id }) => {
    try {
      const response = await axios.post(`${API_URL}/lists/${listId}/duplicate`, {
        workspace_id,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to duplicate list:', error);
      throw error;
    }
  }

  const handleArchiveList = (listId) => {
    console.log('Archiving list with ID:', listId); // Logging to check ID
    archiveLists(listId)
        .then(response => {
            console.log(response); // Handle success
        })
        .catch(error => {
            console.error('Error:', error); // Handle error
        });
};

import React from 'react';
import { archiveLists } from '../api'; // Pastikan ini sesuai dengan lokasi file API Anda

const List = ({ listId, listName }) => {

    // Fungsi untuk menangani pengarsipan list
    const handleArchiveList = async () => {
        console.log('Archiving list with ID:', listId); // Logging untuk memverifikasi ID
        try {
            const response = await archiveLists(listId); // Panggil API untuk mengarsipkan list
            console.log(response); // Tampilkan respons dari server
            // Tambahkan logika untuk memperbarui UI setelah berhasil mengarsipkan list
        } catch (error) {
            console.error('Error while archiving list:', error); // Menangani error
        }
    };

    return (
        <div className="list">
            <h3>{listName}</h3>
            <button onClick={handleArchiveList}>Archive List</button>
        </div>
    );
};

export default List;


// .dropdown-menu-action {
//     position: absolute; /* Adjust as needed */
//     background-color: white; /* Set a background color */
//     border: 1px solid #ddd; /* Border styling */
//     width: 200px; /* Set a fixed width if necessary */
//     z-index: 1000; /* Ensure it appears above other elements */
//     max-height: none; /* Remove max height restriction */
//     overflow: visible; /* Allow all content to be visible */
//     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */
//     /* Add padding and border radius for styling */
//     padding: 10px;
//     border-radius: 4px;
//   }
  
//   .dropdown-ul {
//     list-style: none; /* Remove default list styles */
//     padding: 0; /* Remove padding */
//     margin: 0; /* Remove margin */
//   }
  
