
let amapRasterStyle = {
  'version': 8,
  // 'glyphs': '',
  'sources': {
    'AMAP_RASTER_SOURCE': {
      'type': 'raster',
      'tiles': [`http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`,
        `http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`,
        `http://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`,
        `http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`],
      'tileSize': 256  //512
    }
  },
  'layers': [
    {
      'id': 'AMAP_RASTER_LAYER',
      'type': 'raster',
      'source': 'AMAP_RASTER_SOURCE',
      'minzoom': 0,
      'maxzoom': 18,
      'interactive': true
    }]
}

// let amapVectorStyle = {
//   'version': 8,
//   // 'glyphs': '',
//   'sources': {
//     'AMAP_VECTOR_SOURCE': {
//       'type': 'vector',
//       'tiles': [`http://webst01.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}`,
//         `http://webst02.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}`,
//         `http://webst03.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}`,
//         `http://webst04.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}`],
//       'tileSize': 256  //512
//     }
//   },
//   'layers': [
//     {
//       'id': 'AMAP_VECTOR_LAYER',
//       'type': 'vector',
//       'source': 'AMAP_VECTOR_SOURCE',
//       'minzoom': 0,
//       'maxzoom': 18,
//       'interactive': true
//     }]
// }

// export  {
//   amapRasterStyle,
//   amapVectorStyle
// }
export default amapRasterStyle
