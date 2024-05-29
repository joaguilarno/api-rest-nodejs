import { createApp } from './index.js'
import { PeliculaModelo } from './models/mysql/pelicula.js'

createApp({ peliculaModelo: PeliculaModelo })
