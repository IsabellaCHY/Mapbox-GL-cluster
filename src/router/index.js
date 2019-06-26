import Vue from 'vue'
import Router from 'vue-router'
import Cluster from '@/components/Cluster'
import Amap from '@/components/Amap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SplitPolygon',
      component: SplitPolygon
    }
  ]
})
