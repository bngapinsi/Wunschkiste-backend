require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const routes = require('./routes');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/', routes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.DB_CONNECTION)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server started and listening on port ${PORT} ... `);
    }
});