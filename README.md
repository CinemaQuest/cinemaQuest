# Code Fellows 301d53 Team Params - Cinema Quest

- [Cinema Quest Heroku deployment](https://cinema-quest.herokuapp.com/)

## Team Params members:
- Terrell
- Ran
- Sean
- Kevin

## Project description
Cinema Quest is an application that takes searching out of picking the movie you want to watch.  

Want to watch a movie tonight and want us to narrow the search down for you? Then you are in the right place!

### User Stories

* As a user I want an application that picks a movie for me that meet some simple criteria that I have choosen and lets me save to a list.

* As a user I want an application that lets me comment of the movies I have added to my list and delete them when I no longer want them in my list.

* As a user I want an application that also selects a local restarant to go with my movie.

## Tools used
- JavaScript
  - [Node.js](https://nodejs.org/en/)
    - [express](https://www.npmjs.com/package/express), [ejs](https://www.npmjs.com/package/ejs), [superagent](https://www.npmjs.com/package/superagent), [pg](https://www.npmjs.com/package/pg), [method-override](https://www.npmjs.com/package/method-override), [cors](https://www.npmjs.com/package/cors), [dotenv](https://www.npmjs.com/package/dotenv)
- HTML and CSS
- [PostgreSQL](https://www.postgresql.org/)
- [Heroku](https://www.heroku.com/home)
- Git and [GitHub](https://github.com/)
- [MovieDB API](https://developers.themoviedb.org/3/getting-started/introduction)
- [Zomato API](https://developers.zomato.com/api)

## To run
These instructions assume you have **Node.js**, **psql** and **git** installed and properly setup on your system.
- Clone the repo to your local system
- Run `npm i` inside your local repo 
- Create a database in psql with `createdb <PSQL Database Name>`
- Create the database table by running the the schema.sql, `psql -f schema.sql -d <PSQL Database Name>`
- create a .env file based on the sample.env file
- Start the express server, `node start`
- In a browser go to `http://localhost:<port number>/`

## API Endpoints

- Movie DB API Call
```
https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${i}&with_original_language=en&vote_average.gte=${req.body.scoreMin}&vote_average.lte=${req.body.scoreMax}&vote_count.gte=150&with_genres=genres
```

With an API key, i = 1, scoreMin = 7, scoreMax = 10, and genres=36, returns;

```JSON
{
"page": 1,
"total_results": 122,
"total_pages": 7,
"results": [
{
"popularity": 100.559,
"vote_count": 232,
"video": false,
"poster_path": "/6ApDtO7xaWAfPqfi2IARXIzj8QS.jpg",
"id": 359724,
"adult": false,
"backdrop_path": "/n3UanIvmnBlH531pykuzNs4LbH6.jpg",
"original_language": "en",
"original_title": "Ford v Ferrari",
"genre_ids": [
28,
18,
36
],
"title": "Ford v Ferrari",
"vote_average": 8.1,
"overview": "American car designer Carroll Shelby and the British-born driver Ken Miles work together to battle corporate interference, the laws of physics, and their own personal demons to build a revolutionary race car for Ford Motor Company and take on the dominating race cars of Enzo Ferrari at the 24 Hours of Le Mans in France in 1966.",
"release_date": "2019-10-10"
},
```

- Zomato API Call
```
https://developers.zomato.com/api/v2.1/search?lat=47.606209&lon=-122.332069
```
with a header
```
--header "user-key: ${process.env.ZOMATO_API_KEY}"
```
returns;
```JSON
{
  "results_found": 9418,
  "results_start": 0,
  "results_shown": 20,
  "restaurants": [
    {
      "restaurant": {
        "R": {
          "has_menu_status": {
            "delivery": -1,
            "takeaway": -1
          },
          "res_id": 16718458
        },
        "apikey": "your_api_key",
        "id": "16718458",
        "name": "Paseo",
        "url": "https://www.zomato.com/seattle/paseo-fremont?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1",
        "location": {
          "address": "4225 Fremont Avenue N, Seattle 98103",
          "locality": "Fremont",
          "city": "Seattle",
          "city_id": 279,
          "latitude": "47.6585111111",
          "longitude": "-122.3499611111",
          "zipcode": "98103",
          "country_id": 216,
          "locality_verbose": "Fremont, Seattle"
        },
```

## DataBase Schema

```SQL
DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  overview TEXT,
  thumbnail VARCHAR(255),
  release_date VARCHAR(255),
  vote_average VARCHAR(255),
  comment TEXT
);
```