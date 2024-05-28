import { Router } from 'express'
import { PeliculaControlador } from '../controllers/pelicula.js'
export const PeliculasRouter = Router()

PeliculasRouter.get('/', PeliculaControlador.getAll)
PeliculasRouter.get('/:id', PeliculaControlador.getById)
PeliculasRouter.post('/', PeliculaControlador.create)
PeliculasRouter.delete('/:id', PeliculaControlador.delete)
PeliculasRouter.patch('/:id', PeliculaControlador.patch)
