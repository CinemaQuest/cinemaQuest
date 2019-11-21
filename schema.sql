-- run the below to create your database
-- createdb cinema_quest
-- psql -d cinema_quest -f schema.sql

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

INSERT INTO movies (title, overview, thumbnail, release_date, vote_average, comment) VALUES (
  'My Awesome Title',
  'My awesome overview of this Awesome Movie',
  'Awesome_thumbnail_of_the_Awesome_Movie.png',
  '2099-12-31',
  '9.25',
  'this movie is awesome!!!'
);