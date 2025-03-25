<template>

  <v-page header="Configuración" store="setting">
    <div class="v-form">
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
      <label>Región:{{ o.region }}</label>
      <v-select name="region" v-model="o.region" ref="regionSelect" :label="o.regionName ? o.regionName : '---'" @input="
        $refs.provinceSelect.load({ code: o.region ? o.region.code : '*' }, 77)
        ">
        <option value="">Seleccionar Opción</option>
        <v-options store="region" display-field="name" />
      </v-select>

      <label>Provincia:{{ o.province }}</label>
      <v-select id="prov" :label="o.provinceName ? o.provinceName : '---'" autoload="false" :disabled="!o.region"
        ref="provinceSelect" v-model="o.province" @input="$refs.districtSelect.load({
          code: o.province ? o.province.code : '*'
        })">
        <option value="">Seleccionar Opción</option>
        <v-options store="province" display-field="name" />
      </v-select>

      <label :title="o.district">Distrito:</label>
      <v-select autoload="false" :label="o.districtName ? o.districtName : '---'" :disabled="!o.province" @input="
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
import { ui, db, _ } from "isobit-ui";
import axios from 'axios';
import { onRenderTracked, ref } from 'vue'
export default ui({
  props: ["id"],
  setup({ app }) {
    const oRef = ref({
      red: null,
      microred: null,
      establishment: null,
      region: null,
      province: null,
      district: null,
      town: null,
    });
    const save = () => {
      localStorage.setItem("setting", JSON.stringify(oRef.value));
      app.toast("Configuracion grabada!");
    }
    return { o: oRef, save }
  },
  data() {
    return {
      k: 0,
      memo: {},
    };
  },
  created() {
    try {
      let s = localStorage.getItem("setting");
      if (s) {
        s = JSON.parse(s);
        const o = this.o;
        o.red = s.red;
        o.microred = s.microred;
        o.region = s.region;
        o.province = s.province;
        o.district = s.district;
        o.establishment = s.establishment;
        o.town = s.town;
        this.k++;
      }
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    load() {
      const me = this, o = me.o;
      let timer;
      const reset = function () {
        me.k++;
      };
      const postAdd = () => {
        clearTimeout(timer);
        timer = setTimeout(reset, 500);
      };
      [
        "town",
        "red",
        "microred", "cie", "establishment", "district", "region", "province", "sample"
      ].forEach((store) => {
        const e = _.stores.filter(e => e[0] == store)[0];
        if (!e[2]) return;
        axios.get(e[2] + (o.district && e[0] == 'town' ? ('?district=' + o.district.code) : '')).then((data) => {
          const objectStore = db()
            .transaction([e[0]], "readwrite")
            .objectStore(e[0]);
          data = data.data;
          try {
            objectStore.clear().onsuccess = () => {
              for (const i in data) {
                try {

                  const item = data[i];
                  if (!e[1].keyPath) item.$id = i;
                  console.log(item)
                  postAdd(objectStore.add(item));
                } catch (exception) {
                  console.log("Error during add on " + e[1]);
                  console.log(data[i]);
                  throw exception;
                }
              }
            };
          } catch (exception) {
            console.error(exception);
          }
        });
      });
    }
  },
});
</script>
<style scope>
.table input {
  width: 100% !important;
}

.table td {
  padding: 2px;
}

.ww>a:not(:last-child) {
  margin-bottom: 20px;
}

.ww>a {
  display: block;
  border: 1px solid gray;
  padding: 10px;
}

.ww span {
  font-size: 16px;
  font-weight: bolder;
}

.ww i {
  font-size: 14px;
  color: gray;
  display: block;
}

.ww div {
  display: inline-block;
  width: calc(100% - 100px);
  padding-top: 20px;
  float: left;
}

.ww img {
  width: 100px;
}

img.error {
  padding: 30% !important;
  width: 40% !important;
  background-color: transparent;
}

.cart-control>* {
  display: block;
  width: 90%;
}

.cart-control>*:not(:last-child) {
  margin-bottom: 10px;
}

.controls a:not(:last-child) {
  display: inline-block;
  margin-right: 10px;
}

.product {
  padding: 20px;
  background-color: white;
  position: relative;
}

.product-list iframe {
  width: 100%;
}

.controls {
  position: relative;
}

.controls>*:not(:last-child) {
  margin-right: 10px;
}

.view {
  margin: 15px 0px;
}

.inner-scroll {
  --padding: 10px;
}


.v-controls {
  font-size: 30px;
}
</style>