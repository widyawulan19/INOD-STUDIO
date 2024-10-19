// {/* <li className='dropdown-li'>
//                       <HiArchive className='ikon' size={20}/>
//                       <button className='btn-li' onClick={(e)=> {e.stopPropagation(); handleArchive(listId)}}>
//                         Archive <br />
//                         <span style={{fontSize:'10px', fontWeight:'normal'}}>Archive your list</span>
//                       </button>
//                       {isArchivePopupVisible && (
//                         <div className='popup-overlay'>
//                           <div className='popup-content'>
//                           <p>Dengan memindahkan list kedalam archive,<br /> berarti menghapus list pada halaman ini <br /> Apa anda yakin ?</p>
//                             <button className='btn-confirm' onClick={(e) => {e.stopPropagation(); handleConfirmArchive()}}>Archive</button>
//                             <button className='btn-confirm' onClick={(e) => {e.stopPropagation(); handleCancleArchive()}}>Cancle</button>
//                           </div>
//                         </div>
//                       )}
//                     </li> */}


//                     const express = require('express');
//                     const fs = require('fs');
//                     const path = require('path');
//                     const client = require('./db'); // Koneksi ke PostgreSQL
//                     const app = express();
                    
//                     // Endpoint untuk mendapatkan board berdasarkan ID dan menggabungkannya dengan background dari JSON
//                     app.get('/api/boards/:id', async (req, res) => {
//                         const { id } = req.params;
                    
//                         try {
//                             // Query untuk mendapatkan board dari database tanpa meng-join tabel image
//                             const boardResult = await client.query(`
//                                 SELECT *
//                                 FROM boards
//                                 WHERE id = $1
//                             `, [id]);
                    
//                             if (boardResult.rows.length === 0) {
//                                 return res.status(404).send('Board tidak ditemukan!');
//                             }
                    
//                             const board = boardResult.rows[0];
                    
//                             // Membaca file JSON untuk mendapatkan data background image
//                             fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
//                                 if (err) {
//                                     return res.status(500).json({ error: 'Gagal membaca file JSON' });
//                                 }
                    
//                                 const images = JSON.parse(data).images;
                    
//                                 // Cari gambar berdasarkan background_image_id dari board
//                                 const image = images.find(img => img.id === board.background_image_id);
                    
//                                 if (image) {
//                                     // Gabungkan data board dengan URL background image
//                                     const boardWithImage = {
//                                         ...board,
//                                         image_url: image.image_url
//                                     };
                    
//                                     res.json(boardWithImage);
//                                 } else {
//                                     res.status(404).json({ error: 'Gambar tidak ditemukan!' });
//                                 }
//                             });
//                         } catch (err) {
//                             console.error('Error executing query:', err.stack);
//                             res.status(500).send('Server Error');
//                         }
//                     });
                    
//                     // Menyajikan gambar dari folder 'images'
//                     app.use('/images', express.static(path.join(__dirname, 'images')));
                    
//                     // Jalankan server
//                     const PORT = process.env.PORT || 5000;
//                     app.listen(PORT, () => {
//                         console.log(`Server is running on port ${PORT}`);
//                     });
                    

//                     import React, { useState } from 'react';
// import '../style/WorkspaceEdit.css';
// import { updateList } from '../services/Api';

// const EditList = ({ list, onClose, onSave }) => {
//     const [editList, setEditList] = useState({
//         name: list.name || '',
//         position: list.position || '',
//     });

//     const stopPropagation = (e) => {
//         e.stopPropagation();
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEditList((prev) => ({
//             ...prev,
//             [name]: name === 'position' ? parseInt(value) : value, // pastikan position sebagai integer
//         }));
//     };

//     const handleSave = async () => {
//         if (!editList.name || !editList.position) {
//             console.error('Name and position are required.');
//             return;
//         }

//         try {
//             console.log('Sending data to update:', editList); // Debug log
//             await updateList(list.id, editList);
//             onSave();
//             onClose();
//         } catch (error) {
//             console.error('Error updating list:', error.response ? error.response.data : error.message);
//         }
//     };

//     return (
//         <div className="edit-popup-overlay" onClick={stopPropagation} style={{ margin: '0' }}>
//             <div className="edit-popup-content">
//                 <h2>Edit List</h2>
//                 <div className="input-name">
//                     <input 
//                         type="text" 
//                         name="name"
//                         value={editList.name}
//                         onChange={handleChange}
//                         placeholder="List Name"
//                         onClick={stopPropagation}
//                     />
//                 </div>
//                 <div className="input-desc">
//                     <input
//                         type="number"  // mengubah menjadi input number untuk posisi
//                         name="position"
//                         value={editList.position}
//                         onChange={handleChange}
//                         placeholder="List Position"
//                         onClick={stopPropagation}
//                     />
//                 </div>
//                 <div className="modal-actions">
//                     <button className="save-btn" onClick={handleSave}>Save</button>
//                     <button className="cancel-btn" onClick={onClose}>Cancel</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditList;

// app.put('/api/lists/:id', async(req, res) => {
//     const { id } = req.params;
//     const { name, position } = req.body;

//     console.log('Received name:', name);  // Debugging log
//     console.log('Received position:', position);  // Debugging log

//     if (!id || isNaN(id)) {
//         return res.status(400).send('Invalid id format');
//     }
//     if (!name || !position) {
//         return res.status(400).json({ error: 'Name and position are required' });
//     }

//     // Proses update selanjutnya
// });


// app.put('/api/lists/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, position } = req.body;

//     // Validasi format id
//     if (!id || isNaN(id)) {
//         return res.status(400).send('Invalid id format');
//     }

//     // Validasi input name (nama harus ada)
//     if (!name) {
//         return res.status(400).json({ error: 'Name is required' });
//     }

//     try {
//         // Cek keberadaan list berdasarkan id
//         const checkResult = await client.query('SELECT * FROM lists WHERE id = $1', [id]);

//         if (checkResult.rowCount === 0) {
//             return res.status(404).json({ error: 'List not found' });
//         }

//         // Query untuk update, jika position ada, maka ikut di-update
//         let updateQuery, updateValues;
//         if (position !== undefined) {
//             // Jika position ada, update name dan position
//             updateQuery = 'UPDATE lists SET name = $1, position = $2 WHERE id = $3 RETURNING *';
//             updateValues = [name, position, id];
//         } else {
//             // Jika hanya name yang di-update
//             updateQuery = 'UPDATE lists SET name = $1 WHERE id = $2 RETURNING *';
//             updateValues = [name, id];
//         }

//         const result = await client.query(updateQuery, updateValues);

//         // Mengembalikan data yang telah di-update
//         res.status(200).json(result.rows[0]);
//     } catch (err) {
//         console.error('Error updating list:', err.stack);
//         res.status(500).send('Server Error');
//     }
// });


// const handleSave = async () => {
//     const updatedData = { name: editList.name }; // Hanya mengirim name

//     try {
//         await updateList(list.id, updatedData);  // Kirim request update tanpa position
//         onSave();
//         onClose();
//     } catch (error) {
//         console.error('Error updating list:', error);
//     }
// };


// import React, { useState } from 'react';
// import '../style/WorkspaceEdit.css';
// import { updateList } from '../services/Api';

// const EditList = ({ list, onClose, onSave }) => {
//     // State untuk menyimpan nama list yang diedit
//     const [editList, setEditList] = useState({
//         name: list.name || '',
//     });

//     const stopPropagation = (e) => {
//         e.stopPropagation();
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEditList((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSave = async () => {
//         try {
//             // Hanya mengirimkan nama list yang diupdate
//             const updateData = { name: editList.name };
//             await updateList(list.id, updateData);  // Pemanggilan API hanya dengan nama
//             onSave();  // Callback setelah sukses menyimpan
//             onClose(); // Tutup modal setelah menyimpan
//         } catch (error) {
//             console.error('Error updating list:', error);
//         }
//     };

//     return (
//         <div className="edit-popup-overlay" onClick={stopPropagation} style={{ margin: '0' }}>
//             <div className="edit-popup-content">
//                 <h2>Edit List</h2>
//                 <div className="input-name">
//                     <input 
//                         type="text" 
//                         name='name' 
//                         value={editList.name} 
//                         onChange={handleChange} 
//                         placeholder='List Name' 
//                         onClick={stopPropagation} 
//                     />
//                 </div>
//                 <div className="modal-actions">
//                     <button className='save-btn' onClick={handleSave}>Save</button>
//                     <button className='cancle-btn' onClick={onClose}>Cancel</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditList;

import React, { useState } from 'react';
import { updateCard } from '../services/Api';
import '../style/WorkspaceEdit.css';

const EditCard = ({ cardId, card, onClose, onSave }) => {
  const [cardEdit, setCardEdit] = useState({
    title: card.title || '',
    description: card.description || '',
  });

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData = { title: cardEdit.title, description: cardEdit.description };
      console.log('Update data:', updateData);
      await updateCard(cardId, updateData); // Mengirim updateData, bukan cardEdit
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating card', error);
    }
  };

  return (
    <div className='edit-popup-overlay' onClick={stopPropagation} style={{ margin: '0' }}>
      <div className='edit-popup-content' onClick={stopPropagation}>
        <h2>Edit Card</h2>
        <div className='input-name'>
          <input 
            type='text'
            name='title'
            value={cardEdit.title} // Gunakan cardEdit.title, bukan cardEdit.name
            onChange={handleChange}
            placeholder='Card title'
            onClick={stopPropagation}
          />
        </div>
        <div className='input-desc'>
          <textarea  
            name='description' 
            value={cardEdit.description}
            onChange={handleChange}
            placeholder='Card description'
            onClick={stopPropagation}
          />
        </div>
        <div className='modal-actions'>
          <button className='save-btn' onClick={handleSave}>Save</button>
          <button className='cancle-btn' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditCard;
