'use strict';

// application dependencies
require('ejs');
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;

// global vars
let movieArr = []; //Holds movie object
let resultsArr = []; //Holds single movie object and single foodApi object
let randomNumber;
let cityFood = 'seattle';
let foodCount = 20;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
///////////////////////Routes/////////////////////////////////////////////////////
app.get('/', findMovies); //find a movie to watch

app.get('/search', (req, res) => {
  res.render('pages/searches/new')
})
app.post('/searches', movieHandler);
app.get('/newMovie', newMovieSearch);
app.post('/add', addmovie);
// app.get('/food', foodHandler);
app.get('/showMovie', showMyMovie);
app.get('/aboutUs', aboutUsPage);


function newMovieSearch(req, res) {
  res.render('../views/pages/searches/new');
}

//show all movies in databse
function showMyMovie(req, res) {
  let SQL = 'SELECT * FROM movies;';
  client.query(SQL)
    .then(results => {
      res.render('../views/pages/movies/list', { displayData: results.rows });
    })
    .catch(() => {
      res.render('pages/error');
    })
}
// get a specific movie
app.get('/showMovie/:id', (req, res) => {
  let SQL = `SELECT * FROM movies WHERE id = $1;`;
  let values = [req.params.id];
  client.query(SQL, values)
    .then(results => {
      res.render('../views/pages/movies/list', { displayData: results.rows })
    })
    .catch(() => {
      res.render('pages/error');
    })
});
//delete specific movie
app.delete('/showMovie/:id', (req, res) => {
  let SQL = `DELETE FROM movies WHERE id = $1;`;
  let values = [req.params.id];
  client.query(SQL, values)
    .then(res.redirect('/showMovie'))
    .catch(err => console.error(err))
});
//update specific movie
app.put('/update/:id', (req, res) => {
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

//Movie DB API
function movieHandler(req, res) {

  const i = 1;
  const foodNum = randomNum(0, foodCount-1);

  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${i}&with_original_language=en&vote_average.gte=${req.body.scoreMin}&vote_average.lte=${req.body.scoreMax}&vote_count.gte=150`;

  let foodUrl = `https://developers.zomato.com/api/v2.1/search?q=seattle&start=2&count=20&sort=rating`;

  //if object it is multiple genres have to join, if string just use as is.
  if ((typeof req.body.search) === 'object') {
    const genre = req.body.search.join(',')
    url += `&with_genres=${genre}`;
  } else if ((typeof req.body.search) === 'string') {
    const genre = req.body.search
    url += `&with_genres=${genre}`;
  }
  //superagent call, making sure the request body has a certain amount of page before we render.
  superagent.get(url)
    .then(data => {

      if (data.body.total_pages === 1) {
        randomNumber = randomNum(0, data.body.total_results - 1);
        resultsArr[0] = new Movie(data.body.results[randomNumber])
      } else {
        randomNumber = randomNum(0, 19); 

        resultsArr[0] = new Movie(data.body.results[randomNumber])
      }
      superagent.get(foodUrl)
        .set('user-key', `${process.env.ZOMATO_API_KEY}`)
        .then(data => {
          console.log('MOVIE HANDLERS FOOD ROUTE:',data.body.restaurants)
          resultsArr[1] = new Food(data.body.restaurants[foodNum])
          console.log('resultsArr',resultsArr)
          res.render('pages/searches/show', { displayData: resultsArr })
        })
        .catch((err) => {
          console.log('FOOD URL', foodUrl)
          res.render('pages/error', err)
        })
    })
    .catch(() => {
      res.render('pages/noresults')
    })
}

///////zomato API making, rendering a random restaurant.
// function foodHandler(req, res) {

//   let foodUrl = `https://developers.zomato.com/api/v2.1/search?q=${cityFood}&count=20`;

//   superagent.get(foodUrl)
//     .set('user-key', `${process.env.ZOMATO_API_KEY}`)
//     .then(data => {
//       let array = []
//       const foodNum = randomNum(0, 19)
//       array[0] = new Food(data.body.restaurants[0])
//       res.render('pages/searches/food', { restData: array })
//     })
//     .catch(() => res.render('pages/error'))
// }

function findMovies(req, res) {
  res.render('../index.ejs')
}

// add movie to the database
function addmovie(req, res) {
  let { title, vote_average, overview, poster_path, release_date } = req.body;
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
  this.genre_ids = getGenreNameFromId(genres,film.genre_ids);
  movieArr.push(this);
}

// function that turns genre codes into genre strings (35 turns into "horror")
function getGenreNameFromId(arr, keyArr){
  let names = [];
  for(let i = 0; i < keyArr.length ; i++){
    arr.filter(e =>{
      if(e.id === keyArr[i]){
        names.push( e.name)
      }
    })
  }
  return names.join(', ')
}

function Food(meal) {
  this.name = meal.restaurant.name;
  this.menu_url = meal.restaurant.menu_url;
  this.city = meal.restaurant.location.city;
}

const genres = [
  {'id': 28,'name': 'Action'},{'id': 12,'name': 'Adventure'},{'id': 16,'name': 'Animation'},{'id': 35,'name': 'Comedy'},{'id': 80,'name': 'Crime'},{'id': 99,'name': 'Documentary'},
  {'id': 18,'name': 'Drama'},{'id': 10751,'name': 'Family'},{'id': 14,'name': 'Fantasy'},{'id': 36,'name': 'History'},{'id': 27,'name': 'Horror'},{'id': 10402,'name': 'Music'},
  {'id': 9648,'name': 'Mystery'},{'id': 10749,'name': 'Romance'},{'id': 878,'name': 'Science Fiction'},{'id': 10770,'name': 'TV Movie'},{'id': 53,'name': 'Thriller'},{'id': 10752,'name': 'War'},{'id': 37,'name': 'Western'}
]

app.listen(PORT, () => console.log(`LiStEnInG oN pOrT ${PORT}`));
