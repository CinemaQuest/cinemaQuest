'use strict';

require('ejs');
require('dotenv').config();

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//////////////////////////////////////////////////////////////////////////////////////////////////Routes//////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', findMovies); //find a movie to watch
app.get('/newMovie', newMovieSearch);
app.get('/showMovie', showMyMovie);
app.get('/aboutUs', aboutUsPage);


function newMovieSearch(req, res) {
  res.render('../views/pages/searches/new');
}

function showMyMovie(req, res) {
  res.render('../views/pages/searches/show');
}

function aboutUsPage(req, res) {
  res.render('../views/pages/searches/about');
}


function findMovies(req, res) {
  let SQL = 'SELECT * FROM movies;';
  return client.query(SQL)
    .then(results => res.render('../index.ejs', {
      results: results.rows
    }))
    .catch(() => {
      res.render('pages/error');
    })
}

app.listen(PORT, () => console.log(`LiStEnInG oN pOrT ${PORT}`));
