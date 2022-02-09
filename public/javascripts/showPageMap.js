mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: vineyard.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker()
.setLngLat(vineyard.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h6>${vineyard.title}</h6><p>${vineyard.location}</p>`
    )
)
.addTo(map);

const scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: '#navbar-example'
  })
  