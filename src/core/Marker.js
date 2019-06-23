import mapboxgl from 'mapbox-gl'

export default class Marker extends mapboxgl.Marker {
  constructor(opts) {
    let el = document.createElement('div')
    let offset = opts.offset || [-10, -34]
    let draggable = opts.draggable || false
    opts = Object.assign({
      element: el,
      offset: offset,
      draggable: draggable
    }, opts)
    super(opts)
    this.el = el
    this.opts = opts
    this.map = opts.map
    this.icon = opts.icon
    this.position = opts.position
    console.log(this)
    if (this.position) {
      this.setLngLat(this.position)
    }
    if (this.map) {
      this.addTo(this.map)
    }
    this.init()
  }
  init() {
    if (this.icon) {
      let img = document.createElement('img')
      img.src = this.icon.src
      if (this.icon.size) {
        img.style.width = this.icon.size.width
        img.style.height = this.icon.size.height
      }
      this.el.appendChild(img)
    }
    if (this.label) {
      let label = document.createElement('div')
      if (this.label.className) {
        label.className = this.label.className
      }
      label.innerHTML = this.label.content
      this.el.appendChild(label)
    }
    this.el = document.createElement('div')
    this.el.className = this.opts.className || 'ext-maker'
  }
}