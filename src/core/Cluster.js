import Marker from './Marker'
export default class Cluster {
  constructor(opts) {
    this.opts = opts
    this.map = opts.map
    this.markers = []
    this.init()
  }

  init() {
    if (!this.map) { return }
    this.map.addSource("earthquakes", {
      type: "geojson",
      data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    this.map.addLayer({
      id: "clusters",
      type: "circle",
      source: "earthquakes",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          100,
          "#f1f075",
          750,
          "#f28cb1"
        ],
        "circle-radius": 10
      }
    });

    this.map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "earthquakes",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
      }
    });

    this.map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "earthquakes",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff"
      }
    });

    this.map.on('click', 'clusters', (e) => {
      var features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      var clusterId = features[0].properties.cluster_id;
      this.map.getSource('earthquakes').getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err)
          return;

        this.map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom
        });
      });
    });
    this.updateMarkers()
    this.map.on("data", e => {
      if (e.sourceId !== "earthquakes" || !e.isSourceLoaded) return;
      this.map.on("moveend", this._updateMarkers);
      this.map.on("zoomend", this._updateMarkers);
      this._updateMarkers();
    });
  }

  updateMarkers() {
    this._updateMarkers = (e) => {
      if (!this.map) { return }
      var features = this.map.querySourceFeatures("earthquakes")
      if (features.length === 0) {
        return;
      }
      this.markers.map(item => {
        item.remove()
      })
      this.markers = []
      for (var i = 0; i < features.length; i++) {
        var coords = features[i].geometry.coordinates;
        if (!coords) {
          continue;
        }
        var props = features[i].properties;
        if (!props.cluster) continue;
        var id = props.cluster_id;
        var marker = this.markers[id];

        let mag = features[i].properties.point_count;
        if (mag <= 10) { continue }
        if (!marker) {
          marker = this.markers[id] = new Marker({
            position: coords,
            map: this.map,
            offset: [0, 0],
            icon: {
              src: require("../assets/cluster01.png"),
              size: {
                width: "53px",
                height: "53px"
              }
            },
            label: {
              offset: [18, 18],
              content: `<div style="font-size:14px" >${mag}</div>`
            }
          });
        }
      }
    }
  }
}