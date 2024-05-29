
/*
DEPENDENCIAS
eslint
npm install standard -D
npm install express -E 
npm install zod -E

npm install --save mysql2

http.cat // ESPECIFICACIONES DE LOS STATUS CODE
100-199:Informativas
200-299:Respuestas satisfactorias//200 OK
300-399:Redirecciones//301 Moved Permanently
400-499:Errores del cliente//400 Bad Request //404 Not Found
500-599:Errores del servidor//Internal server error





CREATE TABLE genero (
  	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE peliculas (
    id BINARY(16) PRIMARY KEY ,
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    director VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    poster TEXT,
    rate DECIMAL(2,1) UNSIGNED NOT NULL
);

CREATE TABLE pelicula_generos (
	pelicula_id BINARY(16) REFERENCES pelicula(id),
    genero_id INT REFERENCES genero(id),
    PRIMARY KEY (pelicula_id, genero_id)
);

DELIMITER $$

CREATE FUNCTION BIN_TO_UUID(b BINARY(16), f BOOLEAN)
RETURNS CHAR(36)
DETERMINISTIC
BEGIN
   DECLARE hexStr CHAR(32);
   SET hexStr = HEX(b);
   RETURN LOWER(CONCAT(
        IF(f,SUBSTR(hexStr, 9, 8),SUBSTR(hexStr, 1, 8)), '-',
        IF(f,SUBSTR(hexStr, 5, 4),SUBSTR(hexStr, 9, 4)), '-',
        IF(f,SUBSTR(hexStr, 1, 4),SUBSTR(hexStr, 13, 4)), '-',
        SUBSTR(hexStr, 17, 4), '-',
        SUBSTR(hexStr, 21)
    ));
END$$


CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36), f BOOLEAN)
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
  RETURN UNHEX(CONCAT(
  IF(f,SUBSTRING(uuid, 15, 4),SUBSTRING(uuid, 1, 8)),
  SUBSTRING(uuid, 10, 4),
  IF(f,SUBSTRING(uuid, 1, 8),SUBSTRING(uuid, 15, 4)),
  SUBSTRING(uuid, 20, 4),
  SUBSTRING(uuid, 25))
  );
END$$

DELIMITER ;

INSERT INTO genero (nombre) VALUES 
('Action'), ('Adventure'), ('Crime'), ('Comedy'), ('Drama'), ('Fantasy'), ('Horror'), ('Thriller'), ('Sci-Fi');


INSERT INTO peliculas (id, title, year, director, duration, poster, rate) VALUES
(UUID_TO_BIN(UUID(),1), 'The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 9.3),
(UUID_TO_BIN(UUID(),1), 'The Dark Knight', 2008, 'Christopher Nolan', 142, 'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg', 9.0),
(UUID_TO_BIN(UUID(),1), 'Inception', 2010, 'Christopher Nolan', 148, 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8),
(UUID_TO_BIN(UUID(),1), 'Pulp Fiction', 1994, 'Quentin Tarantino', 154, 'https://www.themoviedb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', 8.9);
  

INSERT INTO pelicula_generos (pelicula_id, genero_id) VALUES
  ((SELECT id FROM peliculas WHERE title = 'Inception'), (SELECT id FROM genero WHERE nombre = 'Action')),
  ((SELECT id FROM peliculas WHERE title = 'Inception'), (SELECT id FROM genero WHERE nombre = 'Sci-Fi')),
  ((SELECT id FROM peliculas WHERE title = 'The Shawshank Redemption'), (SELECT id FROM genero WHERE nombre = 'Sci-Fi')),
  ((SELECT id FROM peliculas WHERE title = 'The Dark Knight'), (SELECT id FROM genero WHERE nombre = 'Sci-Fi')),
  ((SELECT id FROM peliculas WHERE title = 'Pulp Fiction'), (SELECT id FROM genero WHERE nombre = 'Crime'));