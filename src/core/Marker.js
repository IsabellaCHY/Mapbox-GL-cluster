import mapboxgl from 'mapbox-gl'

export default class Marker extends mapboxgl.Marker {
  constructor(opts) {
    let el = document.createElement('div')
    let offset = opts.offset || [-10, q]
    let draggable = opts.draggable || false
    opts = Object.assign({
      element: el,
      offset: offset,
      draggable: draggable
    }, opts)
    super(opts)
    this.opts = opts
    this.el = el
    this.el.className += ` ${this.opts.className}` || ' ext-maker'
    this.map = opts.map
    this.icon = opts.icon
    this.position = opts.position
    this.label = opts.label
    this.labelDiv = null
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
      this.labelDiv = this.makeLabelDiv(this.label)
      this.el.appendChild(this.labelDiv)
    }
  }

  checkHtml(str) {
    let reg = /<[^>]+>/g
    return reg.test(str)
  }

  makeLabelDiv(label) {
    let method = this.checkHtml(label.content) ? 'innerHTML' : 'innerText'
    let labelDiv = document.createElement('div')
    labelDiv.className = this.label.className || 'ext-marker-label'
    labelDiv.innerHTML = this.label.content
    labelDiv.style.position = 'absolute'
    labelDiv.style.width = label.width
    labelDiv.style.height = label.height
    if (label.offset) {
      labelDiv.style.left = label.offset[0] + 'px'
      labelDiv.style.top = label.offset[1] + 'px'
    }
    labelDiv[method] = label.content
    return labelDiv
  }

  remove() {
    super.remove()
  }
}