const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('./connection')
const router = express.Router();

//REGISTRASI
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await client.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error('Registration Error:', err)
        res.status(500).json({ error: 'Failed to register user' });
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rowCount === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.rows[0].id, username: user.rows[0].username }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Failed to log in' });
    }
});

//LOGOUT
router.post('/logout', (req, res)=>{
    res.send('Logged out')
})

module.exports = router;

/*


*/