<template>
  <div id="map"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
export default {
  name: "SplitPolygon",
  data() {
    return {
      map: null,
      markers: []
    };
  },
  mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZmVuZ3lrIiwiYSI6ImNqdHMybGZ4MTB3bGw0M280eHRld2VuanoifQ.8_MwO6kp9B4DNZcdO0mi4Q";
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v9",
      center: [114.09, 22.54],
      zoom: 4
    });
  },
  methods: {}
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
