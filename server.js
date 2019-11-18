'use strict';

require('ejs');
require('dotenv').config();

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);
// client.connect();
client.on('error', err => console.error(err));



app.listen(PORT, () => console.log(`LiStEnInG oN pOrT ${PORT}`));
