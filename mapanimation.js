const map = new mapboxgl.Map({
  container: 'map',
  style    : 'mapbox://styles/mapbox/streets-v11',
  center   : [-71.091542, 42.358862],
  zoom     : 14,
})

const markers = []

function move(locations) {
  markers.forEach(marker => {
    marker.remove()
  })

  locations.forEach(loc => {
    const el     = document.createElement('div')
    el.className = 'marker'

    let status = ''
    if (loc.attributes.occupancy_status) {
      status = loc.attributes.occupancy_status.toLowerCase().replace(/_+/g, ' ')
    }

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([loc.attributes.longitude, loc.attributes.latitude])
      .setPopup(new mapboxgl.Popup().setHTML(`<div><strong>${loc.id}</strong></div>${status}`)) // add popup
      .addTo(map)
    markers.push(marker)
  })
}

const progressBarContainerEl = document.querySelector('.progress-bar-container')

async function run() {
  const progressBarEl     = document.createElement('div')
  progressBarEl.className = 'progress-bar'
  progressBarContainerEl.appendChild(progressBarEl)

  setTimeout(() => {
    progressBarEl.style.width = '100%'
  })

  // get bus data
  const locations = await getBusLocations()
  move(locations)

  // timer
  setTimeout(() => {
    progressBarContainerEl.removeChild(progressBarEl)
    run()
  }, 15000)
}

// Request bus data from MBTA
async function getBusLocations() {
  const url      = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip'
  const response = await fetch(url)
  const json     = await response.json()
  return json.data
}

run()
