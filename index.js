const express = require('express');
const cors = require('cors');
const fs = require('fs');
const authenticateToken = require('./backend/authMiddleware');
const authRouter = require('./backend/authController');
const app = express(); 
const port = 3002;
const client = require('../master-back/backend/connection')
const bodyParser = require('body-parser');
const path = require('path');
const { error } = require('console');
const multer = require('multer');
const upload = require('./multerStorage');
const {getRandomColor} = require('./RandomColor')
const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
// const io = socketIo(server, { cors: { origin: '*' } });
const io = socketIo(server, { 
    cors: { 
      origin: 'http://localhost:3000',  // Sesuaikan dengan URL frontend React
      methods: ["GET", "POST"] 
    }
  });
  


// const {Data_Cover} = require('./frontend/src/data/DataCover.cjs')

app.use(express.json())

// Middleware
app.use(express.json()); // Untuk parsing application/json
app.use(express.urlencoded({ extended: true })); // Untuk parsing application/x-www-form-urlencoded
app.use(cors({
    origin: 'http://localhost:3000'
}));

//autentication route menggunakan import authRouter
app.use('/api/auth', authRouter)

//middleware untuk router yang dilindungi
app.use('/api/protected-router', authenticateToken, (req, res) => {
    res.send('This is a protected router');
});

app.use(bodyParser.json())


// Rute dasar
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


//ENDPOIN FILE UPLOAD
app.post('/app/upload/:cardId', upload.single('file'), async(req, res)=>{
    const {cardId} = req.params;
    const {file} = req.file;

    if (!file){
        return res.status(400).json({error:'No file uploaded'});
    }

    const fileUrl = `/uploads/${file.filename}`;
    const fileName = file.originalname;

    try{
        const result = await pool.query(
            `INSERT INTO card_files (card_id, file_name, file_url) VALUES ($1, $2, $3) RETURNING *`,
            [cardId, fileName, fileUrl]
        );
        res.status(201).json(result.rows[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({error:'File upload failed'});
    }
})



//API COVER 
// app.get('/api/cover/', async(req,res)=>{
//     res.json(Data_Cover);
// })

//API END POIN USERS -> bisa
//1. Mengambil semua data users
app.get('/api/users/', async(req, res) => {
    try{
        const result = await client.query('SELECT * FROM users');
        res.json(result.rows);
    } catch(err){
        console.log('Error executing query', err.stack);
        res.status(500).send('Server Error');
    }
})


//2.Menambah user baru -> bisa
app.post('/api/users/', async(req,res)=> {
    const {username, email, password} = req.body;
    //validasi inputan 
    if (!username || !email || !password ){
        return res.status(400).send('Data tidak boleh kosong!');
    }
    try{
        //cek apakah ada nama pengguna yang sama/ sudah ada
        const existingUsername = await client.query(
            "SELECT * FROM users WHERE username = $1", [username]
        )
        if (existingUsername.rows.length > 0){
            return res.status(400).send('Username already exists!');
        }
        //menjalankan query untuk menambahkan pengguna baru
        await client.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password || null]
        );
        res.status(201).send('User Added!')
    }catch (err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error');
    }
})

//3. Mendapatkan/menampilkan detail pengguna berdasarkan ID -> bisa
app.get('/api/users/:id', async(req, res)=>{
    const {id} = req.params;

    try{
        const result = await client.query(
            'SELECT * FROM users WHERE id = $1', [id]
        );
        //check data apakah username ada pada tabel
        if(result.rows.length == 0){
            return res.status(404).send('Username tidak ditemukan!');
        }
        res.json(result.rows);
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error')
    }
})

//4. Update data users -> bisa
app.put('/api/users/:id', async (req, res) => {
    const {id} = req.params;
    const {username, email, password} = req.body;

    try{
        const result = await client.query(
            `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4`, [username, email, password, id]
        );
    } catch(err) {
        console.error('Error updating data user!', err.stack);
        res.status(500).send('Server Error');
    }
})

//5. Delete User  -> bisa
app.delete('/api/users/:id', async(req, res)=>{
    const{id} = req.params;
    console.log('Deleting users data with id', id)

    try{
        const result = await client.query('DELETE FROM users WHERE id = $1', [id])

        if(result.rowCount > 0){
            res.status(200).send(`User dengan id ${id} berhasil dihapus`);
        }else{
            res.status(400).send(`User dengan id ${id} tidak ditemukan.`)
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error to Delete User data!')
    }
})

//6. mencari semua pengguna
app.get('/api/users', async(req,res)=>{
    const {query} = req.query;

    console.log("received query:", query);

    try{
        let result;
        if(query){
            result = await client.query(
                'SELECT id, username FROM users WHERE username ILIKE $1 LIMIT 10',
                [`%${query}%`]
            );
        }else{
            result = await client.query('SELECT id, username FROM users LIMIT 100');
        }
        res.json(result.rows);
    }catch(error){
        console.error('Error fetching users', error);
        res.status(500).send('Error fetching users');
    }
})



//API END POIN WORKSPACE
//1. mengambil semua data workspaces-> bisa
app.get('/api/workspaces/', async(req, res) =>{
    try{
        const result = await client.query('SELECT * FROM workspaces');
        res.json(result.rows);
    }catch(err){
        console.error('Error executing query', err.stack);
        res.status(500).send('Server Error');
    }
})

//2. Membuat workspace baru  -> bisa
app.post('/api/workspaces/', async(req, res) => {
    const { name, description} = req.body;
    //validasi input
    if (!name || !description ){
        return res.status(400).send('data tidak boleh ada yang kosong');
    }
    try{
        //cek apakah nama workspace sudah ada 
        const existingWorkspace = await client.query(
           " SELECT * FROM workspaces WHERE name = $1", [name]
        )
        if (existingWorkspace.rows.length > 0) {
            return res.status(400).send('Workspace name already exists');
            }
        //menjalankan query untuk memasukkan data ke tabel cards
        await client.query(
            'INSERT INTO workspaces (name, description) VALUES ($1, $2)',
            [name, description|| null]
          );
        res.status(200).send('Workspace Added!')
    } catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error');
    }
})

//3. Get Workspaces by ID -> bisa
app.get('/api/workspaces/:id', async(req, res) => {
    const {id} = req.params;
    
    try{
        const result = await client.query(
            'SELECT * FROM workspaces WHERE id = $1',[id]
        );
        //check data
        if(result.rows.length === 0){
            //jika tidak ada data yang ditemukan
            return res.status(404).send('Workspaces tidak ditemukan');
        }
        res.json(result.rows);
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error')
    }
})

//4. Update workspace -> bisa
app.put('/api/workspaces/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    // Validasi format id
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id format' });
    }
  
    // Validasi req.body
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }
  
    try {
      // Cek keberadaan workspace
      const checkResult = await client.query(
        `SELECT * FROM workspaces WHERE id = $1`,
        [id]
      );
  
      if (checkResult.rowCount === 0) {
        return res.status(404).json({ error: 'Workspace not found' });
      }
  
      // Melakukan update
      const result = await client.query(
        `UPDATE workspaces SET name = $1, description = $2 WHERE id = $3`,
        [name, description, id]
      );
  
      // Mengembalikan data yang telah diupdate
      res.status(200).json({ message: 'Workspace updated successfully' });
    } catch (err) {
      console.error('Error updating workspaces!', err.stack);
      res.status(500).json({ error: 'Server Error', message: err.message });
    }
  });
// app.put('/api/workspaces/:id', async(req, res)=> {
//     const {id} = req.params;
//     const { name, description} = req.body;

//     try{
//         const result = await client.query(
//             `UPDATE workspaces SET name = $1, description = $2 WHERE id = $3`, 
//             [name, description, id]
//         );

//         //memeriksa apakah ada data yang ter-update
//         if(result.rowCount === 0){
//             return res.status(404).json({error:'Workspace not found'})
//         }

//         //mengembalikan data yang telah diupdate
//         res.status(200).json(result.rows[0]);

//         res.status(200).send('Workspaces updated successfully');
//     } catch(err){
//         console.error('Error updating workspaces!', err.stack);
//         res.status(500).send('Server Error');
//     }
// })

// app.put('/api/workspaces/:id', async(req,res)=>{
//     const {id} = req.params;
//     const {name, description} = req.body;

//     //validasi id
//     if(!id || isNaN(id)){
//         return res.status(400).send('Invalid id');
//     }

//     //validasi data yang dikirim
//     if(!name || !description){
//         return res.status(400).send('Name and description are required');
//     }
//     try{
//         const result = await client.query(
//             `UPDATE workspaces SET name = $1, description = $2 WHERE id = $3`, 
//           [name, description, id]
//         );
//         res.status(200).send('Workspace update successfully');
//     }catch(error){
//         console.error('Error updating workspace:', error.stack);
//         res.status(500).send('Server Error');
//     }
// })

//5. Delete workspace by ID -> bisa
app.delete('/api/workspaces/:id', async(req, res) => {
    const{id} = req.params;
    console.log('Deleting workspace with ID', id)
    try{
        // await client.query('DELETE FROM workspace WHERE id = $1', [id]);
        const result = await client.query('DELETE FROM workspaces WHERE id = $1', [id]);

        // console.log('Deleting workspaces with id: ', id);
        // console.log('Result of deletion:', result.rowCount); 

        if (result.rowCount > 0){
            res.status(200).send(`Workspace dengan id ${id} berhasil dihapus `);
        }else{
            res.status(400).send(`Workspace dengan id ${id} tidak ditemukan.`)
        }
    } catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error to Delete workspace!')
    }
})

//6. update background workspace
app.put('/api/workspace/:id/background', async (req,res)=>{
    const {id} = req.params;
    const {bg_image} = req.body;

    try{
        await client.query('UPDATE workspaces SET bg_image = $1 WHERE id = $2', [bg_image, id]);
        res.status(200).json({message: 'Background updated successfully'});
    }catch(error){
        res.status(500).json({error:'failed to update background'})
    }
})

//7. archive data workspace 
app.post('/api/workspace/archive/:id', async(req,res)=>{
    const {id} = req.params;
    console.log('Archive workspace with Id', id);
    try{
        const result = await client.query(`
            INSERT INTO archive (entity_type, entity_id, name, description)
            SELECT 'workspace', id, name, description 
            FROM workspaces
            WHERE id = $1
            `, [id]);
        if (result.rowCount > 0){
            await client.query('DELETE FROM workspaces WHERE id = $1', [id])//menambahkan logika hapus ketika workspace berhasil diarsipkan
            res.status(200).send(`Workspace dengan id ${id} berhasil diarsipkan`);
        }else{
            res.status(404).send(`Workspace dengan id ${id} tidak ditemukan.`)
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error saat mengarsipkan workspace!')
    }
})

//ARCHIVE ENDPOIN
//1. get all workspace archive
app.get('/api/workspace/archives', async(req,res)=>{
    try{
        const result = await client.query('SELECT * FROM archive WHERE entity_type = $1', ['workspace']);

        if(result.rows.length > 0){
            res.status(200).json(result.rows);
        }else{
            res.status(404).send('Tidak ada data workspace yang ditemukan');
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error saat mengambil data dari database!')
    }
})

//2. get all board archive 
app.get('/api/board/archives', async(req,res)=>{
    try{
        const result = await client.query('SELECT * FROM archive WHERE entity_type = $1', ['board']);
        
        if(result.rows.length > 0){
            res.status(200).json(result.rows);
        }else{
            res.status(404).send('Tidak ada data board yang ditemukan');
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error saat mengambil data dari database!')
    }
})
//3. get all list archive
app.get('/api/list/archives', async(req,res)=>{
    try{
        const result = await client.query('SELECT * FROM archive WHERE entity_type = $1', ['list']);
        if(result.rows.length > 0){
            res.status(200).json(result.rows);
        }else{
            res.status(404).send('Tidak ada data list yang ditemukan');
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error saat mengambil data dari database!')
    }
})

//4. get all card archive
app.get('/api/card/archives', async(req,res)=>{
    try{
        const result = await client.query('SELECT * FROM archive WHERE entity_type = $1', ['card']);
        if(result.rows.length > 0){
            res.status(200).json(result.rows);
        }else{
            res.status(404).send('Tidak ada data card yang ditemukan');
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error saat mengambil data dari database!')
    }
})

//5. get all card marketing
app.get('/api/marketing/archive', async(req,res)=>{
    try{
        const result = await client.query('SELECT * FROM archive WHERE entity_type = $1', ['marketing']);
        if(result.rows.length > 0){
            res.status(200).json(result.rows);
        }else{
            res.status(404).send('Tidak ada data marketing yang ditemukan');
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server error saat mengambil data dari database!')
    }
})

//API END POIN BOARD
//1. Mengambil semua data board -> bisa
// app.get('/api/boards', async(req, res) => {
//     try{
//         const result = await client.query('SELECT * FROM boards');
//         res.json(result.rows);
//     }catch(err){
//         console.log('Error executing query', err.stack);
//         res.status(500).send('Server Error')
//     }
// }) 
app.get('/api/boards', async(req,res)=>{
    const {workspace_id} = req.query;

    //validasi inputan
    if(!workspace_id){
        return res.status(400).json({error:'workspace_id is required'});
    }
    try{
        const boardQuery = `
            SELECT 
                boards.id,
                boards.name,
                boards.description,
                boards.create_at,
                boards.background_image_id,
                boards.workspace_id,
                COALESCE(
                json_agg(
                    json_build_object('id', users.id, 'username', users.username)
                ) FILTER (WHERE users.id IS NOT NULL),
                '[]'
                ) AS users
            FROM boards
            LEFT JOIN users ON users.id = ANY(boards.assign::int[])
            WHERE boards.workspace_id = $1
            GROUP BY boards.id;
        `;

        const result = await client.query(boardQuery, [workspace_id]);
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Error fetching boards:', error);
        res.status(500).json({error:'Internal server error'});
    }
})


//2.Menambahkan Boards baru -> bisa
//Sebelum menambahkan boards secara manual, cek workspace_id dan users_id
app.post('/api/boards/', async(req, res) => {
    const { name, description, user_id, workspace_id } = req.body;

    try{
        //validasi adanya workspace id dan user id
        const userExists = await client.query ('SELECT id FROM users WHERE id = $1', [user_id]);
        const workspaceExists = await client.query('SELECT id FROM workspaces WHERE id = $1', [workspace_id]);

        if (userExists.rowCount === 0) {
            return res.status(400).json({ error: 'Invalid user_id' });
        }

        if (workspaceExists.rowCount === 0) {
            return res.status(400).json({ error: 'Invalid workspace_id' });
        }

        //menjalankan query untuk menambahkan boards
        const newBoard = await client.query(
            'INSERT INTO boards (user_id, workspace_id, name, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, workspace_id, name, description]
        );

        res.status(200).json(newBoard.rows[0]);
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error');
    }
})

//3. mendapatkan/menampilkan board berdasarkan ID -> bisa
app.get('/api/boards/:id', async(req, res)=>{
    const {id} = req.params;

    try{
        const boardResult = await client.query(`
            SELECT * FROM boards WHERE id = $1`,[id]);

            if (boardResult.rows.length === 0){
                return res.status(404).send('Board tidak ditemukan!');
            }
            const board = boardResult.rows[0];

            //membaca file JSON
            fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data)=> {
                if(err){
                    return res.status(500).json({error: 'Gagal membaca file JSON'});
                }
                const images = JSON.parse(data).images;

                //cari gambar berdasarkan background
                const image = images.find(img => img.id === board.background_image_id);

                if(image){
                    const boardWithImage = {
                        ...board,
                        image_url: image.image_url
                    };

                    res.json(boardWithImage);
                }else{
                    res.status(404).json({error: 'Gambar tidak ditemukan!'})
                }
            });
    }catch(err){
        console.error('Error executing query:', err.stack)
        res.status(500).send('Server error');
    }
})

//update data boards berdasarkan id
app.put('/api/boards/:id', async(req,res)=>{
    const {id} = req.params;
    const {name, description} = req.body;

    //validasi format id
    if(!id || isNaN(id)){
        return res.status(400).send('Invalid id format');
    }

    //validasi req.body
    if(!name || !description){
        return res.status(400).json({error:'Name and description are required'});
    }
    try{
        //Cek keberadaan workspace
        const checkResult = await client.query(
            `SELECT * FROM boards WHERE id = $1`,
            [id]
        );

        if(checkResult.rowCount === 0){
            return res.status(404).json({error:'Board not found'});
        }

        //melakukan update
        const result = await client.query(
            `UPDATE boards SET name = $1, description = $2 WHERE id = $3`,
            [name, description, id]
        );

        //mengembalikan data yang telah diupdate
        res.status(200).json({message:'Workspace update successfully'})
    }catch(error){
        console.err('Error updating workspaces!', error.stack);
        res.status(500).send('Server Error');
    }

    // try{
    //     const result = await client.query(
    //         `UPDATE boards SET name = $1, description = $2, create_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
    //         [name, description, id]
    //     ); 

    //     // Periksa apakah ada data yang di-update
    //     if (result.rowCount === 0) {
    //         return res.status(404).json({ error: 'Board not found' });
    //     }

    //     // Kembalikan data yang telah di-update
    //     res.status(200).json(result.rows[0]);
    // }catch(err){
    //     console.error('Error updating boards', err.stack);
    //     res.status(500).send('Server Error');
    // }
})

//5. Delete boards by id -> bisa
app.delete('/api/boards/:id', async(req, res) =>{
    const {id} = req.params;
    console.log('Deleting boards by ID', id);

    try{
        const result = await client.query(`DELETE FROM boards WHERE id = $1`, [id])

        if(result.rowCount > 0){
            res.status(200).send(`Board dengan id ${id} berhasil dihapus`);
        }else{
            res.status(404).send(`Board dengan id ${id} tidak berhasil dihapus`);
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error to Delete User Data!')
    }
})

//6. Get Board count by workspace
app.get('/api/board-count/', async(req, res) => {
    const {workspace_id} = req.query;
    try{
        const result = await client.query('SELECT COUNT(*) FROM boards WHERE workspace_id = $1', [workspace_id]);
        res.json({board_count: result.rows[0].count})
    }catch(err){
        console.log('Error executing query', err.stack);
        res.status(500).send('Server Error');
    }
})

//7. get board by workspace
// app.get('/api/boards-workspace/', async(req,res)=>{
//     const {workspace_id} = req.query;
//     try{
//         const boardQuery = 'SELECT * FROM boards WHERE workspace_id = $1';
//         const result = await client.query(boardQuery, [workspace_id]);
//         res.status(200).json(result.rows);
//     }catch(error){
//         console.error('Error fetching boards:', error);
//         res.status(500).send('Error fetching boards');
//     }
// })
app.get('/api/boards-workspace', async(req,res)=>{
    const {workspace_id} = req.query;

    if(!workspace_id){
        return res.status(400).json({error:'workspace id is required'});
    }

    try{
        const boardQuery = `
            SELECT 
                boards.id,
                boards.name,
                boards.description,
                COALESCE(
                    json_agg(
                        json_build_object('id', users.id, 'username', users.username)
                    ) FILTER (WHERE users.id IS NOT NULL),
                    '[]'
                ) AS users
            FROM boards
            LEFT JOIN users ON users.id = ANY(boards.assign::int[])
            WHERE boards.workspace_id = $1
            GROUP BY boards.id;
        `;
        const result = await client.query(boardQuery, [workspace_id]);
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Error fetching boards:', error);
        res.status(500).send('Error fetching boards');
    }
})

//8. menduplikat boards
// Endpoint untuk menduplikat boards
// app.post('/api/duplicateBoard/:boardId', async (req, res) => {
app.post('/api/boards/:id/duplicate', async (req, res) => {
    const { id } = req.params;
    const {workspace_id} = req.body;

    try {
        await client.query('BEGIN');

        // 1. Mengambil data board asli
        const boardQuery = 'SELECT * FROM boards WHERE id = $1';
        const boardResult = await client.query(boardQuery, [id]);
//boardId
        if (boardResult.rows.length === 0) {
            return res.status(404).send('Board not found');
        }
        const originalBoard = boardResult.rows[0];

        // 2. Buat board baru (duplikasi)
        const newBoardQuery = `
            INSERT INTO boards (name, description, workspace_id) VALUES ($1, $2, $3) RETURNING id
        `;
        const newBoardResult = await client.query(newBoardQuery, [
            originalBoard.name + ' (Copy)',
            originalBoard.description,
            // originalBoard.workspace_id,
            workspace_id
        ]);
        const newBoardId = newBoardResult.rows[0].id;

        // 3. Ambil lists dari board asli
        const listsQuery = 'SELECT * FROM lists WHERE board_id = $1';
        const listsResult = await client.query(listsQuery, [id]);

        for (const list of listsResult.rows) {
            // 4. Buat list baru untuk board yang diduplikasi
            const newListQuery = `
                INSERT INTO lists (name, board_id, position) VALUES ($1, $2, $3) RETURNING id
            `;
            const newListResult = await client.query(newListQuery, [
                list.name,
                newBoardId,
                list.position,
            ]);
            const newListId = newListResult.rows[0].id;

            // 5. Ambil cards dari list asli
            const cardsQuery = 'SELECT * FROM cards WHERE list_id = $1';
            const cardsResult = await client.query(cardsQuery, [list.id]);

            for (const card of cardsResult.rows) {
                // 6. Buat card baru untuk list yang diduplikasi
                const newCardQuery = `
                    INSERT INTO cards (list_id, title, description, position, cover_id)
                    VALUES ($1, $2, $3, $4, $5)
                `;
                await client.query(newCardQuery, [
                    newListId, // Pastikan ini adalah list_id baru
                    card.title, // Pastikan Anda mengambil title bukan name
                    card.description,
                    card.position,
                    card.cover_id // Menambahkan cover_id jika ada
                ]);
            }
        }

        await client.query('COMMIT');
        res.status(201).send({ newBoardId, message: 'Board duplicated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error duplicating board:', error);
        res.status(500).send('Error duplicating board');
    }
});

//9. archive board
app.post('/api/boards/archive/:id', async(req,res)=>{
    const {id} = req.params;
    console.log('Archiving board with Id', id);
    try{
        const result = await client.query(`
                INSERT INTO archive (entity_type, entity_id, name, description)
                SELECT 'board', id, name,description
                FROM boards
                WHERE id = $1`, [id]
            );
            if(result.rowCount > 0){
                await client.query('DELETE FROM boards WHERE id = $1', [id])//menambahkan logika hapus
                res.status(200).send(`Board dengan id ${id} berhasil diarsipkan`)
            }else{
                res.status(500).send(`Board dengan id ${id} tidak ditemukan`)
            }
    }catch(error){
        console.error('Error executing query:', error.stack);
        res.status(500).send('Server error saat mengarsipkan board!')
    }
})

//10. mengupdate data assign pada boards
app.put('/api/boards/:boardId/assign', async(req,res)=>{
    const {boardId} = req.params;
    const {assign} = req.body;

    if(!assign || !Array.isArray(assign)){
        return res.status(400).json({message:'Invalid data format for assign'});
    }

    try{
        const query = 'SELECT * FROM boards WHERE id = $1';
        const boardResult = await client.query(query, [boardId]);

        if(boardResult.rowCount === 0){
            return res.status(400).json({message:'board not found'});
        }
        //mengambil data yang sudah ada pada assign
        const currentAssign = boardResult.rows[0].assign || [];

        //menggabungkan user yang sudah ada dengan user yang baru
        const updateAssign =  [...new Set([...currentAssign, ...assign])];

        //mengupdate board dengan daftar user yang baru
        const updateQuerry = 'UPDATE boards SET assign = $1 WHERE id= $2 RETURNING *';
        const result = await client.query(
            updateQuerry, [updateAssign, boardId]
        );

        return res.status(200).json({message:'Board updated successfully', board:result.rows[0]});
    }catch(error){
        console.error('Error updating board assignment:', error);
        res.status(500).json({message:'Internal server error'});
    }
})

// 11. Menghapus user dari assign boards
app.put('/api/boards/:id/remove-assign', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
  
    // Validasi inputan userId
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Valid User ID is required' });
    }
  
    try {
      // Mengambil data board berdasarkan ID
      const query = 'SELECT * FROM boards WHERE id = $1';
      const boardResult = await client.query(query, [id]);
  
      if (boardResult.rowCount === 0) {
        return res.status(404).json({ message: 'Board not found' });
      }
  
      // Menghapus userId dari array assign
      const updateQuery = `
        UPDATE boards
        SET assign = array_remove(assign, $1)
        WHERE id = $2
        RETURNING *`;
      const result = await client.query(updateQuery, [userId, id]);
  
      // Pastikan board telah diperbarui
      if (result.rowCount === 0) {
        return res.status(400).json({ message: 'User not found in the board assignment' });
      }
  
      res.json({
        message: 'Assignment updated successfully',
        board: result.rows[0],
      });
    } catch (error) {
      console.error('Error removing user from assign:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

//12. mendapatkan jumlah assign pada tabel boards
app.get('/api/boards/:boardId/assign-count', async(req,res)=>{
    const {boardId} = req.params;

    try{
        const result = await client.query(
            'SELECT array_length(assign, 1) AS assign_count FROM boards WHERE id = $1',
            [boardId]
        );
        if (result.rows.length > 0) {
            res.json({ boardId, assignCount: result.rows[0].assign_count || 0 });
        } else {
            res.status(404).json({ message: 'Board not found' });
        }

    }catch(error){
        console.error('Error fetching assign count:', error);
        res.status(500).json({error:'Interval server error'});
    }
})



//MENGUPDATE GAMBAR BACKGOROUND UNTUK BOARD BERDASARKAN IMAGE_ID
app.put('/api/boards/:boardId/background', async(req,res)=>{
    const boardId = req.params.boardId ;
    const image_Id = req.body.image_Id;

    //dibuging
    console.log('Updating board:', boardId, 'with image_id', image_Id);

    try{
        const result = await client.query('UPDATE boards SET background_image_id = $1 WHERE id = $2', [image_Id, boardId]);
        res.json({message:'Board background update successfuly'});
    } catch(error){
        console.error('Error updating board background', error);
        res.status(500).json({error:'failed to update backgroung'})
    }
});



//DATA MARKETING
//6. Get List total by board
app.get('/api/list-count/:board_id', async(req,res)=>{
    const {board_id} = req.params;
    try{
        const result = await client.query('SELECT COUNT (*) FROM lists WHERE board_id = $1', [board_id]);
        res.json({list_count: result.rows[0].count})
    }catch(err){
        console.error('Error executing query', err.stack);
        res.status(500).send('Server Error')
    }
})


//API END POIN LISTS

//BOARD_USER
//1. menambahkan user ke board
app.post('/api/board-users/:boardId/assign', async(req,res)=>{
    const {boardId} = req.params;
    const {userId} = req.body;

    if(!userId){
        return res.status(400).json({message:'User ID is required'});
    }
    try{
        const result = await client.query(
            'INSERT INTO board_users (board_id, user_id) VALUES ($1, $2) RETURNING *',
            [boardId, userId]
        );
        res.status(201).json(result.rows[0]);
    }catch(error){
        console.error('Error ading user to board:', error);
        res.status(500).json({message:'Failed to add user to board'});
    }
})
//2. menampilkan semua user yang terdaftar di board tertentu
app.get('/api/board-users/:boardId/users', async(req,res)=>{
    const {boardId} = req.params;

    try{
        const result = await client.query(
            'SELECT u.id, u.username FROM users u JOIN board_users bu ON u.id = bu.user_id WHERE bu.board_id = $1',
            [boardId]
        );
        if(result.rows.length === 0){
            return res.status(400).json({message:'No users found for this board'});
        }
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Error retrieving users for board:', error);
        res.status(500).json({message:'Failed to retrieve users for board'});
    }
})

//3. menghapus user dari board berdasarkan boardId dan userId
app.delete('/api/board-users/:boardId/assign/:userId', async(req,res)=>{
    const {boardId, userId} = req.params;

    try{
        const result = await client.query(
            'DELETE FROM board_users WHERE board_id = $1 AND user_id = $2 RETURNING *',
            [boardId, userId]
        );
        if(result.rowCount === 0){
            return res.status(400).json({message:'User not found in board'});
        }
        res.status(200).json({message:'User removed from board'});
    }catch(error){
        console.error('Error removing user from board:', error);
        res.status(500).json({message:'Failed to remove user from board'});
    }
});

//4. memilih user dan menambahkan ke board
app.post('/api/:boardId/select-user', async(req,res)=>{
    const {boardId} = req.params;
    const {userId} = req.body;

    if(!userId){
        return res.status(400).json({message:'User ID is required'});
    }
    try{
        const result = await client.query(
            'SELECT * FROM board_users WHERE board_id = $1 AND user_id = $2',
            [boardId, userId]
        );

        if(result.rows.length > 0){
            return res.status(400).json({message:'User already assigned to this board'});
        }

        const addUserResult = await client.query(
            'INSERT INTO board_users (board_id, user_id) VALUES ($1, $2) RETURNING *',
            [boardId, userId]
        );

        res.status(201).json(addUserResult.rows[0]);
    }catch(error){
        console.error('Error adding user to board:', error);
        res.status(500).json({message:'Failed to add user to board'})
    }
});

//5. endpoin untuk jumlah user di setiap board
app.get('/api/board-users/:boardId/count', async(req,res)=>{
    const {boardId} = req.params;

    try{
        const result = await client.query(`
            SELECT board_id, COUNT(user_id) AS user_count
            FROM board_users
            WHERE board_id = $1
            GROUP BY board_id;
        `,[boardId]);
        
        //jika board tidak ditemukan
        if(result.rows.length === 0){
            return res.status(404).json({error:'Board not found or no users assigned'});
        }

        res.json(result.rows[0]);
    }catch(error){
        console.error('Error fetching user count:', error);
        res.status(500).json({error: 'Internal server error'});
    }
})

//END BOARD_USER

//1. Membuat list baru -> bisa
//sebelum menambahkan list, cek board_id 
app.post('/api/lists/', async(req, res)=>{
    const {board_id,name, position} = req.body;

    try{
        //validasi adanya board id pada tabel board
        const boardExists = await client.query('SELECT id FROM boards WHERE id = $1', [board_id]);

        if(boardExists.rowCount === 0){
            return res.status(400).json({ error: 'Invalid board id'});
        }

        //menjalankan query untuk menambahkan lists 
        const newList = await client.query(
            `INSERT INTO lists (board_id, name, position) VALUES ($1, $2, $3) RETURNING *`,
            [board_id, name, position]
        );

        res.status(201).json(newList.rows[0]);
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error');
    }
})

// 2. mengambil/menampilkan semua data lists pada tabel  -> bisa
app.get('/api/lists/', async (req,res)=>{
    try{
        const result = await client.query('SELECT * FROM lists');
        res.json(result.rows);
    }catch(err){
        console.log('Error executing query', err.stack);
        res.status(500).send('Server Error');
    }
})

//3. mangambil/menampilkan data list berdasarkan ID  -> bisa
app.get('/api/lists/:id', async(req,res)=>{
    const {id} = req.params;

    try{
        const result = await client.query(
            'SELECT * FROM lists WHERE id = $1', [id]
        )
        //validasi apakah list dengan id tersebut ada
        if(result.rows.length == 0){
            return res.status(404).send('Lists tidak ditemukan!');
        }
        res.json(result.rows);
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error')
    }
})

//4. Mengupdate data lists -> bisa
// app.put('/api/lists/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, position } = req.body;

//     // Validasi format id
//     if (!id || isNaN(id)) {
//         return res.status(400).send('Invalid id format');
//     }

//     // Validasi req.body untuk name saja
//     if (!name) {
//         return res.status(400).json({ error: 'Name is required' });
//     }

//     try {
//         // Cek apakah list ada
//         const checkResult = await client.query(`SELECT * FROM lists WHERE id = $1`, [id]);
//         if (checkResult.rowCount === 0) {
//             return res.status(404).json({ error: 'List not found' });
//         }

//         // Jika position dikirim, update nama dan position
//         if (position) {
//             const result = await client.query(
//                 `UPDATE lists SET name = $1, position = $2 WHERE id = $3 RETURNING *`,
//                 [name, position, id]
//             );
//             return res.status(200).json(result.rows[0]);
//         }

//         // Jika hanya name yang dikirim, update hanya nama
//         const result = await client.query(
//             `UPDATE lists SET name = $1 WHERE id = $2 RETURNING *`,
//             [name, id]
//         );
//         return res.status(200).json(result.rows[0]);
//     } catch (err) {
//         console.error('Error updating list', err.stack);
//         return res.status(500).send('Server Error');
//     }
// });

app.put('/api/lists/:id', async(req,res)=>{
    const {id} = req.params;
    const {name} = req.body;

    if(!id || isNaN(id)){
        return res.status(400).send('Invalid id format');
    }
    if(!name){
        return res.status(400).json({error:'Name is required'});
    }

    try{
        //cek apakah list ada
        const checkResult = await client.query(`SELECT * FROM lists WHERE id = $1`, [id]);
        if(checkResult.rowCount === 0){
            return res.status(400).json({error:'List not found'})
        }
        //update hanya nama, position tidak diubah
        const result = await client.query(
            `UPDATE lists SET name = $1 WHERE id = $2 RETURNING *`,
            [name,id]
        );
        return res.status(200).json(result.rows[0]);
    }catch(error){
        console.error('Error updating list', error.stack);
        return res.status(500).send('Server Error');
    }
})

app.put('/api/list-update/:id', async(req, res)=>{
    const {id} = req.params;
    const {name} = req.body;

    //valid input
    if(!id || isNaN(id)){
        return res.status(400).json({error:'Invalid ID format'});
    }
    if(!name){
        return res.status(400).json({error:'Name is required'});
    }
    try {
        // Cek apakah list dengan ID tersebut ada
        const checkResult = await client.query('SELECT * FROM lists WHERE id = $1', [id]);
        if (checkResult.rowCount === 0) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Update hanya nama list tanpa mengubah posisi atau board_id
        const result = await client.query(
            'UPDATE lists SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating list:', error.stack);
        res.status(500).send('Server Error');
    }
})



//5. Menghapus list -> berdasarkan ID (bisa)
app.delete('/api/lists/:id', async(req, res)=>{
    const {id} = req.params;
    console.log('Deleting list by Id', id);

    try{
        const result = await client.query(`DELETE FROM lists WHERE id = $1`, [id])

        if(result.rowCount > 0){
            res.status(200).send(`Board dengan id ${id} berhasil dihapus`)
        }else{
            res.status(400).send(`Board dengan id ${id} tidak ditemukan`)
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error to Delete Lists')
    }
})

//6. Archive data list
app.post('/api/lists/archive/:id', async(req,res)=>{
    const {id} = req.params;
    console.log('Archiving list with id', id);
    try{
        const result = await client.query(`
            INSERT INTO archive (entity_type, entity_id, name, parent_id, parent_type)
            SELECT 'list',  id, name, board_id, 'board'
            FROM lists
            WHERE id = $1`,[id]
        );
        if(result.rowCount > 0){
            await client.query('DELETE FROM  lists WHERE id = $1', [id]);
            res.status(200).send(`Lists dengan id ${id} berhasil diarsipkan`)
        }else{
            res.status(400).send(`Lists dengan id ${id} tidak ditemukan`)
        }
    }catch(error){
        console.error('Error executing query:', error.stack);
        res.status(500).send('Server error saat mengarsipkan list!')
    }
})

app.post('/api/lists/:id/duplicate-to-board', async(req, res)=>{
    const {id} = req.params;
    const {board_id} = req.body;

    //memeriksa id diterima dengan baik 
    console.log('Id diterima dengan baik:', id);

    try{
        //mulai transkasi
        await client.query('BEGIN');

        //1. mengambil data list asli berdasarkan ID
        const listQuery =   'SELECT * FROM lists WHERE id = $1';
        // const listResult = await client.query(listQuery, [id]);
        const listResult = await client.query(listQuery,[id]);

        //memeriksa adanya list atau tidak
        if(listResult.rows.length === 0){
            return res.status(404).send('List not found');
        }
        const originalList = listResult.rows[0];

        //2. buat duplikat list untuk board baru
        const newListQuery = `
            INSERT INTO lists (name, board_id, position)
            VALUES ($1, $2, $3) RETURNING id
        `;
        const newListResult = await client.query(newListQuery, [
            originalList.name + '(Copy)', //nama list baru ditambah (copy) 
            board_id,
            originalList.position
        ]);
        const newListId = newListResult.rows[0].id;

        //3. mengambil semua cards dari list asli
        const cardsQuery ='SELECT * FROM cards WHERE list_id = $1';
        const cardsResult = await client.query(cardsQuery, [id]);

        //4. duplikasi setiap card dari list asli ke list baru
        for (const card of cardsResult.rows){
            const newCardQuery = `
                INSERT INTO cards (list_id, title, description, position, cover_id)
                VALUES ($1, $2, $3, $4, $5) RETURNING id
            `;
            const newCardResult =await client.query(newCardQuery, [
                newListId,
                card.title,
                card.description,
                card.position,
                card.cover_id
            ]);
            const newCardId = newCardResult.rows[0].id;

            //5. duplikasi label yang terkait dengan card lama ke card baru
            const labelsQuery = 'SELECT label_id FROM card_labels WHERE card_id = $1';
            const labelsResult = await client.query(labelsQuery, [card.id]);

            //6. duplikasi setiap label untuk card baru
            for (const label of labelsResult.rows){
                await client.query(
                    `INSERT INTO card_labels (card_id, label_id) VALUES ($1, $2)`,
                    [newCardId, label.label_id]
                );
            }
        }

        //commit transaksi setelah semua berhasil
        await client.query('COMMIT');
        res.status(201).send({newListId, message:'List duplicated to board successfully'})
    }catch(error){
        await client.query('ROLLBACK');
        console.error('Error duplicating list to board:', error)
        res.status(500).send('Error duplicating list to board')
    }
})


//API END POIN CARD
//1. Membuat card baru -> bisa
app.post('/api/cards/', async (req,res)=>{
    const {list_id, title, description, position,cover_id} = req.body;

    try{
        //validasi adanya card lain dengan id yang sama
        const cardExists = await client.query('SELECT id FROM lists WHERE id = $1', [list_id]);

        if(cardExists.rowCount === 0){
            return res.status(400).json({error: 'Invalid list id'});
        }

        //menjalankan query untuk menambahkan card
        const newCard = await client.query(
            `INSERT INTO cards (list_id, title,description,position,cover_id) VALUES ($1, $2, $3, $4, $5) RETURNING * `,
            [list_id, title, description,position, cover_id]
        );

        res.status(201).json(newCard.rows[0]);
    }catch(err){
        console.error('Error executing querty:', err.stack);
        res.status(500).send('Server Error');
    }
})

//2. Mendapatkan/menampilkan semua card -> bisa
app.get('/api/cards', async(req,res)=>{
    try{
        const result = await client.query('SELECT * FROM cards');
        res.json(result.rows)
    }catch(err){
        console.log('Error executing query', err.stack);
        res.status(500).send('Server Error');
    }
})

app.get('/api/cards/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const result = await client.query(
            `
           SELECT 
                c.id AS card_id, 
                c.title, 
                c.description, 
                c.position, 
                c.due_date, 
                c.create_at, 
                c.cover_id, 
                cv.name AS cover_name, 
                cv.cover_image_url, 
                cv.color_code AS cover_color_code, 
                array_agg(
                    jsonb_build_object(
                        'id', l.id,
                        'name', l.name,
                        'color', l.color,
                        'bg_color', l.bg_color
                    )
                ) AS labels
            FROM cards c
            LEFT JOIN cover cv ON c.cover_id = cv.id
            LEFT JOIN card_labels cl ON c.id = cl.card_id
            LEFT JOIN labels l ON cl.label_id = l.id
            WHERE c.id = $1
            GROUP BY c.id, cv.name, cv.cover_image_url, cv.color_code;
            `,
            [id]
        );

        if(result.rows.length > 0){
            res.json(result.rows[0]);
        }else{
            res.status(404).json({message: 'Card not found'});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Error retriecing card data'})
    }
  });
  
  

//4. Mengupdate data card -> bisa
app.put('/api/cards/:id', async(req,res)=>{
    const {id} = req.params;
    const {title, description} = req.body;

    //validasi format id
    if(!id || isNaN(id)){
        return res.status(400).send('Invalid id format');
    }

    //validasi req.body
    if(!title || !description){
        return res.status(400).json({error:'Title and description are required'})
    }

    try{
        //cek apakah  card ada
        const checkResult = await client.query(`SELECT * FROM cards WHERE id = $1`, [id]);
        if (checkResult.rowCount === 0){
            return res.status(404).send('Card tidak ditemukan!');
        }

        const result = await client.query(
            `UPDATE cards SET title = $1, description = $2 WHERE id = $3 RETURNING *`,
            [title, description,id]
        );

        //kmengembalikan data yang telah diupdate
        res.status(200).json(result.rows[0]);
    }catch(err){
        console.error('Error updating boards', err.stack);
        res.status(500).send('Server Error')
    }
})


//5. Delete card by id -> bisa
app.delete('/api/cards/:id', async(req,res)=>{
    const {id} = req.params;
    console.log('Deleting card by Id', id);

    try{
        const result = await client.query(`DELETE FROM cards WHERE id = $1`, [id])

        if(result.rowCount > 0){
            res.status(200).send(`Card with id ${id} successfully deleted`);
        }else{
            res.status(400).send(`Board with id ${id} not found`);
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error to Delete Card!')
    }
})

//6.duplikasi ke list yang ingin dituju
app.post('/api/cards/duplicate/:id', async (req, res) => {
    const { id } = req.params; // Ambil ID kartu dari parameter
    const { list_id } = req.body; // Ambil ID list tujuan dari body

    //debuging cardId & listId
    console.log('cardId diterima:', id);
    console.log('target list id:', list_id);

    if(!list_id){
        return res.status(400).json({message:'List_id is required'});
    }
    try{
        //fetch card data to duplicate
        const cardResult = await client.query(
            `SELECT * FROM cards WHERE id = $1`,
            [id]
        );

        if (cardResult.rows.length === 0){
            return res.status(400).json({message:'Card not found'});
        }
        const card = cardResult.rows[0];

        //insert the duplicated card into the specified list
        const newCardResult = await client.query(
            `INSERT INTO cards (title, description, position, due_date, cover_id, list_id, create_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *` ,
            [card.title, card.description, card.position, card.due_date, card.cover_id, list_id]
        );

        const newCardId = newCardResult.rows[0].id;

        //Duplicate labels assosiated with the original card
        await client.query(
            `INSERT INTO card_labels (card_id, label_id)
             SELECT $1, label_id FROM card_labels WHERE card_id = $2`,
            [newCardId, id]
        );
        res.status(201).json({message:'Card duplicated successfully', newCard: newCardResult.rows[0]})
    }catch(error){
        console.error('Error duplicating card:', error);
        res.status(500).json({ message: 'Error duplicating card' });
    }
});


//7. archive card
app.post('/api/cards/archive/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Archiving card with id', id);
  
    // Validasi ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).send('Invalid card ID');
    }
  
    try {
      const result = await client.query(
        `
        INSERT INTO archive (entity_type, entity_id, name, description, parent_id, parent_type)
        SELECT 'card', id, title, description, list_id, 'list'
        FROM cards
        WHERE id = $1
      `,
        [id]
      );
  
      if (result.rowCount > 0) {
        await client.query('DELETE FROM cards WHERE id = $1', [id]);
        res.status(200).send(`Card dengan id ${id} berhasil diarsipkan`);
      } else {
        res.status(400).send(`Card dengan id ${id} tidak ditemukan`);
      }
    } catch (error) {
      console.error('Error archiving card', error.stack);
      res.status(500).send('Server error saat mengarsipkan card!');
    }
  });

  //8. get card count by list
  app.get('/api/card-count', async(req,res)=>{
    const {list_id} = req.query;
    try{
        const result = await client.query('SELECT COUNT(*) FROM cards WHERE list_id = $1', [list_id]);
        res.json({card_count: result.rows[0].count})
    }catch(err){
        console.log('Error executing query', err.stack);
        res.status(500).send('Server Error')
    }
  })
  //9. search card
  app.get('/api/cards/search', async (req, res) => {
    const { query } = req.query;
    console.log('received query', query);
  
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: "Query parameter 'query' is required and should be a string." });
    }
  
    console.log('Received query:', query); // Debugging
  
    try {
      const result = await client.query(
        'SELECT title FROM cards WHERE title ILIKE $1',
        [`%${query}%`]  // Menambahkan wildcard ke parameter pencarian
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  //10. endpoint untuk mendapatkan card beserta card_description2 berdasarkan card_id
  app.get('/api/cards/:cardId/description', async(req,res)=>{
    const {cardId} = req.params;
    try{
        const query = `
          SELECT 
              c.id AS card_id, 
              c.title AS card_title, 
              c.description AS card_description,
              cd.*
          FROM cards c
          LEFT JOIN card_description2 cd ON c.id = cd.card_id
          WHERE c.id = $1;
      `;
      const result = await client.query(query, [cardId]);
      if(result.rows.length === 0){
        return res.status(404).json({message:'No data found this card ID'})
      }
      res.json(result.rows[0])
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error');
    }
  })

// 11. menyimpan cover id kedalam card data (dari localstorage ke database)
app.put('/api/cards/:id/cover', async (req, res) => {
    const { id } = req.params;  
    const { cover_id } = req.body; 

    console.log('Received request:', { id, cover_id }); 

    try {
        const query = 'UPDATE cards SET cover_id = $1, image_id = NULL WHERE id = $2 RETURNING *';
        const values = [cover_id, id]; 
        const result = await client.query(query, values);
        console.log('Database update result:', result);

        if (result.rows.length === 0) {
            console.log('Card not found for id: ', id);
            return res.status(404).json({ message: 'Card not found' });
        }

        // Log the updated card
        console.log('Updated card:', result.rows[0]);

        res.status(200).json(result.rows[0]); 
    } catch (error) {
        console.error('Error updating cover:', error.message); 
        return res.status(500).json({ message: 'Failed to update cover', error: error.message });
    }
});

//12. menyimpan image id kedalam card data.
app.put('/api/cards/:id/image', async(req,res)=>{
    const {id} =req.params;
    const {image_id} = req.body;
    console.log('Received request:', { id, image_id });

    try{
        const query = 'UPDATE cards SET image_id = $1, cover_id = NULL WHERE id = $2 RETURNING *';
        const values = [image_id, id];
        const result = await client.query(query, values);

        if(result.rows.length === 0){
            return res.status(400).json({message:'card not found'});
        }
        res.status(200).json(result.rows[0]);
    }catch(error){
        console.error('Error updating image:', error.message);
        res.status(500).json({ message: 'Failed to update image', error: error.message });
    }
})
  
  
//13. remove cover in cardId
app.put('/api/cards/:cardId/remove-cover', async(req,res)=>{
    const {id} = req.params;
 
    try{
        await client.query('UPDATE cards SET cover_id = NULL WHERE id = $1', [id]);
        res.status(200).json({message:'Cover remove success'})
    }catch(error){
        console.error('Error remove cover:', error);
        res.status(500).json({message:'Failed to remove cover'})
    }
})


//14. menampilkan label yang dipilih pada card
app.get('/api/cards/:id/labels', async(req,res)=>{
    const {id} = req.params;

    try{
        const result = await client.query(
            `SELECT labels.* FROM labels
            JOIN card_labels ON labels.id = card_labels.label_id
            WHERE card_labels.card_id = $1`, [id]
        );

        if(result.rowCount === 0){
            return res.status(400).json({message:'Labels not found for this card'});
        }
        res.status(200).json(result.rows);
    }catch(error){
        console.error("Error fetching card labels:", error);
        res.status(500).json({message:'Internal server error'});
    }
})
  
// 15. menyimpan label yang dipilih pada card
app.post('/api/cards/:id/labels', async (req, res) => {
    const { id } = req.params;
    const { label_id } = req.body;

    // Validasi input
    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Card ID harus berupa angka valid' });
    }
    if (!Array.isArray(label_id) || label_id.some(id => isNaN(parseInt(id)))) {
        return res.status(400).json({ message: 'label_id harus berupa array angka valid' });
    }

    try {
        console.log('Card ID:', id);
        console.log('Label IDs:', label_id);

        // Validasi label_id
        const validLabels = await client.query(
            `SELECT id FROM labels WHERE id = ANY($1::int[])`,
            [label_id]
        );
        const validLabelIds = validLabels.rows.map(row => row.id);

        if (validLabelIds.length === 0) {
            return res.status(400).json({ message: 'label_ids tidak valid' });
        }

        await client.query('BEGIN'); // Mulai transaksi

        // Tambahkan label ke card_labels
        const insertPromises = validLabelIds.map(labelId =>
            client.query(
                `INSERT INTO card_labels (card_id, label_id)
                 VALUES ($1, $2)
                 ON CONFLICT (card_id, label_id) DO NOTHING`,
                [id, labelId]
            )
        );
        await Promise.all(insertPromises);

        // Perbarui kolom label_id di cards
        await client.query(
            `UPDATE cards
             SET label_id = (
                 SELECT ARRAY_AGG(label_id)
                 FROM card_labels
                 WHERE card_id = $1
             )
             WHERE id = $1`,
            [id]
        );

        await client.query('COMMIT'); // Commit transaksi

        // Ambil data label terbaru
        const result = await client.query(
            `SELECT labels.*
             FROM labels
             JOIN card_labels ON labels.id = card_labels.label_id
             WHERE card_labels.card_id = $1`,
            [id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback jika terjadi error
        console.error('Error saving card labels:', error.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//16. gabungan antara cards dan card_labels
app.put('/api/cards/:id/labels', async (req, res) => {
    const { id } = req.params;
    let { label_id } = req.body;

    if (!Array.isArray(label_id)) {
        label_id = [label_id];
    }

    try {
        // Validasi label_id
        const validLabels = await client.query(
            `SELECT id FROM labels WHERE id = ANY($1::int[])`,
            [label_id]
        );

        const validLabelIds = validLabels.rows.map(row => row.id);
        if (validLabelIds.length === 0) {
            return res.status(400).json({ message: 'label_ids tidak valid' });
        }

        await client.query('BEGIN'); // Mulai transaksi

        // Hapus semua label lama dari card_labels
        await client.query('DELETE FROM card_labels WHERE card_id = $1', [id]);

        // Tambahkan label baru ke card_labels
        const insertPromises = validLabelIds.map(labelId =>
            client.query(
                `INSERT INTO card_labels (card_id, label_id) VALUES ($1, $2)`,
                [id, labelId]
            )
        );
        await Promise.all(insertPromises);

        // Perbarui kolom label_id di tabel cards
        await client.query(
            `UPDATE cards
             SET label_id = (
                 SELECT ARRAY_AGG(label_id)
                 FROM card_labels
                 WHERE card_id = $1
             )
             WHERE id = $1`,
            [id]
        );

        await client.query('COMMIT'); // Simpan perubahan

        // Ambil data label terbaru
        const result = await client.query(
            `SELECT labels.*
             FROM labels
             JOIN card_labels ON labels.id = card_labels.label_id
             WHERE card_labels.card_id = $1`,
            [id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query('ROLLBACK'); // Batalkan jika ada error
        console.error('Error updating card labels:', error.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 17. menampilkan label yang ada pada cards  -> id = cardId
app.get('/api/cards/:id/label', async (req, res) => {
    const { id } = req.params;

    // Validasi ID
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Invalid card ID' });
    }

    try {
        const result = await client.query(
            `
            SELECT 
                c.id AS card_id,
                c.title AS card_title,
                c.description AS card_description,
                l.id AS label_id,
                l.name AS label_name,
                l.color AS label_color,
                l.bg_color AS label_bg_color
            FROM 
                cards c
            LEFT JOIN 
                card_labels cl ON c.id = cl.card_id
            LEFT JOIN 
                labels l ON cl.label_id = l.id
            WHERE 
                c.id = $1;
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Card or labels not found' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving card labels:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 18. menghapus label pada cards (tidak semua label dihapus)
app.delete('/api/cards/:id/label', async(req,res)=>{
    const {id} = req.params;
    const {label_id} = req.body;

    if(!label_id){
        return res.status(400).json({message:'Label ID is required'});
    }

    try{
        //mengambil label yang ada pada kartu
        const {rows} = await client.query(
            'SELECT label_id FROM cards WHERE id = $1',
            [id]
        );

        if(rows.length === 0){
            return res.status(404).json({message:'Card not found'});
        }

        const currentLabels = rows[0].label_id || [];

        //filter untuk menghapus label yang diminta
        const updateLabels = currentLabels.filter((ids) => ids !== label_id );

        //perbarui kolom label_id
        await client.query(
            'UPDATE cards SET label_id = $1 WHERE id = $2',
            [updateLabels, id]
        );

        res.status(200).json({
            message: 'Label removed successfully',
            label_id,
            updateLabels,
        });
    }catch(error){
        console.error('Error removing label:', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

//19. menghapus label id dari card_labels
app.delete('/api/:card_id/card-labels', async(req,res)=>{
    // const {card_id,label_id} = req.body;
    const {card_id} = req.params;
    const {label_id} = req.body;

    if(!card_id || !label_id){
        return res.status(400).json({error:'card_id and label_id are required'});
    }

    try{
        const result = await client.query(
            'DELETE FROM card_labels WHERE card_id = $1 AND label_id = $2 RETURNING *',
            [card_id, label_id]
        );

        if(result.rowCount > 0){
            res.status(200).json({message: `Label ${label_id} removed successfully`});
        }else{
            res.status(404).json({message: `Card  ${label_id} label not found`});
        }
    }catch(error){
        console.error('Error executing query:', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

//CARD_USERS
//1. assign user to card -> works
app.post('/api/card-users', async(req,res)=>{
    const {card_id, user_id} = req.body;

    try{
        //validasi apakah user ada di board yang sesuai
        const checkQuery = `
            SELECT 1 FROM board_users bu
            JOIN lists l ON l.board_id = bu.board_id
            JOIN cards c ON c.list_id = l.id
            WHERE bu.user_id = $1 AND c.id = $2
        `;

        const checkResult = await client.query(checkQuery, [user_id, card_id]);
        if(checkResult.rowCount === 0){
            return res.status(400).json({message:"User is not part of the board"});
        }

        //assign user ke card
        const insertQuery = `INSERT INTO card_users (card_id, user_id) VALUES ($1, $2) RETURNING *`;
        const result = await client.query(insertQuery, [card_id,user_id]);
        
        res.status(201).json({message:'User assigned to card', data:result.rows[0]});
    }catch(error){
        console.error('Error assigning user:', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

//2. remove user from card
app.delete('/api/card-users/:card_id/:user_id', async(req,res)=>{
    const {card_id, user_id} = req.params;

    try{
        const deleteQuery = `DELETE FROM card_users WHERE card_id = $1 AND user_id = $2 RETURNING *`;
        const result = await client.query(deleteQuery,[card_id, user_id]);

        if(result.rowCount === 0){
            return res.status(404).json({message:'User assignment not found'});
        }
        res.json({message:"user removed from card", data:result.rows[0]});
    }catch(error){
        console.error("Error removing from card", error);
        res.status(500).json({message:'Server error'});
    }
});
//END CARD_USERS

  


//API END POIN Labels
// LABELS-LABELS 
//1. membuat label baru
app.post('/api/labels', async(req,res) =>{
    try{
        const {name} = req.body;

        //generate random color
        const color = '#333';
        const bg_color = getRandomColor();

        //memasukkan label baru ke database
        const result = await client.query(
            'INSERT INTO labels (name, color, bg_color) VALUES ($1, $2, $3) RETURNING *',
            [name, color, bg_color]
        );

        const newLabel = result.rows[0];
        res.status(201).json(newLabel);
    }catch(error){
        console.error('Error adding a label:', error);
        res.status(500).json({error:'Internal server error'});
    }
})

//2. Mengambil semua data labels 
app.get('/api/labels', async(req,res)=>{
    try{
        const result = await client.query('SELECT * FROM labels');
        res.json(result.rows)
    }catch(err){
        console.log('Error executing query', err.stack)
        res.status(500).send('Server Error')
    }
})

//3. mengambil/menampilkan data labels berdasarkan ID
app.get('/api/labels/:id', async (req,res)=>{
    const {id} = req.params;

    try{
        const result = await client.query(`SELECT * FROM labels WHERE id = $1`, [id]);

        //check validasi adanya labels dengan ID tersebut
        if(result.rows.length === 0){
            return res.status(404).send('Labels tidak ditemukan!')
        }
        res.json(result.rows);
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error')
    }
})

//4. Update data labels 
app.put('/api/labels/:id', async(req,res)=>{
    const {id} = req.params;
    const {name,color, bg_color} = req.body;

    try{
        const result = await client.query(
            `UPDATE labels SET name = $1, color = $2, bg_color = $3 WHERE id = $4 RETURNING *`, [name,color,bg_color, id]
        );

        if(result.rowCount === 0){
            return res.status(404).json({error: 'Labels not found'});
        }
        res.status(200).json(result.rows[0]);
    }catch(err){
        console.error('Error updating lables data', err.stack);
        res.status(500).send('Server Error')
    }
})

//5. Deleting labels by id
app.delete('/api/labels/:id', async(req,res)=>{
    const{id} = req.params;
    console.log('Deleting labels by id', id)

    try{
        const result = await client.query('DELETE FROM labels WHERE id = $1', [id]);

        if(result.rowCount > 0){
            res.status(200).send(`Labels dengan id ${id} berhasil dihapus`);
        }else{
            res.status(404).send(`Labels dengan id ${id} tidak berhasil dihapus`)
        }
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error to Delete User Data!')
    }
})

// 6. menambahkan label ke data cards (array)
//id = cardId
app.put('/api/cards/:id/labels', async(req,res)=>{
    const {id} = req.params;
    let {label_id} = req.body;

    if (!Array.isArray(label_id)) {
            label_id = [label_id]; // Memastikan labelIds selalu dalam bentuk array
        }
    
        try {
            const result = await client.query(
                'UPDATE cards SET label_id = $1 WHERE id = $2 RETURNING *',
                [label_id, id]
            );
    
            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Card not found" });
            }
    
            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error("Error updating card labels:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
})

//API CARD LABELS
//1. POST menambah label kartu (card_labels)
app.post('/api/:cardId/labels', async(req, res)=>{
    const {card_id} = req.params;
    const {label_id} = req.body;

    try{
        //Memeriksa apakah card dan label id ada
        const cardExists = await client.query('SELECT * FROM cards WHERE id = $1', [card_id]);
        const labelExist = await client.query('SELECT id FROM labels WHERE id = $1', [label_id]);

        if (cardExists.rowCount === 0 || labelExist.rowCount === 0){
            return res.status(400).json({error: 'Invalid card_id or Label_id'});
        }

        //menambahkan label ke kartu
        const result = await client.query(
            `INSERT INTO card_labels (card_id, label_id) VALUES ($1, $2) RETURNING *`,
            [card_id, label_id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err){
        console.error('Error adding label to card', err.stack)
        res.status(500).send('Server Error');
    } 
})

//2. Mendapatkan semua label untuk kartu -> bisa
app.get('/api/:cardId/labels', async(req,res)=>{
    const {card_id} = req.params;

    try{
        const result = await client.query(
            `SELECT l.id, l.name, l.color FROM labels l JOIN card_labels cl ON l.id = cl.label_id WHERE cl.card_id= $1`,
            [card_id]
        );
        res.status(200).json(result.rows);
    }catch(err){
        console.error('Error fetching labels for card', err.stack);
        res.status(500).send('Server Error');
    }
})

//3. Menghapus label dari kartu
app.delete('/api/card-labels', async(req,res)=>{
    const { card_id, label_id } = req.body;

    try {
        const result = await client.query(
            `DELETE FROM card_labels WHERE card_id = $1 AND label_id = $2 RETURNING *`,
            [card_id, label_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Label not found for this card' });
        }

        res.status(200).json({ message: 'Label removed from card successfully' });
    } catch (err) {
        console.error('Error removing label from card', err.stack);
        res.status(500).send('Server Error');
    }
})
//4. update -> memperbarui label untuk kartu
//update card 2
app.put('/:cardId/labels', async (req, res) => {
    const cardId = parseInt(req.params.cardId);
    const { labels } = req.body; // Harus berupa array ID label yang ingin dihubungkan

    if (!Array.isArray(labels)) {
        return res.status(400).json({ error: 'Labels should be an array of label IDs' });
    }

    try {
        await client.query('BEGIN'); // Memulai transaksi

        // Hapus label yang sudah ada
        await client.query('DELETE FROM card_labels WHERE card_id = $1', [cardId]);

        // Tambahkan label yang baru
        const insertPromises = labels.map(labelId => {
            return pool.query('INSERT INTO card_labels (card_id, label_id) VALUES ($1, $2)', [cardId, labelId]);
        });
        await Promise.all(insertPromises);

        await pool.query('COMMIT'); // Selesai transaksi

        res.status(200).json({ message: 'Labels updated successfully' });
    } catch (error) {
        await pool.query('ROLLBACK'); // Jika terjadi error, batalkan transaksi
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Memperbarui label untuk kartu 1
// app.put('/:cardId/labels', async (req, res) => {
//     const cardId = parseInt(req.params.cardId);
//     const { labels } = req.body; // Harus berupa array ID label yang ingin dihubungkan

//     if (!Array.isArray(labels)) {
//         return res.status(400).json({ error: 'Labels should be an array of label IDs' });
//     }

//     try {
//         await client.query('BEGIN'); // Memulai transaksi

//         // Hapus label yang sudah ada
//         await client.query('DELETE FROM card_labels WHERE card_id = $1', [cardId]);

//         // Tambahkan label yang baru
//         const insertPromises = labels.map(labelId => {
//             return pool.query('INSERT INTO card_labels (card_id, label_id) VALUES ($1, $2)', [cardId, labelId]);
//         });
//         await Promise.all(insertPromises);

//         await pool.query('COMMIT'); // Selesai transaksi

//         res.status(200).json({ message: 'Labels updated successfully' });
//     } catch (error) {
//         await pool.query('ROLLBACK'); // Jika terjadi error, batalkan transaksi
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


//API ENDPOIN CARD-DESCRIPTION
// 1. POST card detail 
app.post('/api/card-description', async (req, res) => {
    const {
        card_id,
        nomer_active_order,
        input_by,
        buyer_name,
        code_order,
        jumlah_track,
        order_number,
        account,
        deadline,
        jumlah_revisi,
        order_type,
        offer_type,
        jenis_track,
        genre,
        price,
        required_file,
        project_type,
        duration,
        reference,
        file_and_chat,
        detail_project,
    } = req.body;

    // Validasi input
    if (!card_id) {
        return res.status(400).send('Card_id perlu diisi!');
    }

    try {
        const cardExists = await client.query('SELECT * FROM cards WHERE id = $1', [card_id]);

        if (cardExists.rowCount === 0) {
            return res.status(400).json({ error: 'Invalid card id' });
        }

        const queryText = `
            INSERT INTO card_descriptions 
            (card_id, nomer_active_order, input_by, buyer_name, code_order, jumlah_track, order_number, account, deadline, jumlah_revisi, order_type, offer_type, jenis_track, genre, price, required_file, project_type, duration, reference, file_and_chat, detail_project)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *
        `;
        const queryValues = [
            card_id,
            nomer_active_order,
            input_by,
            buyer_name,
            code_order,
            jumlah_track,
            order_number,
            account,
            deadline,
            jumlah_revisi,
            order_type,
            offer_type,
            jenis_track,
            genre,
            price,
            required_file,
            project_type,
            duration,
            reference,
            file_and_chat,
            detail_project,
        ];

        const result = await client.query(queryText, queryValues);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding card description', err.stack);
        res.status(500).send('Server error');
    }
});


//2. Get mengambil/Menampilkan semua data card-description 
app.get('/api/card-description', async(req, res)=>{
    try{
        const result = await client.query('SELECT * FROM card_descriptions');
        res.status(200).json(result.rows);
    }catch(err){
        console.error('Error fetching card descriptions', err.stack);
        res.status(500).send('Server Error');
    }
})
//3. PUT mengupdate data dari card-descriptions
app.put('/api/card-description/:id', async(req,res)=>{
    const {id} = req.params;
    const {
        card_id,
        nomer_active_order,
        input_by,
        buyer_name,
        code_order,
        jumlah_track,
        order_number,
        account,
        deadline,
        jumlah_revisi,
        order_type,
        offer_type,
        jenis_track,
        genre,
        price,
        required_file,
        project_type,
        duration,
        reference,
        file_and_chat,
        detail_project,
    } = req.body;

    try{
        const result = await client.query(
            `UPDATE card_descriptions
            SET card_id = $1, nomer_active_order = $2, input_by = $3, buyer_name = $4, code_order = $5, jumlah_track = $6, order_number = $7, account = $8, deadline = $9, jumlah_revisi = $10, order_type = $11, offer_type = $12, jenis_track = $13, genre = $14, price = $15, required_file = $16, project_type = $17, duration = $18, reference = $19, file_and_chat = $20, detail_project = $21
            WHERE id = $22
            RETURNING *`,
            [card_id, nomer_active_order, input_by, buyer_name, code_order, jumlah_track, order_number, account, deadline, jumlah_revisi, order_type, offer_type, jenis_track, genre, price, required_file, project_type, duration, reference, file_and_chat, detail_project, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Card description not found' });
        }

        res.status(200).json(result.rows[0]);
    }catch(err){
        console.error('Error updating card description', err.stack);
        res.status(500).send('Server Error');
    }
});

//4. Delete card-description
app.delete('/api/card-description/:id', async(req,res)=>{
    const {id} = req.params;
    console.log('DEleting card deskription by Id', id)
    try{
        const result = await client.query('DELETE FROM card_descriptions WHERE id = $1', [id])

        if(result.rowCount > 0){
            return res.status(200).send(`Card Description with id ${id} successfully deleted`);
        }else{
            res.status(400).send(`Board with id ${id} not found`)
        }
    }catch(err){
        console.error('Error deleting card description', err.stack);
        res.status(500).send('Server error')
    }
})

//5. mengambil data card description berdasarkan id
app.get('/api/card-description/:id', async(req,res)=>{
    const {id} = req.params;

    try{
        const result = await client.query('SELECT * FROM card_descriptions WHERE id = $1', [id]);

        //check validasi adanya card description dengan id tersebut
        if(result.rows.length === 0){
            return res.status(404).send(`Card description dengan ID ${id} tidak ditemukan!`)
        }
        res.json(result.rows);
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error');
    }
})


//MARKETING 
//1. get all data marketing
app.get('/api/marketing_data/', async(req, res)=>{
    try{
        const result = await client.query('SELECT * FROM marketing_data');
        res.json(result.rows);
    }catch(err){
        console.log('Error executing query', err.stack);
        res.status(500).send('Server Error');
    }
})

//2. menambahkan data baru
app.post('/api/marketing_data/', async(req,res)=>{
    const {
        nomer_active_order,
        input_by,
        buyer_name,
        code_order,
        jumlah_track,
        order_number,
        account,
        deadline,
        jumlah_revisi,
        order_type,
        offer_type,
        jenis_track,
        genre,
        price,
        required_file,
        project_type,
        duration,
        reference,
        file_and_chat,
        detail_project,
        progress
    } = req.body;

    try{
        const queryText = ` INSERT INTO marketing_data
            (nomer_active_order, input_by, buyer_name, code_order,jumlah_track,order_number,account,deadline,jumlah_revisi,order_type,offer_type,jenis_track,genre,price,required_file,project_type,duration,reference,file_and_chat,detail_project,progress)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *
        `;
        const queryValues = [
            nomer_active_order,
            input_by,
            buyer_name,
            code_order,
            jumlah_track,
            order_number,
            account,
            deadline,
            jumlah_revisi,
            order_type,
            offer_type,
            jenis_track,
            genre,
            price,
            required_file,
            project_type,
            duration,
            reference,
            file_and_chat,
            detail_project,
            progress
        ];

        const result = await client.query(queryText, queryValues);
        res.status(201).json(result.rows[0]);
    }catch(err){
        console.error('Error inserting data', err.stack);
        res.status(500).send('Server Error');
    }
}) 

//3. mengupdate data marketing
app.put('/api/marketing_data/:id', async(req, res) => {
    const { id } = req.params;
    const {
        nomer_active_order,
        input_by,
        buyer_name,
        code_order,
        jumlah_track,
        order_number,
        account,
        deadline,
        jumlah_revisi,
        order_type,
        offer_type,
        jenis_track,
        genre,
        price,
        required_file,
        project_type,
        duration,
        reference,
        file_and_chat,
        detail_project,
        progress
    } = req.body;

    try {
        const result = await client.query(
            `UPDATE marketing_data 
            SET 
                nomer_active_order = $1, 
                input_by = $2, 
                buyer_name = $3, 
                code_order = $4, 
                jumlah_track = $5, 
                order_number = $6, 
                account = $7, 
                deadline = $8, 
                jumlah_revisi = $9, 
                order_type = $10, 
                offer_type = $11, 
                jenis_track = $12, 
                genre = $13, 
                price = $14, 
                required_file = $15, 
                project_type = $16, 
                duration = $17, 
                reference = $18, 
                file_and_chat = $19, 
                detail_project = $20, 
                progress = $21
            WHERE id = $22
            RETURNING *`,
            [
                nomer_active_order,
                input_by,
                buyer_name,
                code_order,
                jumlah_track,
                order_number,
                account,
                deadline,
                jumlah_revisi,
                order_type,
                offer_type,
                jenis_track,
                genre,
                price,
                required_file,
                project_type,
                duration,
                reference,
                file_and_chat,
                detail_project,
                progress,
                id
            ]
        );
        res.status(200).json(result.rows[0]); // Mengembalikan data yang diperbarui
    } catch (err) {
        console.error('Error updating Marketing Data', err.stack);
        res.status(500).send('Server Error');
    }
});

//4. Delete marketing data
app.delete('/api/marketing_data/:id', async(req, res)=>{
    const {id} = req.params;
    console.log('Deleting marketing data', id)
    try{
        const result = await client.query('DELETE FROM marketing_data WHERE id = $1', [id])

        //cek apakah data marketing ada atau tidak di tabel marketing
        if(result.rowCount  > 0){
            return res.status(200).send(`data marketing with id ${id} successfully deleted`)
        }else{
            res.status(404).send(`data marketing with id ${id} not found`)
        }
    }catch(err){
        console.error('Error deleting data marketing', err.stack)
        res.status(500).send('Server Error')
    }
})

//5. mendapatkan/menampilkan data berdasarkan id
app.get('/api/marketing_data/:id', async(req,res)=>{
    const {id} = req.params;

    try{
        const result = await client.query('SELECT * FROM marketing_data WHERE id = $1', [id])

        //cek apakah ada data dengan id tersebut di marketing data tabel
        if(result.rows.length === 0){
            return res.status(404).send(`data marketing dengan id ${id} tidak ditemukan!`)
        }
        res.json(result.rows);
    }catch(err){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error');
    }
})


//Comment
//create comment
app.post('/api/comments', async (req, res) => {
    const { card_id, user_id, content } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO comments (card_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
            [card_id, user_id, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

//add member to comment
app.post('/api/card_members', async (req, res) => {
    const { card_id, user_id } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO card_members (card_id, user_id) VALUES ($1, $2) RETURNING *',
            [card_id, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

//Background 
//1. menambahkan gambar (url) ke dalam database image_bg -> bisa
app.post('/api/images', async(req, res)=> {
    const {name, image_url} = req.body;

    try{
        const newImage = await client.query(
            'INSERT INTO image_bg (name, image_url) VALUES ($1, $2) RETURNING * ',
            [name, image_url]
        );
        res.json(newImage.rows[0]);
    }catch(err){
        console.error('Error create add bg image', err.stack);
        res.status(500).send('Server Error');
    }
})
// 2. menampilkan semua gambar  -> bisa
app.get('/api/images', async(req,res)=> {
    try{
        const allImages = await client.query('SELECT * FROM image_bg');
        res.json(allImages.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Error retriecing images');
    }
})

//3. Menampilkan gambar berdasarkan ID (GEt gambar berdasarkan ID) -> bisa
app.get('/api/images/:id', async (req,res)=> {
    const {id} = req.params;

    try{
        const image = await client.query('SELECT * FROM image_bg WHERE id = $1', [id]);
        if(image.rows.length === 0){
            return res.status(400).send('Image not found');
        }
        res.json(image.rows[0]);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Error retrieving image');
    }
})

//4. Mengupdate gambar berdasarkan ID (UPDATE gambar) -> bisa
app.put('/api/images/:id', async(req, res)=> {
    const {id} = req.params;
    const {name,image_url} = req.body;

    try{
        const updateImage = await client.query(
            'UPDATE image_bg SET name = $1, image_url = $2 WHERE id = $3 RETURNING *',
            [name, image_url, id]
        );
        if(updateImage.rows.length === 0){
            return res.status(404).send('Image not found');
        }
        res.json(updateImage.rows[0]);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Error updating image');
    }
})

//5. menghapus gambar berdasarkan ID -> bisa
app.delete('/api/images/:id', async(req,res)=> {
    const {id} = req.params;

    try{
        const deleteImage = await client.query('DELETE FROM image_bg WHERE id = $1 RETURNING *', [id]);
        if(deleteImage.rows.length === 0){
            return res.status(404).send('Image not found');
        }
        res.json({message:'Image deleted successfully'});
    }catch(err){
        console.error(err.message);
        res.status(500).send('Error deleting image')
    }
})

//Cover
//1. menambahkan gambar (url) ke dalam database  -> bisa
app.post('/api/cover', async (req, res)=> {
    const {name, cover_image_url} = req.body;

    try{
        const newCover = await client.query(
            'INSERT INTO cover (name, cover_image_url) VALUES ($1, $2) RETURNING *',
            [name, cover_image_url]
        );
        res.json(newCover.rows[0]);
    }catch(error){
        console.error('Error add new cover in tabel cover', error.stack);
        res.status(500).send('Server Error');
    }
})

//2. menampilkan semua cover -> bisa
app.get('/api/cover', async(req, res)=> {
    try{
        const allCover = await client.query('SELECT * FROM cover');
        res.json(allCover.rows);
    }catch(error){
        console.error(error.message);
        res.status(500).send('Error fetching all cover');
    }
})

//3. menampilkan cover berdasarkan ID
app.get('/api/cover/:id', async(req,res)=> {
    const {id} = req.params;
    try{
        const cover = await client.query('SELECT * FROM cover WHERE id = $1', [id]);
        if(cover.rows.length === 0){
            return res.status(400).send('Image not found');
        }
        res.json(cover.rows[0]);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Error fetching cover by id')
    }
})

//4. update cover berdasarkan ID
app.put('/api/cover/:id', async(req,res)=>{
    const {id} = req.params;
    const {name,cover_image_url} = req.body;

    try{
        const updateCover = await client.query(
            'UPDATE cover SET name = $1, cover_image_url = $2 WHERE id = $3 RETURNING *',
            [name,cover_image_url, id]
        );
        if(updateCover.rows.length === 0){
            return res.status(404).send('cover not found');
        }
        res.json(updateCover.rows[0]);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Error updating Cover')
    }
})

//5. delete cover by id
app.delete('/api/cover/:id', async(req,res)=>{
    const {id} = req.params;

    try{
        const deleteCover = await client.query('DELETE FROM cover WHERE id = $1 RETURNING *', [id]);
        if(deleteCover.rows.length === 0){
            return res.status(400).send('Cover not found');
        }
        res.json({message:'Cover delete succesfully'})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Error deleting image');
    }
})


//DATA Employees
//1. Mengambil semua data employees
app.get('/api/employees/', async(req,res)=> {
    try{
        const result = await client.query('SELECT * FROM employees');
        res.json(result.rows);
    }catch(error){
        console.error('Error executing query', err.stack);
        res.status(500).send('Server Error');
    }
})
//2. get data employees by id
app.get('/api/employees/:id', async(req,res)=>{
    const {id} = req.params;

    try{
        const result = await client.query(
            'SELECT * FROM employees WHERE id = $1', [id]
        );
        //check dara
        if(result.rows.length === 0){
            return res.status(404).send('Data employees tidak ditemukan')
        }
        res.json(result.rows);
    }catch(error){
        console.error('Error executing query:', err.stack);
        res.status(500).send('Server Error')
    }
})

//3. membuat data employee baru
app.post('/api/employees/', async(req,res)=> {
    const {name,username,email,nomor_wa,divisi,shift,jabatan, work_days, off_days} = req.body;

    try{
        const existingDataEmployee = await client.query(
            'SELECT * FROM employees WHERE name = $1',[name]
        )
        if(existingDataEmployee.rows.length > 0){
            return res.status(400).send('Employee name already exist');
        };
        await client.query(
            'INSERT INTO employees (name, username, email, nomor_wa, divisi, shift, jabatan,work-days, off_days) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [name, username, email, nomor_wa, divisi, shift, jabatan, work_days, off_days || null]
        );
        res.status(201).send('Data Employee Added!')
    }catch(error){
        console.error('Error add new data employee:', error.stack)
        res.status(500).send('Server error')
    }
})

//4. update data employee
app.put('/api/employees/:id', async(req,res)=>{
    const {id} = req.params;
    const {name, username, email, nomor_wa, divisi, shift, jabatan, work_days,off_days} = req.body;

    try{
        const result = await client.query(
            `UPDATE employees SET name = $1, username = $2, email = $3, nomor_wa = $4, divisi = $5, shift = $6, jabatan = $7, work_days = $8, off_days = $9 WHERE id = $10`,
            [name, username, email, nomor_wa, divisi, shift, jabatan, work_days, off_days, id]
        );
        res.status(200).send('Data employees update successfuly');
    }catch(err){
        console.error('Error updating employee data:', err.stack)
        res.json(500).send('Server Error')
    }
})

//5. deleting data employees by id
app.delete('/api/employees/:id', async(req,res)=> {
    const {id} = req.params;
    console.log('Deleting employee data by id:', id);
    try{
        const result = await client.query(
            'DELETE FROM employees WHERE id = $1', [id]
        )
        if(result.rowCount > 0){
            res.status(200).send(`Data Employee with id ${id} berhasil dihapus`)
        }else{
            res.status(400).send(`Data Employee with id ${id} tidak ditemukan`)
        }
    }catch(error){
        console.error('Error executing query:', error.stack)
        res.json(500).send('Server error to delete data employee')
    }
})


//membuat card baru berdasarkan card description
app.post('/api/cards/createWithDescription', async(req,res)=>{
    try{
        const {workspaceName, boardName, listName, cardData, cardDescriptionData} = req.body;

        //1. mencari workspace berdasarkan nama
        const workspaceResult = await client.query(
            `SELECT id FROM workspaces WHERE name = $1`, [workspaceName]
        );
        if(workspaceResult.rows.length === 0){
            return res.status(404).json({message:'Workspace not found'});
        }
        const workspaceId = workspaceResult.rows[0].id;

        //2. mencari board berdasarkan nama dan workspace_id
        const boardResult = await client.query(
            `SELECT id FROM boards WHERE name = $1 AND workspace_id = $2`,[boardName,workspaceId]
        );
        if(boardResult.rows.length === 0){
            return res.status(404).json({message:'Board not found in specified workspace'});
        }
        const boardId = boardResult.rows[0].id;

        //3. cari list berdasarkan nama dan board_id
        const listResult = await client.query(
            `SELECT id FROM lists WHERE name = $1 AND board_id = $2`, [listName, boardId]
        );
        if(listResult.rows.length === 0){
            return res.status(404).json({message:'List not found in specidied board'})
        }
        const listId = listResult.rows[0].id;

        //4. menyimpan data card_description ke dalam tabel card description
        const name = `${cardDescriptionData.nomer_active_order} = ${cardDescriptionData.buyer_name}`;
        const description = `${cardDescriptionData.detail_project}`;

        const cardInsertResult = await client.query(
            `INSERT INTO cards (title, list_id, description, position, create_at)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [name, listId, description, cardData.position, new Date()]
        );

        const cardId = cardInsertResult.rows[0].id;

        //5. menyimpan data card ke dalam tabel cards
        await client.query(
            `INSERT INTO cards (id, title, list_id, description, position, create_at)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [cardData.id, name, listId, description, cardData.position, new Date()]
        );
        res.status(201).json({message:'Card and Card Description created successfully'});
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Error creating card and card description'})
    }
})

app.get('/api/card_description2', async(req,res)=>{
    try{
        const result = await client.query('SELECT * FROM card_description2');
        res.json(result.rows);
    }catch(error){
        console.error('Error executing query', err.stack);
        res.status(500).send('Server Error');
    }
})

//DATA MARKETING
//1. get all data 
app.get('/api/marketing', async(req,res)=>{
    try{
        const result = await client.query('SELECT * FROM data_marketing');
        res.json(result.rows);
    }catch(error){
        console.log('Error executing query', err.stack);
        res.status(500).send('Server Error')
    }
})
//create card using data marketing
app.post('/api/create-card-from-marketing', async(req,res)=>{
    const {marketing_id, listId} = req.body;

    try{
        //ambil data marketing berdasarkan marketingId
        const marketingResult = await client.query(
            'SELECT * FROM data_marketing WHERE marketing_id = $1',
            [marketing_id]
        );
        const marketingData = marketingResult.rows[0];

        if(!marketingData){
            return res.status(404).json({error:'Matketing data not found'});
        }

        //perubahan1
        //periksa apakah card id sudah ada
        if(marketingData.card_id){
            const cardResult = await client.query(
                'SELECT cards.id, cards.title, lists.name AS list_name FROM cards INNER JOIN lists ON cards.list_id = lists.id WHERE cards.id = $1',
                [marketingData.card_id]
            )

            const existingCards = cardResult.rows[0];

            if(existingCards){
                return res.status(200).json({
                    message:'Card already exist',
                    cardId: existingCards.id,
                    listName: existingCards.list_name,
                })
            }
        }

        //buat card baru berdasarkan data marketing
        const cardResult = await client.query(
            `INSERT INTO cards (list_id, title, description, position, due_date)
            VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [
                listId,
                // marketingData.buyer_name,
                `${marketingData.buyer_name} || ${marketingData.code_order} || ${marketingData.order_number}`, // Gabungkan data untuk title
                marketingData.detail_project,
                0,
                marketingData.deadline
            ]
        );

        const cardId = cardResult.rows[0].id;

        //update data marketing dengan card_id yang baru dibuat
        await client.query(
            'UPDATE data_marketing SET card_id = $1 WHERE marketing_id = $2',
            [cardId,marketing_id]
        );
        res.status(201).json({
            message:'Card created successfully', 
            cardId,
        });        
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Failed to create card'})
    }
})

//2.menambahkan data baru
// app.post('/api/marketing', async (req, res) => {
//     const {
//       marketing_id,
//       card_id,
//       input_by,
//       acc_by,
//       buyer_name,
//       code_order,
//       jumlah_track,
//       order_number,
//       account,
//       deadline,
//       jumlah_revisi,
//       order_type,
//       offer_type,
//       jenis_track,
//       genre,
//       price_normal,
//       price_discount,
//       discount,
//       basic_price,
//       gig_link,
//       required_files,
//       project_type,
//       duration,
//       reference_link,
//       file_and_chat_link,
//       detail_project
//     } = req.body;
  
//     try {
//       // Query untuk menyimpan data
//       const result = await client.query(
//         `INSERT INTO data_marketing (
//           marketing_id, card_id, input_by, acc_by, buyer_name, code_order, jumlah_track, order_number,
//           account, deadline, jumlah_revisi, order_type, offer_type, jenis_track, genre, price_normal,
//           price_discount, discount, basic_price, gig_link, required_files, project_type, duration, 
//           reference_link, file_and_chat_link, detail_project
//         ) VALUES (
//           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
//           $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
//         ) RETURNING *`,
//         [
//           marketing_id,
//           card_id,
//           input_by,
//           acc_by,
//           buyer_name,
//           code_order,
//           jumlah_track,
//           order_number,
//           account,
//           deadline,
//           jumlah_revisi,
//           order_type,
//           offer_type,
//           jenis_track,
//           genre,
//           price_normal,
//           price_discount,
//           discount,
//           basic_price,
//           gig_link,
//           required_files,
//           project_type,
//           duration,
//           reference_link,
//           file_and_chat_link,
//           detail_project
//         ]
//       );
  
//       // Mengembalikan hasil query jika berhasil
//       res.status(201).json({
//         message: 'Data inserted successfully',
//         data: result.rows[0]
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Error inserting data', error: err.message });
//     }
//   });
//2.menambahkan data baru
app.post('/api/marketing', async (req, res) => {
    const {
    //   marketing_id,
      card_id,
      input_by,
      acc_by,
      buyer_name,
      code_order,
      jumlah_track,
      order_number,
      account,
      deadline,
      jumlah_revisi,
      order_type,
      offer_type,
      jenis_track,
      genre,
      price_normal,
      price_discount,
      discount,
      basic_price,
      gig_link,
      required_files,
      project_type,
      duration,
      reference_link,
      file_and_chat_link,
      detail_project
    } = req.body;
  
    try {
      // Query untuk menyimpan data
      const result = await client.query(
        `INSERT INTO data_marketing (
            card_id, input_by, acc_by, buyer_name, code_order, jumlah_track, order_number,
            account, deadline, jumlah_revisi, order_type, offer_type, jenis_track, genre, price_normal,
            price_discount, discount, basic_price, gig_link, required_files, project_type, duration, 
            reference_link, file_and_chat_link, detail_project
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24, $25
        ) RETURNING marketing_id`,
        [
        //   marketing_id,
          card_id,
          input_by,
          acc_by,
          buyer_name,
          code_order,
          jumlah_track,
          order_number,
          account,
          deadline,
          jumlah_revisi,
          order_type,
          offer_type,
          jenis_track,
          genre,
          price_normal,
          price_discount,
          discount,
          basic_price,
          gig_link,
          required_files,
          project_type,
          duration,
          reference_link,
          file_and_chat_link,
          detail_project
        ]
      );
  
    // Mengembalikan ID dari marketing yang baru ditambahkan
    const newMarketingId = result.rows[0].marketing_id;

      // Mengembalikan hasil query jika berhasil
      res.status(201).json({
        message: 'Data inserted successfully',
        data: result.rows[0],
        marketing_id: newMarketingId,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error inserting data', error: err.message });
    }
  });

  //mengupdate data 
  app.put('/api/marketing/:marketing_id', async(req,res)=>{
    const {marketing_id} = req.params;
    const{
        card_id,
        input_by,
        acc_by,
        buyer_name,
        code_order,
        jumlah_track,
        order_number,
        account,
        deadline,
        jumlah_revisi,
        order_type,
        offer_type,
        jenis_track,
        genre,
        price_normal,
        price_discount,
        discount,
        basic_price,
        gig_link,
        required_files,
        project_type,
        duration,
        reference_link,
        file_and_chat_link,
        detail_project
    } = req.body;
    try{
        const result = await client.query(
            `UPDATE data_marketing
            SET
                card_id = $1,
                input_by = $2,
                acc_by = $3,
                buyer_name = $4,
                code_order = $5,
                jumlah_track = $6,
                order_number = $7,
                account = $8,
                deadline = $9,
                jumlah_revisi = $10,
                order_type = $11,
                offer_type = $12,
                jenis_track = $13,
                genre = $14,
                price_normal = $15,
                price_discount = $16,
                discount = $17,
                basic_price = $18,
                gig_link = $19,
                required_files = $20,
                project_type = $21,
                duration = $22,
                reference_link = $23,
                file_and_chat_link = $24,
                detail_project =$25
            WHERE marketing_id = $26
            RETURNING * `,
            [
                card_id,
                input_by,
                acc_by,
                buyer_name,
                code_order,
                jumlah_track,
                order_number,
                account,
                deadline,
                jumlah_revisi,
                order_type,
                offer_type,
                jenis_track,
                genre,
                price_normal,
                price_discount,
                discount,
                basic_price,
                gig_link,
                required_files,
                project_type,
                duration,
                reference_link,
                file_and_chat_link,
                detail_project,
                marketing_id
            ]
        );
        res.status(200).json(result.rows[0]);
      }catch(err){
        console.error('Error updating market data', err.stack);
        res.status(500).send('Server Error');
      }
  })
//menampilkan marketing data by id
app.get('/api/marketing/:marketing_id', async(req,res)=>{
    const {marketing_id} = req.params;

    try{
        const result = await client.query('SELECT * FROM data_marketing WHERE marketing_id = $1', [marketing_id]);
        if(result.rows.length === 0){
            return res.status(404).send(`Data marketing dengan id ${marketing_id} tidak ditemukan`);
        }
        res.json(result.rows);
    }catch(err){
        console.error('Error fetching marketing data', err.stack);
        res.status(500).send('Server Error');
    }
})

//mengambil data marketing berdasarkan card_id
app.get('/api/marketing/card/:card_id', async(req,res)=>{
    const {card_id} = req.params;

    try{
        const result = await client.query('SELECT * FROM data_marketing WHERE card_id = $1', [card_id]);
        if(result.rows.length === 0){
            return res.status(404).send(`Data marketing dengan card_id ${card_id} tidak ditemukan`);
        }
        res.json(result.rows);
    }catch(error){
        console.error('Error fetching marketing data', error);
        res.status(500).send('Server Error');
    }
})

// //menampilkan data marketing yang memiliki id yang sama dengan card id
// app.get('/api/marketing/byCard/:card_id', async(req,res)=>{
//     const {card_id} = req.params;
//     try{
//         const result = await client.query('SELECT * FROM data_marketing WHERE card_id = $1', [card_id]);
//         if(result.rows.length === 0){
//             return res.status(404).send(`Data marketing dengan id ${card_id} tidak ditem`);
//         }
//         res.json(result.rows);
//     }catch(err){
//         console.error('Error fetching marketing data', err.stack);
//         res.status(500).send('Server Error');
//     }
// })

//archive data marketing
// app.post('/api/marketing/archive/:id', async(req,res)=>{
//     const {id} = req.params;
//     console.log('Archive Marketing with id', id);
//     try{
//         const result = await client.query(`
//                 INSERT INTO archive (entity_type, entity_id, )
//             `)
//     }
// })

//archive data marketing
app.post('/api/marketing/archive/:id_marketing', async(req,res)=>{
    const {id_marketing} = req.params;

    //Validasi ID
    if(!id_marketing || isNaN(parseInt(id_marketing))){
        return res.status(400).send('Invalid marketing ID');
    }
    try{
        //masukkan data ke tabel archive
        const archiveResult = await client.query(
            `
                INSERT INTO archive (entity_type, entity_id, name, description, parent_id, parent_type)
                SELECT 'marketing', marketing_id, buyer_name,
                 CONCAT('Order: ', order_number, ', Type: ', order_type, ', Genre: ', genre),
                 card_id, 'card'
                FROM data_marketing
                WHERE marketing_id = $1
                RETURNING entity_id;
            `,
            [id_marketing]
        );

        //Jika data ditemukan, hapus dari tabel marketing
        if(archiveResult.rowCount > 0){
            await client.query('DELETE FROM data_marketing WHERE marketing_id = $1', [id_marketing]);
            res.status(200).send(`Marketing dengan ID ${id_marketing} telah berhasil diarsipkan`);
        }else{
            res.status(404).send(`Marekting dengan ID ${id_marketing} tidak ditemukan`);
        }
    }catch(error){
        console.error('Error archiving marketing data', error.stack);
        res.status(500).send('Server Error saat mengarsipkan data marketing!');
    }
})


app.get('/api/cardDetails/:card_id', async (req, res) => {
    const { card_id } = req.params;
    try {
        // Ambil data card
        const cardResult = await client.query('SELECT * FROM cards WHERE card_id = $1', [card_id]);

        // Jika tidak ada card
        if (cardResult.rows.length === 0) {
            return res.status(404).send(`Card dengan id ${card_id} tidak ditemukan`);
        }

        // Ambil data marketing berdasarkan card_id
        const marketingResult = await client.query('SELECT * FROM data_marketing WHERE card_id = $1', [card_id]);

        res.json({
            card: cardResult.rows[0], // Mengambil card pertama, karena card_id seharusnya unik
            marketing: marketingResult.rows // Mengambil semua data marketing yang sesuai
        });
    } catch (err) {
        console.error('Error fetching card and marketing data', err.stack);
        res.status(500).send('Server Error');
    }
});


//delete data marketing
app.delete('/api/marketing/:marketing_id', async(req,res)=>{
    const {marketing_id} = req.params;
    try{
        const result = await client.query('DELETE FROM data_marketing WHERE marketing_id = $1', [marketing_id]);

        if(result.rowCount > 0){
            return res.status(200).send(`Data marketing dengan id ${marketing_id} berhasil dihapus`);
        }else{
            res.status(404).send(`data marketinf with id ${marketing_id} tidak ditemukan`);
        }
    }catch(err){
        console.error('Error fetching marketing data', err.stack);
        res.status(500).send('Server Error');
    }
})

//join data card and marketing
app.get('/api/cards-marketing/:cardId', async(req,res)=>{
    const {cardId} = req.params;

   try{
    const result = await client.query(`
        SELECT  
        cards.id AS card_id,
        cards.title,
        cards.description,
        data_marketing.marketing_id,
        data_marketing.input_by,
        data_marketing.acc_by,
        data_marketing.buyer_name,
        data_marketing.code_order,
        data_marketing.jumlah_track,
        data_marketing.order_number,
        data_marketing.account,
        data_marketing.deadline,
        data_marketing.jumlah_revisi,
        data_marketing.order_type,
        data_marketing.offer_type,
        data_marketing.jenis_track,
        data_marketing.genre,
        data_marketing.price_normal,
        data_marketing.price_discount,
        data_marketing.discount,
        data_marketing.basic_price,
        data_marketing.gig_link,
        data_marketing.required_files,
        data_marketing.project_type,
        data_marketing.duration,
        data_marketing.reference_link,
        data_marketing.file_and_chat_link,
        data_marketing.detail_project
        FROM
            cards
        LEFT JOIN
            data_marketing ON cards.id = data_marketing.card_id
        WHERE
            cards.id = $1`, [cardId]
        );
        if(result.rows.length === 0){
            return res.status(400).json({message:'Card not found'})
        }
        res.json(result.rows[0]);
   }catch(err){
    console.error(err);
    res.status(500).json({message:'Internal server error'});
   }

})

//data_marketing to card
app.post('/api/generate-cards', async(req,res)=>{
    try{
        const query = `
            INSERT INTO cards (list_idm title_description, position, due_data)
            SELECT
                $1 AS list_id,
                buyer_name AS title,
                detail_project AS description,
                ROW_NUMBER() OVER (ORDER BY marketing_id) AS position,
                deadline AD due_date
            FROM data_marketing
            WHERE deadline IS NOT NULL
        `
        const listId = req.body.listId || 1;
        await client.query(query,[listId]);
        req.status(201).json({message:'Cards generated successfully'});
    }catch(error){
        console.error(err);
        req.status(500).json({error: 'Failed to generate cards'});
    }
})

 

//text cover using postgres
app.get('/api/label-test', async(req,res)=>{
    try{
        const response = await client.query('SELECT * FROM cover');
        res.json(response.rows);
    }catch(error){
        console.error('Error fetch data cover', error);
        res.status(500).send('Server error');
    }
})


//upload image to cloudinary

// app.post('/upload', upload.single('image'), (req,res)=>{
//     try{
//         const imageUrl = req.file.path;
//         res.json({
//             message:'File uploaded successfuly',
//             url: imageUrl
//         })
//     }catch(error){
//         res.status(500).json({error: error.message});
//     }
// })


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//endpoin untuk menyimpa url dari unggahan image dari pengguna -> works
app.post('/api/upload-image', upload.single('image'), async(req,res)=>{
    console.log('request diterima pada endpoin ini');
    if(!req.file){
        return res.status(400).json({message:'No file uploaded'});
    }
    try{
        const imageUrl = req.file.path;
        const query = 'INSERT INTO images (image_url) VALUES ($1) RETURNING *';
        const values = [imageUrl];

        const result = await client.query(query,values);
        const savedImage = result.rows[0];

        res.json({
            message: 'Image uploaded and URL saved successfully.',
            image: savedImage,
        })
    }catch(error){
        console.error('Error uploading image from your device:', error);
        res.status(500).json({message:'error uploading image', error})
    }
})

//get all images upload 
app.get('/api/upload-images', async(req,res)=>{
    try{
        const resul = await client.query('SELECT * FROM images');
        res.json(resul.rows);
    }catch(error){
        console.error('Error fetching images:', error);
        res.status(500).json({message:'error fetching images', error})
    }
})

//get images by id
app.get('/api/upload-images/:image_id', async(req,res)=>{
    const {image_id} = req.params;
    try{
        const result = await client.query('SELECT * FROM images WHERE image_id = $1', [image_id]);
        if(result.rows.length === 0){
            return res.status(404).send('image not found');
        }
        res.json(result.rows);
    }catch(err){
        console.error('Error executing query:', err);
        res.status(500).json({message:'error fetching image', error});
    }
})

// EXAMPLE FOR NEW DATA COVER 

app.get('/api/cover-cards', async(req,res)=>{
    try{
        const result = await client.query('SELECT * FROM cover');
        res.json(result.rows);
    }catch(error){
        console.error('Error fetching cover cards:', error);
        res.status(500).send({message:'error fetching cover cards', error})
    }
});

// app.put('/api/cards/:id/cover', async(req,res)=>{
//     const {cardId} = req.params;
//     const {cover_id} = req.body;
//     try{
//         await client.query('UPDATE card SET cover_id = $1 WHERE id = $2', [cover_id, cardId]);
//         res.send('Cover successfully saved to card');
//     }catch(error){
//         console.error('Error updating card cover:', error);
//         res.status(500).send('Server error');
//     }
// })
app.put('/api/cards/:id/cover', async(req,res)=>{
    const {id:cardId} = req.params;
    const {cover_id} = req.body;

    if(!cover_id){
        return res.status(400).send('cover_id is required')
    }

    try {
        const result = await client.query(
            'UPDATE card SET cover_id = $1 WHERE id = $2 RETURNING *',
            [cover_id, cardId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Card not found');
        }

        res.status(200).json({
            message: 'Cover successfully updated',
            updatedCard: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating cover_id:', error);
        res.status(500).send('Internal server error');
    }
})

app.get('/api/cards/:id/cover', async(req,res)=>{
    const {id} = req.params;
    try{
        const result = await client.query('SELECT cover_id FROM cards WHERE id = $1', [id]);
        console.log(result.rows);

        if(result.rows.length === 0 ){
            return res.status(404).json({message: `Cover with ID ${id} not found` })
        }

        const coverId = result.rows[0].cover_id;

        const coverResult = await client.query('SELECT * FROM cover WHERE id = $1', [coverId]);

        if(coverResult.rows.length === 0){
            return res.status(404).json({message:'Cover not found'});
        }

        res.json(coverResult.rows[0]);
    }catch(error){
        console.error('Error fetching card cover:', error);
        res.status(500).send('Server error');
    }
})

//text editor
//menyimpan text editor yang dimasukkan/diimputkan
app.post('/api/card-descriptions/:card_id', async(req,res)=>{
    const {card_id} = req.params;
    const {description} = req.body;
    try{
        const result = await client.query(
            'INSERT INTO card_descriptions (card_id, description) VALUES ($1,$2) RETURNING *',
            [card_id, description]
        );
        res.status(201).json(result.rows[0]);
    }catch(error){
        res.status(500).send('Error adding descriptions')
    }
});

//mengambil dan menampilkan text editor yang sudah disimpan berdasarkan card id
app.get('/api/card-descriptions/:card_id', async(req,res)=>{
    const {card_id} = req.params;
    try{
        const result = await client.query(
            'SELECT * FROM card_descriptions WHERE card_id = $1',
            [card_id]
        );
        if(result.rows.length === 0){
            return res.status(404).send('Description not found');
        }
        res.status(200).json(result.rows[0]);
    }catch(error){
        res.status(500).send('Error fetching descriptions')
    }
})

//mengambil dan menampilkan semua text editor
app.get('/api/card-descriptions', async(req,res)=>{
    try{
        const result = await client.query(
            'SELECT * FROM card_descriptions'
        )
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Error fetching descriptions:', error);
        res.status(500).send('Error fetching descriptions')
    }
})

//mengubah/mengedit text editor yang sudah disimpan
app.put('/api/card-descriptions/:card_id', async(req,res)=>{
    const {card_id} = req.params;
    const {description} = req.body;
    try{
        const result = await client.query(
            'UPDATE card_descriptions SET description = $1, updated_at = CURRENT_TIMESTAMP WHERE card_id = $2 RETURNING *',
            [description, card_id]
        );
        res.status(200).json(result.rows[0]);
    }catch(error){
        res.status(500).send('Error updating description');
    }
});

//menghapus text editor yang sudah disimpan
app.delete('/api/card-descriptions/:card_id', async(req,res)=>{
    const {card_id} = req.params;
    try{
        const result = await client.query(
            'DELETE FROM card_descriptions WHERE card_id = $1 RETURNING *',
            [card_id]
        );
        if(result.rowCount === 0){
            return res.status(404).send('Description not found');
        }
        res.status(200).send('Description delete successfully');
    }catch(error){
        res.status(500).send('Error deleting description');
    }
})

//end text editor

//Checklist endpoin
//mengambil dan menampilkan semua checklist berdasarkan card_id
app.get('/api/checklist/:card_id', async(req,res)=>{
    const {card_id} = req.params;
    try{
        const result = await client.query(
            'SELECT * FROM checklists WHERE card_id = $1',
            [card_id]
        );
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Error fetching checklist:', error);
        res.status(500).send('Error fetching chceklists')
    }
});

//mengambil dan menampilkan semua checklist item berdasarkan checklist_id
app.get('/api/checklist-items/:checklist_id', async(req,res)=>{
    const {checklist_id} = req.params;
    try{
        const result = await client.query(
            'SELECT * FROM checklist_items WHERE checklist_id = $1',
            [checklist_id]
        );
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Error fetching checklist items:', error);
        res.status(500).send('Error fetching checklist items');
    }
});

//membuat checklist baru
app.post('/api/checklist', async(req,res)=>{
    const {card_id, name} = req.body;

    if (!card_id || !name) {
        return res.status(400).send('card_id and name are required');
    }
    try{
        const result = await client.query(
            `INSERT INTO checklists (card_id, name) VALUES ($1, $2) RETURNING *`,
            [card_id, name]
        );
        res.status(201).json(result.rows[0]);
    }catch(error){
        console.error('Error adding checklist:', error);
        res.status(500).send('Error adding checklist');
    }
});

//membuat checklist items baru
app.post('/api/checklist-items', async (req, res) => {
    const { checklist_id, description, is_checked } = req.body;
    try {
        // Menambahkan checklist item baru
        const result = await client.query(
            `INSERT INTO checklist_items (checklist_id, description, is_checked) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [checklist_id, description, is_checked]
        );
        // Mengirimkan item baru yang telah ditambahkan
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding checklist item:', error);
        res.status(500).send('Error adding checklist item');
    }
});

//mengubah data checklist
app.put('/api/checklist/:id', async(req,res)=>{
    const {id} = req.params;
    const {name} = req.body;
    try{
        const result = await client.query(
            `UPDATE checklists 
             SET  name = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 RETURNING *`,
            [name, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Checklist not found" });
        }

        res.status(200).json({ message: "Checklist updated successfully", data: result.rows[0] });
    }catch(error){
        console.error(error);
        res.status(500).send('Error updating checklist');
    }
})


//mengubah data checklist items
app.put('/api/checklist-items/:itemId', async(req,res)=>{
    const {itemId} = req.params;
    const {is_checked} = req.body;
    try{
        const result = await client.query(
            `UPDATE checklist_items SET is_checked = $1 WHERE id = $2 RETURNING *`,
            [is_checked, itemId]
        );
        res.status(200).json(result.rows[0]);
    }catch(error){
        console.error('Error updating checklist item:', error);
        res.status(500).send('Error updating checklist item');
    }
});

//delete data checklist items
app.delete('/api/checklist-items/:id', async(req,res)=>{
    const {id} = req.params;
    try{
        await client.query(
            `DELETE FROM checklist_items WHERE id = $1`,
            [id]
        );
        res.status(204).send();
    }catch(error){
        console.error('Error deleting checklist item:', error);
        res.status(500).send('Error deleting checklist item');
    }
})

//delete data checklist
app.delete('/api/checklist/:id', async(req,res)=>{
    const {id} = req.params;
    try {
        await client.query(
            `DELETE FROM checklist_items WHERE checklist_id = $1`, 
            [id]
        );
        await client.query(
            `DELETE FROM checklists WHERE id = $1`, 
            [id]
        );
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting checklist:', error);
        res.status(500).send('Error deleting checklist');
    }
})

//end checklist endpoin

//DISCUSSION SECTION
//Connection -> belum di cek pengujiaanya di postman
io.on('connection', (socket)=>{
    console.log('New client connected');
    
    socket.on('send_message',(data)=>{
        io.emit('receive_message', data);
    });

    socket.on('disconnect', ()=>{
        console.log('Client disconnected');
    });
})

//untuk mendapatkan pesan -> id adalah id dari tabel teams
app.get('/api/messages/:id', async(req,res)=>{
    const{id} = req.params;
    try{
        const result = await client.query(
            'SELECT m.id, m.content, m.timestamp, u.username FROM messages m JOIN users u ON m.user_id = u.id WHERE m.team_id = $1 ORDER BY m.timestamp ASC',
            [id]
        );
        res.status(200).json(result.rows);
    }catch(error){
        res.status(500).json({error: 'Failed to fetch messages'});
    }
})

//endpoin untuk mengirim pesan
app.post('/api/messages', async (req, res) => {
    const { teamId, userId, content } = req.body;
  
    // Check if all fields are provided
    if (!teamId || !userId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      // Insert the message into the database
      await client.query(
        'INSERT INTO messages (team_id, user_id, content) VALUES ($1, $2, $3)',
        [teamId, userId, content]
      );
      res.status(201).json({ message: 'Message sent' });
    } catch (err) {
      console.error('Error inserting message:', err);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });
  
//END DISSCUTION SECTION



app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });

  //Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio assumenda porro alias nobis nesciunt! Ullam aut possimus aperiam totam consectetur!