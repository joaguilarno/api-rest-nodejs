import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'api-node-peliculas',
  port: '3306'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class PeliculaModelo {
  static async getAll ({ genero }) {
    if (genero) {
      const lowerCaseGenero = genero.toLowerCase()

      const [generos] = await connection.query(
        'SELECT id, nombre FROM genero WHERE LOWER(nombre) = ?;', [lowerCaseGenero]
      )

      if (generos.length === 0) return []

      const [{ id }] = generos

      const [peliculas] = await connection.query(
        'SELECT p.title, p.year, p.director, p.duration, p.poster, p.rate, BIN_TO_UUID(p.id, 1) id FROM pelicula_generos pg INNER JOIN peliculas p ON p.id = pg.pelicula_id WHERE pg.genero_id = ?', [id]
      )

      console.log(peliculas)
      return peliculas
    }

    const [peliculas] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id, 1) id FROM peliculas;'
    )
    console.log(peliculas)
    return peliculas
  }

  static async getById ({ id }) {
    if (id) {
      const [peliculas] = await connection.query(
        'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id, 1) id FROM peliculas WHERE id = UUID_TO_BIN(?, 1);', [id]
      )

      if (peliculas.length === 0) return []

      console.log(peliculas)
      return peliculas
    }
  }

  static async create ({ input }) {
    const {
      genero: generoInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // const generos
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        'INSERT INTO peliculas (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?),?,?,?,?,?,?);',
        [uuid, title, year, duration, director, rate, poster]
      )
    } catch (error) {
      // puede enviarle informacion sensible al cliente
      throw new Error('Error creando la pelicula')
      // enviar la traza a un servicio interno; ejemplo: sendLog(e)
    }

    const [peliculas] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id, 1) id FROM peliculas WHERE id = UUID_TO_BIN(?, 1);', [uuid]
    )

    return peliculas[0]
  }

  static async delete ({ id }) {
  //
  }

  static async update ({ id, input }) {
  //
  }

  static async patch ({ id, input }) {
  //
  }
}
