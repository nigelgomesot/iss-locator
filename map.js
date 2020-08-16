mapboxgl.accessToken = '<ACCESS_TOKEN>';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [0, 0],
  zoom: 1
});

var locate_url = '/locate';

map.on('load', () => {
  setInterval(() => {
    fetch(locate_url)
      .then(response => response.json())
      .then(json => {
        const data = json,
              issLastLocation = data.features[0].geometry.coordinates,
              details = data.features[0].properties;

        let detailsDOM = '<ul id="details-list">';
        for (detail in details) {
          detailsDOM += `<li>${detail.toUpperCase()}: ${details[detail]}</li>`
        };
        detailsDOM += '</ul>';
        document.getElementById('details').innerHTML = detailsDOM;

        document.getElementById('locate').setAttribute('data-location', JSON.stringify(issLastLocation));
        map.getSource('iss').setData(data);
      })
  }, 1000);

  map.addSource('iss', { type: 'geojson', data: locate_url });
  map.addLayer({
    "id": "iss",
    "type": "symbol",
    "source": "iss",
    "layout": {
      "icon-image": "rocket-15"
    }
  });

  document.getElementById('locate').addEventListener('click', (e) => {
    const issLastLocation = JSON.parse(e.target.getAttribute('data-location'));
    map.flyTo({
      center: issLastLocation
    });
  });
});

