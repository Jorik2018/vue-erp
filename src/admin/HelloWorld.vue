<template>
  <v-page style="flex:1">
    <div id="map" style="flex:1;border: 1px solid gray;">

    </div>
  </v-page>
</template>
<script>
import { nextTick, onMounted, ref } from 'vue'
import "ol/ol.css";
import { ui } from 'isobit-ui'
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export default ui({
  setup() {
    onMounted(() => {
      const map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
      nextTick(() => {
        setTimeout(() => {
          map.updateSize();
        }, 100)
      })

    })
  }
})


</script>
