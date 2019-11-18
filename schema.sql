DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  overview TEXT,
  thumbnail VARCHAR(255),
  release_date VARCHAR(255),
  vote_average VARCHAR(255),
);

INSERT INTO movies (title, overview, thumbnail, release_date, vote_average);
