import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { crearPeliculaRouter } from './routes/peliculas.js'

export const createApp = ({ peliculaModelo }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use('/peliculas', crearPeliculaRouter({ peliculaModelo }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log('escuchando desde el puerto ' + PORT)
  })
}

/*
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
    id: randomUUID(),
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
*/
// app.get('/peliculas/:genre')
