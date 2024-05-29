import { validarParcialmentePelicula, validarPelicula } from '../esquemas/pelicula.js'
// import { PeliculaModelo } from '../models/local-file/pelicula.js'
// import { PeliculaModelo } from '../models/mysql/pelicula.js'
/*
validacion de formato
que los inputs sean correctos
*/
export class PeliculaControlador {
  constructor ({ peliculaModelo }) {
    this.peliculaModelo = peliculaModelo
  }

  getAll = async (req, res) => {
    const { genero } = req.query
    const peliculas = await this.peliculaModelo.getAll({ genero })
    res.json(peliculas)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const peli = await this.peliculaModelo.getById({ id })
    if (peli) return res.json(peli)
    res.status(404).json({ message: 'La pelicula no se encuentra' })
  }

  create = async (req, res) => {
    const resultado = validarPelicula(req.body)
    if (resultado.error) {
      // 422 Unprocessable Entity: Estructura enviada incorrecta
      return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }
    // esto no es REST porque esta guardando en memoria el estado de la aplicacion
    const nuevaPelicula = await this.peliculaModelo.create({ input: resultado.data })
    res.status(201).json(nuevaPelicula) // actualizar la cache del cliente
  }

  delete = async (req, res) => {
    const { id } = req.params

    const peliculaDelete = await this.peliculaModelo.delete({ id })

    if (peliculaDelete === false) {
      // 422 Unprocessable Entity: Estructura enviada incorrecta
      return res.status(404).json({ mensaje: 'No se encontró la película para borrar' })
    }
    return res.json({ mensaje: 'Película eliminada' }) // actualizar la cache del cliente
  }

  patch = async (req, res) => {
    const { id } = req.params
    const resultado = validarParcialmentePelicula(req.body)

    if (resultado.error) {
      // 422 Unprocessable Entity: Estructura enviada incorrecta
      return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }

    const peliculaActualizada = await this.peliculaModelo.patch({ id, input: resultado.data })
    if (peliculaActualizada === false) return res.status(404).json({ mensaje: 'No se encontró la película para borrar' })
    return res.status(201).json(peliculaActualizada) // actualizar la cache del cliente
  }
}
