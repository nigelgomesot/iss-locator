var request = require('request'),
    geojson = require('geojson'),
    express = require('express'),
    path = require('path')

var ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544'
var APP_PORT = 5000

var app = express()

app.set('port', APP_PORT)
app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`))
})

app.get('/locate', (req, res) => {
  request(ISS_URL, (err, locate_response, response_body) => {
    if (err) {
      console.warn(err)
      res.status(400).json({error: 'ISS locate request failed'})
      return
    }

    var apiResponse = JSON.parse(response_body)
    var geoJSON = geojson.parse([apiResponse], { Point: ['latitude', 'longitude']})

    res.json(geoJSON)
  })
})

app.listen(app.get('port'), () => console.log(`App listening to port:${app.get('port')}`))
