import { readJSON } from '../../utils/utils.js'
import { randomUUID } from 'node:crypto'
/*
validacion de integridad y coherencia y consistencia de datos

// import movies from './movies/movies.json' // no se puede importar json
// import movies from './movies/movies.json' with { type: 'json' }

// como leer EM Modules
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json'))

// como leer un json en ESModules recomendado por ahora
const movies = readJSON('../movies/movies.json')
*/
const movies = readJSON('../movies/movies.json')

export class PeliculaModelo {
  static async getAll ({ genre }) {
    if (genre) {
      return movies.filter((pelicula) => (
        pelicula.genre.some((genero) => (
          genero.toLocaleLowerCase() === genre.toLocaleLowerCase()
        ))
      ))
    }
    return movies
  }

  static async getById ({ id }) {
    const peli = movies.find(pelicula => pelicula.id === id)
    if (peli) return peli
  }

  static async create ({ input }) {
    // esto no es REST porque esta guardando en memoria el estado de la aplicacion
    const nuevaPelicula = {
      id: randomUUID(),
      ...input
    }
    movies.push(nuevaPelicula)

    return nuevaPelicula
  }

  static async delete ({ id }) {
    const indicePelicula = movies.findIndex((pelicula) => pelicula.id === id)
    if (indicePelicula === -1) return false

    movies.splice(indicePelicula, 1)
    return true
  }

  static async update ({ id, input }) {
    const indicePelicula = movies.findIndex(pelicula => pelicula.id === id)
    if (indicePelicula === -1) return false

    const peliculaActualizada = {
      ...movies[indicePelicula],
      ...input
    }

    movies[indicePelicula] = peliculaActualizada

    return movies[indicePelicula]
  }

  static async patch ({ id, input }) {
    const indicePelicula = movies.findIndex(pelicula => pelicula.id === id)

    if (indicePelicula === -1) return false

    const peliculaActualizada = {
      ...movies[indicePelicula],
      ...input
    }

    movies[indicePelicula] = peliculaActualizada

    return movies[indicePelicula]
  }
}
