'use strict';

require('ejs');
require('dotenv').config();

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;

let movieArr = []; //Holds movie object
let resultsArr = []; //Holds single movie object and single foodApi object
let randomNumber;

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
app.post('/food', foodHandler);
app.get('/showMovie', showMyMovie);
app.get('/aboutUs', aboutUsPage);

app.use(methodOverride ((req,res) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body){
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

function newMovieSearch(req, res) {
  res.render('../views/pages/searches/new');
}

function showMyMovie(req, res) {
  let SQL = 'SELECT * FROM movies;';
  client.query(SQL)
    .then(results => {
      res.render('../views/pages/movies/list', { displayData: results.rows});
    })
    .catch(() => {
      res.render('pages/error');
    })
}
app.get('/showMovie/:id', (req,res) => {
  let SQL = `SELECT * FROM movies WHERE id = $1;`;
  let values = [req.params.id];
  client.query(SQL,values)
    .then(results =>{
      res.render('../views/pages/movies/list', { displayData: results.rows})
    })
    .catch(() => {
      res.render('pages/error');
    })
});

app.delete('/showMovie/:id', (req,res) => {
  let SQL = `DELETE FROM movies WHERE id = $1;`;
  let values = [req.params.id];
  client.query(SQL,values)
    .then(res.redirect('/showMovie'))
    .catch(err => console.error(err))
});

app.put('/update/:id',(req,res)=>{
  let comment = req.body.comment;
  let SQL = 'UPDATE movies SET comment=$1 WHERE id=$2;';
  let values = [comment, req.params.id];  
  client.query(SQL, values)
    .then(res.redirect('/showMovie'))
    .catch(err => console.error(err))
})



function aboutUsPage(req, res) {
  res.render('../views/pages/searches/about');
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function movieHandler(req, res) {

  const i = 1;
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${i}&with_original_language=en&vote_average.gte=7&vote_average.lte=10`;
  
  console.log('min',req.body.scoreMin)

  if ((typeof req.body.search) === 'object') {
    const genre = req.body.search.join(',')
    url += `&with_genres=${genre}`;
  } else if ((typeof req.body.search) === 'string') {
    const genre = req.body.search
    url += `&with_genres=${genre}`;
  }

  superagent.get(url)
    .then(data => {
      if (data.body.total_pages === 1) {
        randomNumber = randomNum(0,data.body.total_results-1);
        resultsArr[0] = new Movie(data.body.results[randomNumber])
      } else {
        randomNumber = randomNum(0,19);
        resultsArr[0] = new Movie(data.body.results[randomNumber])
      }
      console.log('result', resultsArr);
    })
    .then(res.render('pages/searches/show', { displayData: resultsArr}))
    .catch(() => {
      res.render('pages/noresults')
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
function foodHandler(req, res) {

  let foodUrl = `https://developers.zomato.com/api/v2.1/cuisines?city_id=279&lat=47.606209&lon=122.332069`;

  superagent.get(foodUrl)
    .set('user-key', `${process.env.ZOMATO_API_KEY}`)
    .then(data => {
      console.log('data',data);
      let array = [];
      array[0] = new Food(data.body.results)
      res.render('pages/searches/food', { foodData: array })
    })
    .catch(() => res.render('pages/error'))
}

function findMovies(req, res) {
  res.render('../index.ejs')
}

function addmovie(req,res) {
  let {title, vote_average, overview, poster_path, release_date} = req.body;
  let SQL = 'INSERT into movies(title, overview, thumbnail, release_date, vote_average) VALUES ($1, $2, $3, $4, $5);';
  let values = [title, overview, poster_path, release_date, vote_average];
  return client.query(SQL, values)
    .then(res.redirect('/showMovie'))
    .catch(err => console.error(err))
}

//constructor function
function Movie(film) {
  this.poster_path = `http://image.tmdb.org/t/p/w342/${film.poster_path}`;
  this.title = film.title;
  this.overview = film.overview;
  this.vote_average = film.vote_average;
  this.release_date = film.release_date;
  this.genre_ids = film.genre_ids;
  movieArr.push(this);
}

function Food(meal) {
  this.featured_image = meal.featured_image;
  this.name = meal.name;
  this.phone_numbers = meal.phone_numbers;
  this.menu_url = meal.menu_url;
}

app.listen(PORT, () => console.log(`LiStEnInG oN pOrT ${PORT}`));
