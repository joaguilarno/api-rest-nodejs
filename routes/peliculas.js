import { Router } from 'express'
import { PeliculaControlador } from '../controllers/pelicula.js'

export const crearPeliculaRouter = ({ peliculaModelo }) => {
  const peliculasRouter = Router()
  const controladorPeliculas = new PeliculaControlador({ peliculaModelo })

  peliculasRouter.get('/', controladorPeliculas.getAll)
  peliculasRouter.get('/:id', controladorPeliculas.getById)
  peliculasRouter.post('/', controladorPeliculas.create)
  peliculasRouter.delete('/:id', controladorPeliculas.delete)
  peliculasRouter.patch('/:id', controladorPeliculas.patch)

  return peliculasRouter
}
