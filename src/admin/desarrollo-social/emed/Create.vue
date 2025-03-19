<template>
  <ion-page>
    <v-form action="/api/desarrollo-social/emed" :header="(o.id ? 'Editar' : 'Crear') + '  Evento'" :class="o.id < 0 || (o.tmpId && !o.synchronized)
      ? 'yellow'
      : o.tmpId
        ? 'green'
        : ''
      " store="emed">
      <div class="v-form">
        <label>ID:</label>
        <div>{{ pad(o.id || 0, 4) }}</div>
        <v-fieldset legend="Datos generales" class="v-form">
          <label>Codigo:</label>
          <input v-model="o.code" class="center" />
          <label>Fecha:</label>
          <v-calendar required v-model="o.date" />
          <label>Hora:</label>
          <v-calendar type="time" required v-model="o.time" class="center" />
          <label>Categoria:</label>
          <v-select v-model="o.category" required name="category">
            <option value="">Select One...</option>
            <v-options :data="category" value-field="name"></v-options>
          </v-select>
          <label>Tipo:</label>
          <v-select v-model="o.type" name="event" :disabled="!o.category" required>
            <option value="">Select One...</option>
            <v-options :data="event" value-field="name"></v-options>
          </v-select>
          <label>Detalle:</label>
          <v-select v-model="o.detail" :disabled="!o.type" required>
            <option value="">Select One...</option>
            <v-options :data="detail" value-field="name"></v-options>
          </v-select>
          <label>Descripción:</label>
          <v-textarea v-model="o.description" maxlength="500" />
        </v-fieldset>

        <v-fieldset legend="Ubicación" class="v-form">
          <label>DIRESA:</label>
          <div>ANCASH</div>
          <label>Provincia:</label>
          <v-select ref="province" :autoload="false" storage="province_selected" v-model="o.province" required
            @input="$refs.district.load({ code: o.province })">
            <option value="">Select One...</option>
            <v-options store="province" display-field="name" value-field="code" />
          </v-select>

          <label>Distrito:</label>
          <v-select ref="district" :autoload="false" store="district_selected" :disabled="!o.province"
            v-model="o.district" required @input="$refs.cpSelect.load({ id: o.district })">
            <option value="">Select One...</option>
            <v-options name="district" store="district" value-field="code" display-field="name" />
          </v-select>

          <label>Centro Poblado:</label>
          <v-select :autoload="false" :label="o.districtName ? o.districtName : '---'" :disabled="!o.district" required
            ref="cpSelect" v-model="o.codigo_ccpp" @input="inputCCPP">
            <option value="">Seleccionar Opción</option>
            <v-options store="town" display-field="name" value-field="id" />
          </v-select>

          <label>Referencia:</label>
          <v-textarea v-model="o.referencia" maxlength="200" />
        </v-fieldset>

        <v-fieldset legend="Recursos movilizados ">
          <div>TODOS CON ORIGEN (IPRESS)</div>
          <label>N° Ambulancias:</label>
          <v-number v-model="o.ambulancias" />
          <label>N° personal:</label>
          <v-number v-model="o.personal" />
          <label>N° Brigadistas de salud:</label>
          <v-number v-model="o.brigadistas" />
          <label>N° Equipo Técnico EMED:</label>
          <v-number v-model="o.equipo_tecnico" />
        </v-fieldset>
        <label>Coordenadas:</label>
        <v-map ref="map" @build="mapBuild" style="height: 400px; border: 1px solid lightgrey"
          @translateend="translateend">
          <v-layer-control />

          <v-map-control @click.prevent="addMarker(1)" click.prevent="open" style="bottom: 90px; right: 10px"
            icon="fa-bullseye" />
          <v-map-control @click.prevent="addMarker(0)" click.prevent="open" style="bottom: 30px; right: 10px"
            icon="fa-map-marker" />
        </v-map>
        <div class="center" v-if="o.lat || o.lon">
          <a :href="'https://www.google.com/maps/search/?api=1&query=' +
            o.lat +
            ',' +
            o.lon
            " target="_blank">({{ o.lat }},{{ o.lon }})</a>
        </div>
        <div v-if=show ref="addLocation" style="background-color: white;
    padding: 20px;
    display: flex
;">
          <v-button class="column" value="Centro Mapa" icon="fa-location-pin" />
          <v-button class="column" value="Ubicación Actual" icon="fa-person" />
        </div>
        <v-fieldset legend="Fuente de Información">
          <label>Institución:</label>
          <input v-model="o.fuente_institucion" />
          <label>Apellidos y nombres:</label>
          <input v-model="o.fuente_nombre_completo" />
          <label>Cargo:</label>
          <input v-model="o.fuente_cargo" />
          <label>Celular:</label>
          <input v-model="o.fuente_celular" />
        </v-fieldset>
        <v-fieldset legend="Responsable de Información IPRESS">
          <v-fieldset legend="Fuente inicial">
            <label>IPRESS:</label>
            <v-select v-model="o.fuente_responsable_ipress" required>
              <option value="">Select One...</option>
              <v-options :data="ipress_inicial" />
            </v-select>
            <label>Apellidos y nombres:</label>
            <input v-model="o.fuente_responsable_nombre_completo" />
            <label>Cargo:</label>
            <input v-model="o.fuente_responsable_cargo" />
            <label>Celular:</label>
            <input v-model="o.fuente_responsable_celular" />
          </v-fieldset>
          <v-fieldset legend="Fuente verificación">
            <label>EMED Salud:</label>
            <v-select v-model="o.fuente_verifica_emed" required>
              <option value="">Select One...</option>
              <v-options :data="emed" />
            </v-select>
            <label>Apellidos y nombres:</label>
            <input v-model="o.fuente_verifica_nombre_completo" />
            <label>Cargo:</label>
            <input v-model="o.fuente_verifica_cargo" />
            <label>Celular:</label>
            <input v-model="o.fuente_verifica_celular" />
          </v-fieldset>
        </v-fieldset>
      </div>
      <center>
        <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
        <v-button style="margin-left: 10px" value="Ver" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
          $router.replace(
            '/admin/desarrollo-social/emed/' + (o.tmpId ? -o.tmpId : o.id)
          )
          "></v-button>
      </center>

    </v-form>
  </ion-page>
</template>
<script>
import { Geolocation } from "@capacitor/geolocation";
import { ui, pad, MsgBox, mask, unmask } from 'isobit-ui'
import axios from 'axios'
import { onMounted, nextTick, ref } from 'vue';
import { category, emed, ipress_inicial } from './constants';
import { fromLonLat } from 'ol/proj';

export default ui({
  props: ["id"],
  data() {
    return {
      red: [],
      category,
      emed,
      ipress_inicial
    };
  },
  computed: {
    event() {
      const e = this.category.find((e) => e.name === this.o.category);
      if (!e) return [];
      if (!e.type) {
        e.type = [{ name: e.name }]
      }
      return e.type;
    },
    detail() {
      const e = this.event.find((e) => e.name === this.o.type);
      if (!e) return [];
      if (!e.detail) {
        e.detail = [{ name: e.name }]
      }
      return e.detail;
    }
  },
  setup({ id, router }) {
    const oRef = ref({});
    const map = ref(null);
    const trayLocation = ref(null);
    const province = ref();
    const show = ref();
    const addLocation = ref();
    const open = () => {
      show.value = true;
      nextTick(() => {
        //MsgBox(addLocation.value)
        show.value = mask(addLocation.value)
      })
    }
    const changeRoute = () => {
      let m = map.value;
      let o = oRef.value;
      trayLocation.value = 0;

      if (id < 0) {
        me.getStoredList("emed").then((emed) => {
          emed.forEach((e) => {
            if (e.tmpId == Math.abs(id)) {
              me.o = e;
              m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
              me.$refs.province.load({ code: me.o.region || "02" });
              trayLocation.value = e.lat && e.lon;
              alert(me.trayLocation);
            }
          });
        });
      } else if (Number(id)) {
        axios
          .get("/api/desarrollo-social/emed/" + id)
          .then(({ data }) => {
            const o = data;
            if (o.province) {
              o.province = pad(o.province, 4);
              o.region = o.province.substring(0, 2);
            }
            if (o.district) o.district = pad(o.district, 6);
            trayLocation.value = 1;
            oRef.value = o;
            m.addFeature({ draggable: true, lat: o.lat, lon: o.lon }, { zoom: 15 });
            province.value.load({ code: o && o.region || '02' });
          });
      } else {
        setTimeout(() => {
          try {
            let s = localStorage.getItem("setting");
            if (s) {
              s = JSON.parse(s);
              let o = oRef.value;
              if (s.region) o.region = s.region.code;
              /*if (s.province) o.province = s.province.code;
              if (s.district) o.district = s.district.code;
              if (s.town) o.codigoCCPP = s.town.id;
              */
              //o.town = s.town;
            }
          } catch (e) {
            console.log(e);
          }
          province.value.load({ code: o && o.region || '02' });
        })
      }
    }
    onMounted(() => {
      changeRoute();
    })
    const mapBuild = ({ addFeature }) => {
      let o = oRef.value;
      if (0 > o.lon) {
        addFeature(o, {});
      }
    }
    const translateend = ({ lat, lon }) => {
      oRef.value = { ...oRef.value, lat, lon }
    }
    const addMarker = (option) => {
      const _map = map.value;
      if (_map.empty()) {
        trayLocation.value = 1;
        if (option) {
          Geolocation.getCurrentPosition().then(({ coords: { latitude, longitude } }) => {
            _map.addFeature({ draggable: true, lat: latitude, lon: longitude }, { zoom: 15 });
          });
        } else {
          const center = _map.map.getView().getCenter();
          _map.addFeature({ draggable: true, lat: center[1], lon: center[0] }, { zoom: 15 });
        }
      } else {
        if (option) {




          Geolocation.getCurrentPosition().then(({ coords: { latitude, longitude } }) => {
            oRef.value = { ...oRef.value, lat: latitude, lon: longitude };
            const coordinates = fromLonLat([longitude, latitude])
            _map.map.getLayerById().getSource().getFeatures()[0].getGeometry().setCoordinates(coordinates);
            _map.map.getView().animate({
              center: coordinates,
              zoom: 15,
              duration: 500,
            });
          });
        } else {
          const features = _map.map.getLayerById().getSource().getFeatures()
          _map.map.getView().animate({
            center: features[0].getGeometry().getCoordinates(),
            zoom: 15,
            duration: 500,
          });
        }
      }
    }
    const close = ({ data: { id, tmpId, uploaded }, success }) => {
      let o = oRef.value;
      const _id = o.id;
      if (success === true) {
        o = { ...o, id, tmpId }
        if (uploaded) {
          delete o.tempFile;
        }
      }
      let nid = o.tmpId ? -o.tmpId : o.id;
      if (_id != nid) {
        router.replace("/admin/desarrollo-social/emed/" + nid);
      }
      oRef.value = o;
    }

    return { show, addLocation, open, o: oRef, map, mapBuild, addMarker, province, trayLocation, close, translateend }
  },
  created() {
    /*let me = this;
    me.$on("sync", (o) => {
      me.getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (e.tmpId == Math.abs(o.tmpId)) {
            if (e.action)
              e.action.forEach((e) => {
                if (o.action)
                  o.action.forEach((o) => {
                    if (o.tmpId == e.tmpId) {
                      e.id = o.id;
                      e.synchronized = o.synchronized;
                    }
                  });
                e.emedId = o.id;
              });
            if (e.damage_salud)
              e.damage_salud.forEach((e) => {
                if (o.damage_salud)
                  o.damage_salud.forEach((o) => {
                    if (o.tmpId == e.tmpId) {
                      e.id = o.id;
                      e.synchronized = o.synchronized;
                    }
                  });
                e.emedId = o.id;
              });
            if (e.damage_ipress)
              e.damage_ipress.forEach((e) => {
                if (o.damage_ipress)
                  o.damage_ipress.forEach((o) => {
                    if (o.tmpId == e.tmpId) {
                      e.id = o.id;
                      e.synchronized = o.synchronized;
                    }
                  });
                e.emedId = o.id;
              });
            _.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });*/
  },
  methods: {
    inputCCPP(a, b) {
      this.o.ccpp = b ? b.object.name || "" : "";
    },
    process(o) {
      if (!this.trayLocation) {
        MsgBox("Debe tratar de obtener la geolocalización.");
        return false;
      }
      return o;
    },
    async getCurrentPosition() {
      let me = this;
      //const {Geolocation} = Plugins;
      const c = await Geolocation.getCurrentPosition();
      me.o.lat = c.coords.latitude;
      me.o.lon = c.coords.longitude;
    },
    getCoordinates() {
      let me = this;
      if (me.getCurrentPosition) {
        me.getCurrentPosition();
      } else
        _.getLocation().then(function (c) {
          me.o.lat = c.coords.latitude;
          me.o.lon = c.coords.longitude;
        });
    },
  },
});
</script>
<style>
.column.v-button {
  display: flex;
  width: 90px;
  flex-direction: column;
}

.column.v-button>svg {
  font-size: 20px;
  margin-bottom: 10px;
  margin-right: 0px;
}
</style>