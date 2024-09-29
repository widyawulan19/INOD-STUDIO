
//6. Duplikasi card berdasarkan ID
app.post('/api/cards/:id/duplicate', async (req, res) => {
    const { id } = req.params;

    try {
        // Mendapatkan data card berdasarkan ID
        const card = await client.query('SELECT * FROM cards WHERE id = $1', [id]);

        if (card.rows.length === 0) {
            return res.status(404).send('Card tidak ditemukan');
        }

        const { name, description, list_id, board_id } = card.rows[0];

        // Menambahkan card duplikat ke tabel cards
        const duplicateCard = await client.query(
            'INSERT INTO cards (name, description, list_id, board_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [`${name} (Copy)`, description, list_id, board_id]
        );

        res.status(201).json(duplicateCard.rows[0]);
    } catch (err) {
        console.error('Error duplicating card', err.stack);
        res.status(500).send('Server Error');
    }
});