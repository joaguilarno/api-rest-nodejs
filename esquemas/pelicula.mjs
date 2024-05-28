import zod from 'zod'

const esquemaPelicula = zod.object({
  title: zod.string({
    invalid_type_error: 'El titulo de la pelicula debe ser una cadena',
    required_error: 'El titulo de la pelicula es requerido'
  }),
  genre: zod.array(
    zod.enum(
      ['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']
    )
  ),
  year: zod.number().int().min(1900).max(2024),
  director: zod.string(),
  duration: zod.number().int().positive(),
  rate: zod.number().min(0).max(10).default(5),
  poster: zod.string().url({
    message: 'El poster debe ser una URL valida'
  })
})

export function validarPelicula (object) {
  return esquemaPelicula.safeParse(object)
}

export function validarParcialmentePelicula (input) {
  return esquemaPelicula.partial().safeParse(input)
}
