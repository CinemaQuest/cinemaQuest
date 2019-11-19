'use strict';

require('ejs');
require('dotenv').config();

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

let movieArr = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

///////////////////////////////////////////////////////////////////////////////////////////////////Routes//////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', findMovies); //find a movie to watch

app.get('/search', (req, res) => {
  res.render('pages/searches/new')
})
app.post('/searches', movieHandler);

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

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function movieHandler(req, res) {
  for (let i = 1; i < 4; i++) {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${i}&with_original_language=en&vote_average.gte=7&vote_average.lte=10`;

    let randomNumber = randomNum(0,19)
    if ((typeof req.body.search) === 'object') {
      const genre = req.body.search.join(',')
      url += `with_genres=${genre}`;
    } else if ((typeof req.body.search) === 'string') {
      const genre = req.body.search
      url += `with_genres=${genre}`;
    }

    superagent.get(url)
      .then(data => { 
        return new Movie(data.body.results[randomNumber])})
      // .then(movieArr => { res.render('pages/searches/show'), {movies: movieArr} })
      .catch(() => res.render('pages/error'))
  }
  console.log('movieArr',movieArr);
  res.render('pages/searches/show');
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

//constructor function
function Movie(film) {
  this.poster_path = `http://image.tmdb.org/t/p/w342/${film.poster_path}`;
  this.title = film.title;
  this.vote_average = film.vote_average;
  this.release_date = new Date(film.release_date);
  movieArr.push(this);
}

app.listen(PORT, () => console.log(`LiStEnInG oN pOrT ${PORT}`));
