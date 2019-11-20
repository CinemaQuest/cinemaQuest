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

////////////////////////////////////////////////////////////////////////////////////////////////////Routes////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', findMovies); //find a movie to watch

app.get('/search', (req, res) => {
  res.render('pages/searches/new')
})
app.post('/searches', movieHandler);
app.get('/newMovie', newMovieSearch);
app.post('/add', addmovie);
app.get('/showMovie', showMyMovie);
app.get('/aboutUs', aboutUsPage);


function newMovieSearch(req, res) {
  res.render('../views/pages/searches/new');
}

function showMyMovie(req, res) {
  let SQL = 'SELECT * FROM movies;';
  movieArr = [];
  client.query(SQL)
    .then(results => {
      results.rows.map(ele => movieArr.push(ele));
      res.render('../views/pages/movies/list', { displayData: movieArr});
    })
    .catch(() => {
      res.render('pages/error');
    })
  // res.render('../views/pages/movies/list', { displayData: movieArr});
}

function aboutUsPage(req, res) {
  res.render('../views/pages/searches/about');
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function movieHandler(req, res) {

  // let array = [];
  // for (let i = 1; i < 4; i++) {
  const i = 1;
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${i}&with_original_language=en&vote_average.gte=8&vote_average.lte=9.9`;

  if ((typeof req.body.search) === 'object') {
    const genre = req.body.search.join(',')
    url += `&with_genres=${genre}`;
  } else if ((typeof req.body.search) === 'string') {
    const genre = req.body.search
    url += `&with_genres=${genre}`;
  }
  let randomNumber;
  superagent.get(url)
    .then(data => {
      console.log('data.body.total_results',typeof(data.body.total_results))
      if (data.body.total_pages === 1) {
        randomNumber = randomNum(0,data.body.total_results-1);
        let array = new Movie(data.body.results[randomNumber])
        res.render('pages/searches/show', { displayData: array})
      } else {
        randomNumber = randomNum(0,19);
        let array = new Movie(data.body.results[randomNumber])
        res.render('pages/searches/show', { displayData: array})
      }
    })
    .catch(() => {
      res.render('pages/noresults')
    })
}

function findMovies(req, res) {
  // let SQL = 'SELECT * FROM movies;';
  res.render('../index.ejs')
  // return client.query(SQL)
  //   .then(results => res.render('../index.ejs', {
  //     results: results.rows
  //   }))
  //   .catch(() => {
  //     res.render('pages/error');
  //   })
}

function addmovie(req,res) {
  // console.log('req.body',req.body);
  let {title, vote_average, overview, poster_path, release_date} = req.body;
  let SQL = 'INSERT into movies(title, overview, thumbnail, release_date, vote_average) VALUES ($1, $2, $3, $4, $5);';
  let values = [title, overview, poster_path, release_date, vote_average];
  return client.query(SQL, values)
    .then(res.redirect('/'))
    .catch(err => console.error(err))
}

//constructor function
function Movie(film) {
  this.poster_path = `http://image.tmdb.org/t/p/w342/${film.poster_path}`;
  this.title = film.title;
  this.overview = film.overview;
  this.vote_average = film.vote_average;
  this.release_date = new Date(film.release_date);
  this.genre_ids = film.genre_ids;
  movieArr.push(this);
}

app.listen(PORT, () => console.log(`LiStEnInG oN pOrT ${PORT}`));
