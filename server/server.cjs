const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./auth-routes.cjs');

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

// Ajoutez ceci à la fin du fichier :
app.listen(3001, () => console.log('Server running on port 3001'));