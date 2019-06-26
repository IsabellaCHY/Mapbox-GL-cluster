import { getCoords, getCoord, getType } from '@turf/invariant';
import { featureEach, featureReduce, flattenEach } from '@turf/meta';
import { lineString, polygon, multiPolygon, featureCollection } from '@turf/helpers';
import union from '@turf/union'
import lineIntersect from '@turf/line-intersect'
import polygonToLine from '@turf/polygon-to-line'
import buffer from '@turf/buffer'
import difference from '@turf/difference'
import lineOffset from '@turf/line-offset'
import booleanDisjoint from '@turf/boolean-disjoint'
import pointToLineDistance from '@turf/point-to-line-distance'


/**
 * Split a Polygon or MultiPolygon by another LineString or Polygon.
 *
 * @name polygonSplit
 * @param {Feature<LineString>} line LineString Feature to split
 * @param {Feature<any>} splitter Feature used to split line
 * @returns {FeatureCollection<LineString>} Split LineStrings
 * @example
 * var line = turf.lineString([[120, -25], [145, -25]]);
 * var splitter = turf.lineString([[130, -15], [130, -35]]);
 *
 * var split = turf.polygonSplit(line, splitter);
 *
 * //addToMap
 * var addToMap = [line, splitter]
 */
function polygonSplit (geojson, splitter) {
  // validation
  if (!geojson) throw new Error('geojson is required');
  if (!splitter) throw new Error('splitter is required');

  var geojsonType = getType(geojson);
  var splitterType = getType(splitter);

  if (geojsonType !== 'Polygon' || geojsonType !== 'MultiPolygon') throw new Error('geojson must be Polygon or MultiPolygon');
  if (splitterType === 'FeatureCollection') throw new Error('splitter cannot be a FeatureCollection');
  if (splitterType === 'GeometryCollection') throw new Error('splitter cannot be a GeometryCollection');
  let polygon = geojson
  switch (splitterType) {
    case 'LineString':
      return splitPolygonWithLine(polygon, splitter);
    case 'Polygon':
      return splitPolygonWithPolygon(polygon, splitter);
  }
}

/**
 * Split LineString with MultiPoint
 *
 * @private
 * @param {Feature<LineString>} line LineString
 * @param {FeatureCollection<Point>} splitter Point
 * @returns {FeatureCollection<LineString>} split LineStrings
 */
function splitPolygonWithLine (polygon, splitter) {
  let results = null
  // 判断线与面的交点个数
  let intersects = lineIntersect(polygonToLine(polygon), splitter)
  if (!intersects || intersects.features.length < 2) { return }

  let bufferPolygon = buffer(splitter, 0.0005, { units: 'meters' })
  let poly = difference(polygon, bufferPolygon)
  if (poly.geometry.coordinates.length < 2) {
    return
  } else if (poly.geometry.coordinates.length === 2) {
    let poly1 = polygon(poly.geometry.coordinates[0])
    let poly2 = polygon(poly.geometry.coordinates[1])

    let res = combinePolygons([poly1, poly2], splitter)
    if (!res) { return }
    results = res
  } else if (poly.geometry.coordinates.length > 2) {
    let polygons = []
    poly.geometry.coordinates.map(item => {
      polygons.push(turf.polygon(item))
    })
    let res = combinePolygons(polygons, splitter)
    if (!res) { return }
    results = res
  }
  return results;
}

/**
 * Split LineString with Point
 *
 * @private
 * @param {Feature<LineString>} line LineString
 * @param {Feature<Point>} splitter Point
 * @returns {FeatureCollection<LineString>} split LineStrings
 */
function splitPolygonWithPolygon (polygon, splitter) {
  if (polygon.geometry.type === 'Polygon') {
    return splitSinglePolygon(polygon, splitter)
  } else if (polygon.geometry.type === 'MultiPolygon') {
    return splitMultiPolygon(polygon, splitter)
  }
}


function combinePolygons (polygons, splitter) {
  if (polygons.length === 0) { return }
  let lPolygons = []
  let rPolygons = []

  polygons.map(item => {
    let lOffsetLine = lineOffset(splitter, -0.0001, { units: 'meters' })
    let rOffsetLine = lineOffset(splitter, 0.0001, { units: 'meters' })

    let isLDisjoint = booleanDisjoint(lOffsetLine, item)
    let isRDisjoint = booleanDisjoint(rOffsetLine, item)

    if (!isLDisjoint) {
      // 没有交集
      rPolygons.push(item)
    } else if (!isRDisjoint) {
      // 有交集
      lPolygons.push(item)
    } else {
      let center = center(item)
      let dis1 = pointToLineDistance(center, lOffsetLine)
      let dis2 = pointToLineDistance(center, rOffsetLine)
      if (dis1 > dis2) {
        lPolygons.push(item)
      } else {
        rPolygons.push(item)
      }
    }
  })

  return featureCollection([lPolygons, rPolygons]);
}


/**
 * polygons转multiPolygon,不涉及属性，只输出属性为{}
 * 考虑polygons中就存在多面的情况
 */
function polygons2MultiPolygon (polygons) {
  if (polygons.length === 0) { return }
  let coords = []

  polygons.forEach((item) => {
    if (item.geometry.type === 'Polygon') {
      coords.push(item.geometry.coordinates)
    } else {
      item.geometry.coordinates.forEach((item) => {
        coords.push(item)
      })
    }
  })
  let multiPolygon = multiPolygon(coords)
  return multiPolygon
}

function splitSinglePolygon (polygon, clipPolygon) {
  // 选中多边形和绘制多边形之间的公共部分
  let intersection = intersect(polygon, clipPolygon)
  if (!intersection) { return }
  intersection.properties = polygon.properties

  // 选中多边形和绘制多边形中不一样的部分
  let difference = difference(polygon, clipPolygon)
  if (!difference) { return }

  return featureCollection([difference, intersection])
}

function splitMultiPolygon (polygon, clipPolygon) {
  let polygons = multiPolygon2polygons(polygon)
  let intersectArr = []
  polygons.forEach(function (poly) {
    let intersection = intersect(poly, clipPolygon)
    if (intersection) {
      intersectArr.push(intersection)
    }
  })

  // 选中多边形和绘制多边形中不一样的部分
  let difference = turf.difference(polygon, clipPolygon)
  difference.properties = polygon.properties
  let uPolygon = unionPolygon(intersectArr)

  if (!difference || !uPolygon) { return }
  return featureCollection([difference, uPolygon])
}

/**
 * multiPolygon转polygons,不涉及属性
 */
function multiPolygon2polygons (multiPolygon) {
  if (multiPolygon.geometry.type !== 'MultiPolygon') {
    return
  }
  var polygons = [];
  multiPolygon.geometry.coordinates.forEach((item) => {
    var polygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: []
      }
    };
    polygon.geometry.coordinates = item;
    polygons.push(polygon)
  });
  return polygons;
}


/**
  * 合并多边形
  */
function unionPolygon (polygons) {
  var polygon = polygons[0]
  for (var i = 0; i < polygons.length; i++) {
    if (polygons[i]) {
      polygon = turf.union(polygon, polygons[i])
    }
  };
  return polygon;
}

export default lineSplit;
