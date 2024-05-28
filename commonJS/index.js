const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const movies = require('../movies/movies.json')
const { validarPelicula, validarParcialmentePelicula } = require('../esquemas/pelicula_')

const app = express()
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com',
      'https://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.disable('x-powered-by')

app.get('/peliculas', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const pelisPorGenero = movies.filter((pelicula) => (
      pelicula.genre.some((genero) => (
        genero.toLocaleLowerCase() === genre.toLocaleLowerCase()
      ))
    ))
    return res.json(pelisPorGenero)
  }
  res.json(movies)
})

app.get('/peliculas/:id', (req, res) => {
  const { id } = req.params
  const peli = movies.find(pelicula => pelicula.id === id)
  if (peli) return res.json(peli)
  res.status(404).json({ message: 'La pelicula no se encuentra' })
})

app.post('/peliculas', (req, res) => {
  const resultado = validarPelicula(req.body)
  if (resultado.error) {
    // 422 Unprocessable Entity: Estructura enviada incorrecta
    return res.status(400).json({ error: JSON.parse(resultado.error.message) })
  }
  // esto no es REST porque esta guardando en memoria el estado de la aplicacion
  const nuevaPelicula = {
    id: crypto.randomUUID(),
    ...resultado.data
  }
  movies.push(nuevaPelicula)
  return res.status(201).json(nuevaPelicula) // actualizar la cache del cliente
})

app.patch('/peliculas/:id', (req, res) => {
  const { id } = req.params
  const resultado = validarParcialmentePelicula(req.body)

  if (resultado.error) {
    // 422 Unprocessable Entity: Estructura enviada incorrecta
    return res.status(400).json({ error: JSON.parse(resultado.error.message) })
  }

  const indicePelicula = movies.findIndex(pelicula => pelicula.id === id)
  if (indicePelicula === -1) {
    return res.status(404).json({ message: 'Pelicula no encontrada' })
  }

  const peliculaActualizada = {
    ...movies[indicePelicula],
    ...resultado.data
  }

  movies[indicePelicula] = peliculaActualizada
  return res.status(201).json(peliculaActualizada) // actualizar la cache del cliente
})

// app.get('/peliculas/:genre')

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log('escuchando desde el puerto ' + PORT)
})
