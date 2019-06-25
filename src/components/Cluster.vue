<template>
  <div id="map"></div>
</template>

<script>
  import mapboxgl from "mapbox-gl";
  import amapRasterStyle from "../core/AmapStyle";
  import Marker from "../core/Marker";
  import Cluster from '../core/Cluster'
  export default {
    name: "Cluster",
    data () {
      return {
        map: null,
        markers: []
      };
    },
    mounted () {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiZmVuZ3lrIiwiYSI6ImNqdHMybGZ4MTB3bGw0M280eHRld2VuanoifQ.8_MwO6kp9B4DNZcdO0mi4Q";
      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v9",
        center: [114.09, 22.54],
        zoom: 5
      });

      // var mag1 = ["<", ["get", "mag"], 2];
      // var mag2 = ["all", [">=", ["get", "mag"], 2], ["<", ["get", "mag"], 3]];
      // var mag3 = ["all", [">=", ["get", "mag"], 3], ["<", ["get", "mag"], 4]];
      // var mag4 = ["all", [">=", ["get", "mag"], 4], ["<", ["get", "mag"], 5]];
      // var mag5 = [">=", ["get", "mag"], 5];

      // // colors to use for the categories
      // var colors = ["#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c"];

      this.map.on("load", () => {
        let cluster = new Cluster({
          map: this.map
        })
        // this.map.addSource("earthquakes", {
        //   type: "geojson",
        //   data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
        //   cluster: true,
        //   clusterRadius: 80,
        //   clusterProperties: {
        //     mag1: ["+", ["case", mag1, 1, 0]],
        //     mag2: ["+", ["case", mag2, 1, 0]],
        //     mag3: ["+", ["case", mag3, 1, 0]],
        //     mag4: ["+", ["case", mag4, 1, 0]],
        //     mag5: ["+", ["case", mag5, 1, 0]]
        //   }
        // });

        // this.map.addLayer({
        //   id: "earthquake_circle",
        //   type: "circle",
        //   source: "earthquakes",
        //   filter: ["!=", "cluster", true],
        //   paint: {
        //     "circle-color": [
        //       "case",
        //       mag1,
        //       colors[0],
        //       mag2,
        //       colors[1],
        //       mag3,
        //       colors[2],
        //       mag4,
        //       colors[3],
        //       colors[4]
        //     ],
        //     "circle-opacity": 0.6,
        //     "circle-radius": 12
        //   }
        // });
        // this.map.addLayer({
        //   id: "earthquake_label",
        //   type: "symbol",
        //   source: "earthquakes",
        //   filter: ["!=", "cluster", true],
        //   layout: {
        //     "text-field": [
        //       "number-format",
        //       ["get", "mag"],
        //       { "min-fraction-digits": 1, "max-fraction-digits": 1 }
        //     ],
        //     "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        //     "text-size": 10
        //   },
        //   paint: {
        //     "text-color": ["case", ["<", ["get", "mag"], 3], "black", "white"]
        //   }
        // });
        // let marker = new Marker({
        //   map: this.map,
        //   position: [113.7384375000031, 22.965517389903113],
        //   icon: {
        //     src: require("../assets/cluster01.png"),
        //     size: {
        //       width: "53px",
        //       height: "53px"
        //     }
        //   },
        //   label: {
        //     content: `
        //            <div>99 hegksg ds gkjsng</div>
        //            `
        //   }
        // });
        // this.map.on("click", e => {
        //   console.log(e);
        // });
        // this.map.on("data", e => {
        //   if (e.sourceId !== "earthquakes" || !e.isSourceLoaded) return;
        //   this.map.on("move", this.updateMarkers);
        //   this.map.on("moveend", this.updateMarkers);
        //   this.updateMarkers();
        // });
      });
    },
    methods: {
      updateMarkers () {
        // if (this.markers.length > 0) {
        //   this.markers.map(item => {
        //     item.remove();
        //   });
        // }
        var newMarkers = {};
        var features = this.map.querySourceFeatures("earthquakes");
        console.log(features);
        if (features.length === 0) {
          return;
        }
        for (var i = 0; i < 1; i++) {
          var coords = features[i].geometry.coordinates;
          if (!coords) {
            continue;
          }
          var props = features[i].properties;
          if (!props.cluster) continue;
          var id = props.cluster_id;
          var marker = this.markers[id];
          let mag = features[i].properties.point_count;
          console.log(mag);
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
                content: `<div>${mag}</div>`
              }
            });
          }
          newMarkers[id] = marker;
        }
      }
    }
  };
</script>

<style scoped>
  body {
    margin: 0;
    padding: 0;
  }
  #map {
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    position: absolute;
  }
</style>
