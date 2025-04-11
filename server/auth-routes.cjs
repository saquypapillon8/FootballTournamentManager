const express = require('express');
const { register, login } = require('./auth.cjs');

const router = express.Router();

router.post('/register', async (req, res) => {
    console.log('Received body:', req.body); // Ajoutez ce log
    try {
      const result = await register(req.body.username, req.body.password);
      console.log('Registration result:', result); // Ajoutez ce log
      res.status(201).send('User created');
    } catch (error) {
      console.error('Registration error:', error); // Ajoutez ce log
      res.status(400).send(error.message);
    }
  });

// ... (garder le reste inchangé)

module.exports = router;