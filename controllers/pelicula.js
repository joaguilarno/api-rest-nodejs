import { validarParcialmentePelicula, validarPelicula } from '../esquemas/pelicula.js'
import { PeliculaModelo } from '../models/pelicula.js'
/*
validacion de formato
que los inputs sean correctos
*/
export class PeliculaControlador {
  static async getAll (req, res) {
    const { genre } = req.query
    const peliculas = await PeliculaModelo.getAll({ genre })
    res.json(peliculas)
  }

  static async getById (req, res) {
    const { id } = req.params
    const peli = await PeliculaModelo.getById({ id })
    if (peli) return res.json(peli)
    res.status(404).json({ message: 'La pelicula no se encuentra' })
  }

  static async create (req, res) {
    const resultado = validarPelicula(req.body)
    if (resultado.error) {
      // 422 Unprocessable Entity: Estructura enviada incorrecta
      return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }
    // esto no es REST porque esta guardando en memoria el estado de la aplicacion
    const nuevaPelicula = await PeliculaModelo.create({ input: resultado.data })
    res.status(201).json(nuevaPelicula) // actualizar la cache del cliente
  }

  static async delete (req, res) {
    const { id } = req.params

    const peliculaDelete = await PeliculaModelo.delete({ id })

    if (peliculaDelete === false) {
      // 422 Unprocessable Entity: Estructura enviada incorrecta
      return res.status(404).json({ mensaje: 'No se encontró la película para borrar' })
    }
    return res.json({ mensaje: 'Película eliminada' }) // actualizar la cache del cliente
  }

  static async patch (req, res) {
    const { id } = req.params
    const resultado = validarParcialmentePelicula(req.body)

    if (resultado.error) {
      // 422 Unprocessable Entity: Estructura enviada incorrecta
      return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }

    const peliculaActualizada = await PeliculaModelo.patch({ id, input: resultado.data })
    if (peliculaActualizada === false) return res.status(404).json({ mensaje: 'No se encontró la película para borrar' })
    return res.status(201).json(peliculaActualizada) // actualizar la cache del cliente
  }
}
