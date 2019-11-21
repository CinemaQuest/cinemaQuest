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

With an API key, i = 1, scoreMin = 7, scoreMax = 10, and genres=35

- Zomato API Call
```
https://developers.zomato.com/api/v2.1/search?lat=47.606209&lon=-122.332069
```

