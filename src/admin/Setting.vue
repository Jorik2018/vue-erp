<template>

  <v-page header="Configuración" store="setting">
    <div class="v-form" :key="k">
      <v-button icon="fa fa-sync" value="Recuperar Datos Maestros" @click="load"
        style="width: -webkit-fill-available" />
      <label>Red:</label>
      <v-select v-model="o.red" :autoload="1" ref="redSelect" v-bind:label="o.regionName ? o.regionName : '---'"
        @input="$refs.microredSelect.load({ Codigo_Red: o.red })">
        <option value="">Seleccionar Opción</option>
        <v-options store="red" display-field="name" value-field="code" />
      </v-select>

      <label>Microred:</label>
      <v-select autoload="false" :disabled="!o.red" ref="microredSelect" v-model="o.microred" :required="true"
        @input="$refs.establishment.load({ microredCode: (o.microred) })">
        <option>Select One...</option>
        <v-options store="microred" display-field="name" value-field="code" />
      </v-select>

      <label>Establecimiento:</label>
      <v-select ref="establishment" v-model="o.establishment" v-bind:autoload="false" id="abc"
        v-bind:disabled="!o.microred" v-bind:required="true">
        <option>Select One...</option>
        <v-options store="establishment" display-field="name" value-field="code" />
      </v-select>
      <label>Región:</label>
      <v-select v-model="o.region" ref="regionSelect" :label="o.regionName ? o.regionName : '---'" @input="
        $refs.provinceSelect.load({ code: o.region ? o.region.code : '*' }, 77)
        ">
        <option value="">Seleccionar Opción</option>
        <v-options store="region" display-field="name" />
      </v-select>

      <label>Provincia:</label>
      <v-select :label="o.provinceName ? o.provinceName : '---'" autoload="false" :disabled="!o.region"
        ref="provinceSelect" v-model="o.province" @input="$refs.districtSelect.load({
          code: o.province ? o.province.code : '*'
        })">
        <option value="">Seleccionar Opción</option>
        <v-options store="province" display-field="name" />
      </v-select>

      <label :title="o.district">Distrito:</label>
      <v-select name="dist" autoload="false" :label="o.districtName ? o.districtName : '---'" :disabled="!o.province"
        @input="
          $refs.cpSelect.load({ id: o.district ? o.district.code : '*' })
          " ref="districtSelect" v-model="o.district">
        <option value="">Seleccionar Opción</option>
        <v-options store="district" display-field="name" />
      </v-select>
      <label>Centro Poblado:</label>
      <v-select autoload="false" :title="o.district && o.district.code" :label="o.districtName ? o.districtName : '---'"
        :disabled="!o.district" ref="cpSelect" v-model="o.town">
        <option value="">Seleccionar Opción</option>
        <v-options store="town" display-field="name" />
      </v-select>
      <v-button icon="fa fa-save" value="Guardar Seleccion" @click="save"
        style="margin-top: 10px; width: -webkit-fill-available" />
    </div>
  </v-page>
</template>
<script>
import { ui, db, _, pad } from "isobit-ui";
import axios from 'axios';
import { ref } from 'vue'
export default ui({
  props: ["id"],
  setup({ app }) {
    const k = ref(0);
    let timer;
    const oRef = ref({
      red: null,
      microred: null,
      establishment: null,
      region: null,
      province: null,
      district: null,
      town: null,
    });
    try {
      let s = localStorage.getItem("setting");
      if (s) {
        s = JSON.parse(s);
        const o = oRef.value;
        o.red = s.red;
        o.microred = s.microred;
        o.region = s.region;
        o.province = s.province;
        o.district = s.district;
        o.establishment = s.establishment;
        o.town = s.town;
        oRef.value = o;
        k.value++;
      }
    } catch (e) {
      console.log(e);
    }
    const reset = () => {
      k.value++;
    };
    const addItem = (store, item) => new Promise((resolve, rejected) => {
      const request = store.add(item);
      request.onsuccess = () => resolve(item);
      request.onerror = () => rejected(request.error);
    })
    const load = () => {
      const o = oRef.value;
      [
        "town",
        "red",
        "microred", "cie", "establishment", "district", "region", "province", "sample"
      ].forEach((store) => {
        const e = _.stores.filter(e => e[0] == store)[0];
        const { src } = e[1];
        if (!src) return;
        axios.get(src + (o.district && e[0] == 'town' ? ('?district=' + o.district.code) : '')).then((data) => {
          const objectStore = db()
            .transaction([e[0]], "readwrite")
            .objectStore(e[0]);
          data = data.data;
          try {
            objectStore.clear().onsuccess = () => {
              Promise.all(data.map((item => addItem(objectStore, item)))).then(() => reset())
            };
          } catch (exception) {
            console.error(exception);
          }
        });
      });
    }
    const save = () => {
      localStorage.setItem("setting", JSON.stringify(oRef.value));
      app.toast("Configuracion grabada!");
    }
    return { o: oRef, save, load, k }
  }
});
</script>