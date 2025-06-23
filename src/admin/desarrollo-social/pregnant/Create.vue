<template>
  <v-page action="/api/desarrollo-social/pregnant" :header="(o.id ? 'Editar' : 'Crear') + ' Gestante'" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    " store="pregnant">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id ? o.id : 0, 4) }}</div>
      <label>DIRESA:</label>
      <div>ANCASH</div>
      <label>Red:</label>
      <v-select v-model="o.red" ref="red" @input="$refs.microredSelect.load({ Codigo_Red: o.red })" required>
        <option>Select One...</option>
        <v-options store="red" display-field="name" value-field="code" />
      </v-select>
      <label>Microred:</label>
      <v-select autoload="false" :disabled="!o.red" store="microred" ref="microredSelect" v-model="o.microred"
        :required="true" @input="$refs.establishment.load({ microredCode: o.microred })">
        <option>Select One...</option>
        <v-options store="microred" display-field="name" value-field="code" />
      </v-select>
      <label>Establecimiento:</label>
      <v-select ref="establishment" @input="inputEstablishment" v-model="o.codigoEESS" :autoload="false"
        :disabled="!o.microred" :required="true">
        <option>Select One...</option>
        <v-options store="establishment" display-field="name" value-field="code" />
      </v-select>

      <label>Provincia:</label>
      <div v-if="!o.region" class="alert">No hay una región por defecto</div>
      <v-select ref="province" :disabled="!o.region" storage="province_selected" v-model="o.province" :required="true"
        @input="$refs.district.load({ code: o.province })">
        <option>Select One...</option>
        <v-options store="province" display-field="name" value-field="code" />
      </v-select>
      <label>Distrito:</label>
      <v-select ref="district" :autoload="false" store="district_selected" :disabled="!o.province" v-model="o.district"
        name="district" required="true" @input="$refs.cpSelect.load({ id: o.district })">
        <option value="">Select One...</option>
        <v-options store="district" value-field="code" display-field="name" />
      </v-select>

      <label>Centro Poblado:</label>
      <v-select :autoload="false" :label="o.districtName ? o.districtName : '---'" :disabled="!o.district" required
        ref="cpSelect" v-model="o.codigoCCPP" @input="inputCCPP">
        <option value="">Seleccionar Opción</option>
        <v-options store="town" display-field="name" value-field="id" />
      </v-select>
      <label>Sector:</label>
      <input type="text" v-model="o.sector" required />
      <label>Dirección:</label>
      <input type="text" v-model="o.address" required title="Direccion" />
      <v-fieldset legend="DATOS PERSONALES">
        <label>DNI:</label>
        <input type="text" v-model="o.numeroDNI" class="center" maxlength="12" required title="Numero DNI" />
        <label>Apellidos:</label>
        <input type="text" v-model="o.apellidoPaterno" required />
        <label>Nombres:</label>
        <input type="text" v-model="o.nombres" required />

        <label>Fecha Nacimiento:</label>
        <v-calendar v-model="o.fechaNacimiento" required title="Fecha Nacimiento" :max="today" />
        <label>Estado Civil:</label>
        <v-select v-model="o.estadoCivil" required title="Estado Civil">
          <option value="">Select One...</option>
          <option value="SOLTERO">SOLTERO (A)</option>
          <option value="CASADO">CASADO (A)</option>
          <option value="DIVORCIADO">DIVORCIADO (A)</option>
          <option value="VIUDO">VIUDO (A)</option>
          <option value="CONVIVIENTE">CONVIVIENTE</option>
        </v-select>
        <label>Grado Instrucción:</label>
        <v-select v-model="o.gradoInstruccion" required>
          <option value="">Select One...</option>
          <option value="PRIMARIA COMPLETA">PRIMARIA COMPLETA</option>
          <option value="PRIMARIA INCOMPLETA">PRIMARIA INCOMPLETA</option>
          <option value="SECUNDARIA COMPLETA">SECUNDARIA COMPLETA</option>
          <option value="SECUNDARIA INCOMPLETA">SECUNDARIA INCOMPLETA</option>
          <option value="SUPERIOR COMPLETA">SUPERIOR COMPLETA</option>
          <option value="SUPERIOR INCOMPLETA">SUPERIOR INCOMPLETA</option>
          <option value="SUPERIOR UNIVERSITARIO COMPLETO">
            SUPERIOR UNIVERSITARIO COMPLETO
          </option>
          <option value="SUPERIOR UNIVERSITARIO INCOMPLETO">
            SUPERIOR UNIVERSITARIO INCOMPLETO
          </option>
          <option value="NO ESTUDIO">NO ESTUDIO</option>
        </v-select>
        <label>Gestante Numero Celular:</label>
        <input type="tel" v-model="o.gestanteNumeroCelular" required title="Gestante Numero Celular" />
        <label>Gestante Familia Celular:</label>
        <input type="tel" v-model="o.gestanteFamiliaCelular" required title="Gestante Familia Celular" />
      </v-fieldset>

      <v-fieldset legend="DATOS OBSTETRICOS">
        <label>Gestante:</label>
        <v-number v-model="o.gestanteNumero" required title="Gestante Numero" />
        <label>Paridad:</label>
        <v-number v-model="o.gestanteParidad" required title="Gestante Paridad" />
        <label>FUR:</label>
        <v-calendar v-model="o.gestanteFUR" required title="Gestante FUR" :max="today" @invalid="invalidDate"
          @change="onInputFUR" />
        <label>FPP:</label>
        <div style="padding: 5px; border: 1px solid lightgrey; border-radius: 8px">
          {{ o.gestanteFPP }}
        </div>
        <label>EG. En Semanas:</label>
        <v-number v-model="o.gestanteEdadGestacionalSemanas" required title="Gestante Edad Gestacional Semanas" />
        <label>Riesgo Obstetrico:</label>
        <v-select v-model="o.gestanteRiesgoObstetrico" :required="true">
          <option>Select One...</option>
          <v-options store="cie" display-field="name" value-field="code" />
        </v-select>
      </v-fieldset>
      <v-fieldset legend="EMERGENCIA Y/O HOSPITALIZACION" closable="true" class="v-form">
        <label>Red:</label>
        <v-select v-model="o.emergencyRed" autoload="false" ref="emergencyRed" @input="
          $refs.emer_microred.load({ code: o.emergencyRed })
          ">
          <option>Select One...</option>
          <v-options store="red" display-field="name" value-field="code" />
        </v-select>
        <label>Microred:</label>
        <v-select autoload="false" :disabled="!o.emergencyRed" store="microred" ref="emer_microred"
          v-model="o.emergencyMicrored" :required="true"
          @input="$refs.emer_establishment.load({ microredCode: completeMicroredCode(o.emergencyMicrored), type: 1 })">
          <option>Select One...</option>
          <v-options store="microred" display-field="name" value-field="code" />
        </v-select>
        <label>IPRESS:</label>
        <v-select ref="emer_establishment" v-model="o.lugarIPRESS" :autoload="true" :disabled="!o.emergencyMicrored">
          <option>Select One...</option>
          <v-options store="establishment" display-field="name" value-field="code" />
        </v-select>
        <label>Diagnostico:</label>
        <v-textarea type="text" v-model="o.lugarDiagnostico" title="Lugar Diagnostico" />
        <label>Fecha:</label>
        <v-calendar v-model="o.lugarFechaEmergencia" title="Lugar Fecha Emergencia" />
        <label>Referencia:</label>
        <v-calendar v-model="o.lugarFechaReferida" />
      </v-fieldset>
      <v-fieldset legend="MIGRACIÓN" class="v-form" closable="true" v-model="o.migration">
        <label>Red:</label>
        <v-select v-model="o.migra_red" autoload="false" ref="migra_red" @input="
          $refs.migra_microredSelect.load({ Codigo_Red: o.migra_red })
          ">
          <option>Select One...</option>
          <v-options store="red" display-field="name" value-field="code" />
        </v-select>
        <label>Microred:</label>
        <v-select autoload="false" :disabled="!o.migra_red" store="microred" ref="migra_microredSelect"
          v-model="o.migra_microred" :required="true" @input="
            $refs.migra_establishment.load({ microredCode: completeMicroredCode(o.migra_microred) })">
          <option>Select One...</option>
          <v-options store="microred" display-field="name" value-field="code" />
        </v-select>
        <label>IPRESS:</label>
        <v-select ref="migra_establishment" v-model="o.migracionIPRESS" :autoload="false" :disabled="!o.migra_microred"
          :required="true">
          <option>Select One...</option>
          <v-options store="establishment" display-field="name" value-field="code" />
        </v-select>

        <label>Observacion:</label>
        <v-textarea v-model="o.migracionObservacion" title="Migracion Observacion" />
      </v-fieldset>
      <v-fieldset legend="Coordenadas" style="width: auto">
        <div class="right">
          <v-button icon="fa-compass" value="Obtener Geolocalización" @click="getCurrentPosition" />
        </div>
        <div class="center coordinate" v-if="(o.lat && o.lat != 0) || (o.lon && o.lon != 0) || tryLocation">
          ({{ o.lat || 0 }},{{ o.lon || 0 }})
        </div>
      </v-fieldset>
      <label>Estado:</label>
      <v-select v-model="o.migracionEstado" required>
        <option value="">Select One...</option>

        <option :value="item" :key="item" v-for="item in ['GESTANTE', 'GESTANTE CAPTADA', 'PUERPERA', 'MER']">
          {{ item }}
        </option>
      </v-select>
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
      <v-button style="margin-left: 10px" value="Ver" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
        $router.replace(
          '/admin/desarrollo-social/pregnant/' + (o.tmpId ? -o.tmpId : o.id)
        )
        "></v-button>
    </center>
  </v-page>
</template>
<script>
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Geolocation } from "@capacitor/geolocation";
import { ui, date } from 'isobit-ui'
import { onMounted, nextTick, ref } from 'vue';
import axios from 'axios'
export default ui({
  props: ["id"],

  data() {
    return {
      count: 0,
      today: null,
      red: [],
      risk: [
        "INVIDENTE",
        "DIFICULTAD PIERNAS",
        "DISCAPACIDAD CARA",
        "DISCAPACIDAD CARA Y LABIOS",
        "DISCAPACIDAD MENTAL",
        "EXTREMIDADES",
        "MINUSVALIDA",
        "PARALISIS",
        "SORDO MUDO",
        "SINDROME DOWN",
        "SORDERA",
        "SORDO MUDO",
        "TARTAMUDO",
        "TRANSTORNO DE CADERA",
        "Otro",
      ],
      areaResidencia: [
        { id: "U", name: "URBANO" },
        { id: "M", name: "URBANO MARGINAL" },
        { id: "R", name: "RURAL" },
      ],
      resultadoVisita: ["EJECUTADO", "RECHAZADO", "ABANDONADO"],
      tryLocation: null,
      o: {
        id: null,
        synchronized: null,
        establecimientoSalud: null,
        lat: null,
        tmpId: null,
        lon: null,
        red: "02",
        microred: null,
        gestanteFPP: null,
        codigoCCPP: null,
        ext: { src: null },
      },
    };
  },
  setup({ id, router }) {
    const oRef = ref({});
    const today = ref(date(new Date(), 'date-'));
    const map = ref(null);
    const tryLocation = ref(null);
    const province = ref();
    const addLocation = ref();
    const emergencyRed = ref();
    const migra_red = ref();
    const changeRoute = () => {
      tryLocation.value = 0;
      emergencyRed.value.load();
      migra_red.load();
      let m = map.value;
      let o = oRef.value;
      tryLocation.value = 0;
      if (id < 0) {
        console.log(me.getStoredList("pregnant"));
        me.getStoredList("pregnant").then((pregnant) => {
          console.log(pregnant);
          pregnant.forEach((e) => {
            if (e.tmpId == Math.abs(id)) {
              me.o = e;
              console.log(e.visits);
              m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
              province.value.load({ code: me.o.region || "02" });
              tryLocation.value = e.lat && e.lon;
            }
          });
        });
      } else if (Number(id)) {
        axios
          .get("/api/desarrollo-social/pregnant/" + id)
          .then(({ data }) => {
            const o = data;
            if (o.red) o.red = pad(o.red, 2);
            if (o.province) {
              o.province = pad(o.province, 4);
              o.region = o.province.substring(0, 2);
            }
            if (o.district) o.district = pad(o.district, 6);
            tryLocation.value = 1;
            oRef.value = o;
            o.ext.src = null;
            o.ext.tempFile = null;
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
              o.red = s.red;
              o.microred = s.microred;
              o.codigoEESS = s.establishment;

              if (s.region) o.region = s.region.code;
              if (s.province) o.province = s.province.code;
              if (s.district) o.district = s.district.code;
              if (s.town) o.codigoCCPP = s.town.id;
              o.codigo_ccpp = s.town;
              oRef.value = o;
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
    const close = ({ data: { id, tmpId, uploaded }, success }) => {
      let o = oRef.value;
      const _id = o.id;
      if (success === true) {
        o = { ...o, id, tmpId }
        if (uploaded) {
          delete o.tempFile;
          delete o.ext.pending;
        }
      }
      let nid = o.tmpId ? -o.tmpId : o.id;
      if (_id != nid) {
        router.replace("/admin/desarrollo-social/pregnant/" + nid);
      }
      oRef.value = o;
    }
    const getCurrentPosition = () => {
      tryLocation.value = 1;
      Geolocation.getCurrentPosition().then(({ coords: { latitude, longitude } }) => {
        let o = oRef.value;
        o.lat = latitude;
        o.lon = longitude;
        oRef.value = o;
      });
    }
    return {
      addLocation, open, o: oRef, map, mapBuild, province, today,
      tryLocation, emergencyRed, close, getCurrentPosition
    }
  },
  created() {
    /*this.$on("sync", (o) => {
      me.getStoredList("pregnant").then((pregnants) => {
        pregnants.forEach((e) => {
          if (e.tmpId == Math.abs(o.tmpId)) {
            e.peoples.forEach((e) => {
              if (o.peoples)
                o.peoples.forEach((o) => {
                  if (o.tmpId == e.tmpId) {
                    e.id = o.id;
                    e.synchronized = o.synchronized;
                  }
                });
              e.masterId = o.id;
            });
            e.agreements.forEach((e) => {
              if (o.agreements)
                o.agreements.forEach((o) => {
                  if (o.tmpId == e.tmpId) {
                    e.id = o.id;
                    e.synchronized = o.synchronized;
                  }
                });
              e.masterId = o.id;
            });
            window._.db
              .transaction(["pregnant"], "readwrite")
              .objectStore("pregnant")
              .put(e);
          }
        });
      });
    });*/
  },
  methods: {
    onInputFUR() {
      let o = this.o;
      if (o.gestanteFUR) {
        o = new Date(o.gestanteFUR);
        o.setFullYear(o.getFullYear() + 1);
        o.setMonth(o.getMonth() - 3);
        o.setDate(o.getDate() + 7);
      }
      this.o.gestanteFPP = date(o, "date-");
    },
    inputCCPP(a, b) {
      this.o.ccpp = b && b.object ? (b.object.name) : "";
    },
    inputEstablishment(a, b) {
      this.o.establecimientoSalud = b && b.object ? b.object.name : "";
    },
    process(o) {
      if (!this.tryLocation) {
        this.MsgBox("Debe tratar de obtener la geolocalización.");
        return false;
      }
      return o;
    },
    completeMicroredCode(v) { return /*'02'+*/ v; },
    errorImg() { },
    changeImage(result) {
      const me = this,
        o = me.o;
      o.tempFile = result.tempFile;
      if (o.id > 0) {
        result.id = o.id;
        axios
          .post("/api/desarrollo-social/pregnant/attach-image", result)
          .then(() => {
            delete o.ext.pending;
            delete o.tempFile;
            if (o.tmpId) {
              const objectStore = window._.db
                .transaction(["pregnant"], "readwrite")
                .objectStore("pregnant");
              const item = objectStore.get(o.tmpId);
              item.onsuccess = function () {
                objectStore.put(o);
              };
            }
            me.app.toast("Imagen adjuntada!");
          });
      }
    },
    syncImage() {
      const me = this;
      fetch(me.o.ext.src)
        .then((r) => r.blob())
        .then(function (b) {
          me.$refs.uploader.submitFile(b, "name.jpg");
        });
    },
    uploaderClick(uploader) {
      const me = this,
        o = me.o;
      me.count++;
      Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
      }).then(function (result) {
        me.count--;
        if (me.count == 0) {
          const fs = Filesystem;
          if (result.path) {
            o.ext.path = result.path;
            fs.readFile({
              path: result.path,
            }).then(function (r) {
              const filename = new Date().getTime() + ".jpeg";
              //Aqui se guarda una copia del archivo
              fs.writeFile({
                data: r.data,
                path: filename,
                directory: Directory.Data,
              }).then(function () {
                fs.getUri({
                  path: filename,
                  directory: Directory.Data,
                }).then(function (s) {
                  //incluso si se envia la imagen es mejor tener una referencia local
                  me.o.ext.src = Capacitor.convertFileSrc(s.uri);
                  me.o.ext.pending = true;
                  if (me.app.connected) {
                    fetch(me.o.ext.src)
                      .then((r) => r.blob())
                      .then(function (b) {
                        uploader.submitFile(b, "name." + result.format);
                      });
                  }
                });
              });
            });
          } else {
            fetch(result.webPath)
              .then((r) => r.blob())
              .then(function (b) {
                o.ext.src = result.webPath;
                o.ext.pending = 1;
                if (me.app.connected)
                  uploader.submitFile(b, "name." + result.format);
              });
          }
        }
      });
    },
    invalidDate(e) {
      this.MsgBox('Fecha no valida ' + e.value);
    }
  },
});
</script>

<style scope>
.coordinate {
  padding: 10px 10px 15px;
  margin-top: 10px;
}

@media (prefers-color-scheme: light) {
  .coordinate {
    background-color: rgb(255, 255, 128)
  }
}

@media (prefers-color-scheme: dark) {
  .coordinate {
    background-color: rgb(255 255 128 / 13%);
  }
}
</style>