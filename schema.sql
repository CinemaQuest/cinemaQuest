DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  description TEXT,
  isbn VARCHAR(255),
  status VARCHAR(255),
  image_url VARCHAR(255),
  bookshelf VARCHAR(255),
  due DATE NOT NULL DEFAULT NOW()
);

INSERT INTO movies (author, title, isbn, image_url, description)