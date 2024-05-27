const http = require('node:http')
const fs = require('node:fs')
const pokemon = require('../pokemon/ditto.json')

const puerto = process.env.PORT ?? '1234'

const processRequest = (req, res) => {
  console.log('request recibida: ' + req.url)
  const { method, url } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json; utf-8')
          return res.end(JSON.stringify(pokemon))
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end('Error 404')
      }
    case 'POST':
      switch (url) {
        case '/pokemon':
          // eslint-disable-next-line no-case-declarations
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })

          req.on('end', () => {
            const data = JSON.parse(body)
            data.timeStamp = Date()
            // llamar a una base de datos para guardar la info
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(JSON.stringify(data))
          })
          /* res.setHeader('Content-Type', 'application/json; utf-8')
          return res.end('pokemon creado') */
          // eslint-disable-next-line no-fallthrough
          break
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end('Error 404')
      }
  }
  /*
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('Hola mundo')
  } else if (req.url === '/contacto') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('contacto')
  } else if (req.url === '/imagen.png') {
    fs.readFile('./imagen.png', (error, data) => {
      if (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end('Internal error server')
      } else {
        res.setHeader('Content-Type', 'image/png')
        res.end(data)
      }
    })
    res.end('/contacto')
  } else {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('error')
  } */
}

const server = http.createServer(processRequest)

server.listen(puerto, () => {
  console.log('servidor escuchando en el puerto: http://locahost:' + puerto)
})
