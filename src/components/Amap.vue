<template>
   <div id="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import amapRasterStyle from '../core/AmapStyle'
export default {
  name: 'Amap',
  data () {
    return {
      map: null
    }
  },
  mounted(){
    this.map = new mapboxgl.Map({
      container: 'map',
      style: amapRasterStyle,  // 加载高德地图瓦片
      center: [114.09, 22.54],
      zoom: 12
    })
  },
  methods:{
    
  }
}
</script>

<style scoped>
  body {
    margin:0; padding:0; 
  }
  #map { 
    top:0; 
    bottom:0; 
    width:100%; 
    height: 100%;
    position: absolute;
  }
</style>
