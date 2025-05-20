<template>

  <v-page action="/api/desarrollo-social/people" :title="o.synchronized" header="Ver Persona" store="people" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    ">
    <div class="v-form">
      <label>ID:</label>
      <div>
        {{ pad(o.id, 4) }}
      </div>
      <v-fieldset legend="Datos generales">
        <label>Documento:</label>
        <div>{{ o.documento_tipo }} - {{ o.documento_nro }}</div>

        <label>Nombre Completo:</label>
        <div>{{ o.ape_paterno }} {{ o.ape_materno }} {{ o.nombres }}</div>

        <label>Fecha Nacimiento:</label>
        <div>{{ date(o.fecha_nacimiento, 'date-') }}</div>

        <label>Descripción:</label>
        <div>{{ o.description || '---' }}</div>
      </v-fieldset>
      <v-fieldset legend="Ubicación">
        <label>Región:</label>
        <div>ANCASH</div>
        <label>Centro poblado:</label>
        <div>{{ o.ccpp || '---' }}</div>
        <label>Referencia:</label>
        <div>{{ o.referencia || '---' }}</div>
      </v-fieldset>

      <v-fieldset legend="Coordenadas" style="width: auto">
        <div class="center coordinates" v-if="(o.lat && o.lat != 0) || (o.lon && o.lon != 0)">
          <a :href="'https://www.google.com/maps/search/?api=1&query=' +
            o.lat +
            ',' +
            o.lon
            " target="_blank">({{ o.lat ? o.lat : "---" }},{{ o.lon }})</a>
        </div>
      </v-fieldset>
      <v-fieldset legend="Atenciones">
        <v-table autoload="false" :scrollable="true" :style="{ maxHeight: maxHeight }"
          src="/api/desarrollo-social/attention/0/0" :value="o.damage_salud" store="people_attention"
          row-style-class_="row.synchronized?'green':(row.tmpId>0?'yellow':'')" ref="attention" :filters="filters"
          @row-select="selections.damage_salud = $event.current">
          <template v-slot:default="{ row, index }">
            <td header="N°" class="center" width="40">
              {{ pad(index + 1, 2) }}
            </td>
            <td header="Codigo Unico" class="right" width="80">{{ row.codigo_unico }}</td>
            <td header="Cita" width="200">{{ row.id_cita }}</td>
            <td header="Fecha_Atencion" width="120" class="center">{{ row.fecha_atencion }}</td>
            <td header="Codigo_Item" class="center" width="120">{{ row.codigo_item }}</td>
            <td header="Correlativo Item" width="120" class="center">{{ row.id_correlativo_item }}</td>
            <td header="Valor Lab" width="120" class="center">{{ row.valor_lab }}</td>
            <td header="Correlativo Lab" width="120" class="center">{{ row.id_correlativo_lab }}</td>
            <td header="Peso" width="120" class="center">{{ row.peso }}</td>
            <td header="Talla" width="120" class="center">{{ row.talla }}</td>
            <td header="Hemoglobina" width="120" class="center">{{ row.hemoglobina }}</td>
            <td header="Coordenadas" width="120" class="center">
              <a v-if="row.lat || row.lon" :href="'https://www.google.com/maps/search/?api=1&query=' +
                row.lat +
                ',' +
                row.lon
                " target="_blank"><i class="fa fa-map-marker"></i></a>
            </td>
          </template>
        </v-table>
        <div class="right" style="margin-top: 10px" v-if="1 || perms.EMED_REGISTER && o.editable">
          <v-button icon="fa-trash" :disabled="!selections.damage_salud" @click="destroy"
            v-if="perms.EMED_ADMIN"></v-button>
          <v-button icon="fa-pen" :disabled="!selections.damage_salud" @click="edit"></v-button>
          <v-button icon="fa-plus" @click="add('attention', o)"></v-button>
        </div>
      </v-fieldset>

    </div>
    <center v-if="perms.EMED_REGISTER && o.editable">
      <v-button style="margin-left: 10px" value="Editar" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
        $router.replace(
          '/admin/desarrollo-social/people/' +
          (o.tmpId ? -o.tmpId : o.id) +
          '/edit'
        )
        "></v-button>
    </center>
  </v-page>
</template>
<script>
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ui, db } from 'isobit-ui'
import axios from 'axios'
export default ui({
  props: ["id"],
  created() {
    let me = this;
    me.getStoredList("people").then((emeds) => {

      /*
      me.$on("destroyed", (e, storeName) => {
        e.forEach((o) => {
          emeds.forEach((e) => {
            if (
              (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
              e.id == o.emedId
            ) {
              console.log(storeName);
              let sn = storeName.replace("emed_", "");
              console.log(e);
              console.log(sn);
              me.setStoredList(storeName,
                e[sn] = e[sn].filter(r => r.tmpId != o.tmpId)
                || []);
              _.db
                .transaction(["people"], "readwrite")
                .objectStore("people")
                .put(e);
            }
          });
 
 
 
        });
      });*/
    });
    /*this.$on("sync", (o) => {
      me.getStoredList("people").then((emeds) => {
        emeds.forEach((e) => {
          if (e.tmpId == Math.abs(o.tmpId)) {
            e.visits.forEach((visit) => {
              if (o.visits)
                o.visits.forEach((o) => {
                  if (o.tmpId == visit.tmpId) {
                    visit.id = o.id;
                    visit.synchronized = o.synchronized;
                  }
                });
              visit.emedId = o.id;
            });
            _.db
              .transaction(["people"], "readwrite")
              .objectStore("people")
              .put(e);
          }
        });
      });
    });*/
  },
  data() {
    return {
      count: 0,
      delay: 400,
      clicks: 0,
      timer: null,
      selections: { damage_salud: null, damage_ipress: null, action: null },
      k: 0,
      dd: [],
      maxHeight: '400px',
      o: { synchronized: null, files: [] },
    };
  },
  methods: {
    close() { },
    add(table, o) {
      this.open(
        "/admin/desarrollo-social/people/" + o.id + "/add/" + table.replace('_', '-'),
        this.$refs[table].load
      );
    },
    loadTables() {
      let refs = this.$refs;
      for (let e in refs) {
        if (refs[e] && refs[e].load) refs[e].load();
      }
    },
    changeRoute() {
      const me = this,
        id = me.id;
      if (id < 0) {
        me.getStoredList("people").then((people) => {
          people.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              let o = e;
              o.files = o.files || [];
              me.setStoredList("emed_action", o.action || []);
              me.setStoredList("emed_damage_ipress", o.damage_ipress || []);
              me.setStoredList("emed_damage_salud", o.damage_salud || []);
              me.setStoredList("emed_file", o.files || []);
              me.o = o;
              me.filters.people = e.id;
              me.loadTables();
            }
          });
        });
      } else if (Number(id)) {
        me.filters.people = me.id;
        let loaded = 0;
        me.getStoredList("people").then((people) => {
          people.forEach((e) => {
            if (e.id == me.id) {
              let o = e;
              me.setStoredList("emed_action", o.action || []);
              me.setStoredList("emed_damage_ipress", o.damage_ipress || []);
              me.setStoredList("emed_damage_salud", o.damage_salud || []);
              me.setStoredList("emed_file", o.files || []);
              me.o = o;
              me.filters.people = e.id;
              //se espera q se cargue la data de los setStoredList
              me.loadTables();
              loaded = 1;
            }
          });
        });
        axios
          .get("/api/desarrollo-social/people/" + id)
          .then((response) => {
            let o = response.data;
            o.files = o.files || [];
            me.o = o;
            if (!loaded) me.loadTables();
          });
      }
    },
    syncImagen(file) {

      let me = this;
      me.clicks++
      if (me.clicks === 1) {
        this.timer = setTimeout(function () {
          if (me.app.online) {
            if (!file.src && file.localSrc) {
              fetch(file.localSrc)
                .then((r) => r.blob())
                .then((b) => {
                  me.file = file;
                  me.$refs.uploader.submitFile(b, "name." + file.format);
                });
            }
          } else {
            //open file
          }
          me.clicks = 0
        }, this.delay);
      } else {
        clearTimeout(this.timer);
        this.dblclickImagen(file);
        me.clicks = 0;
      }

    },
    async deleteFile(file) {
      let me = this, o = me.o;
      if (me.app.online && file.id > 0) {
        await axios.delete('/api/desarrollo-social/people/file/' + file.id);
      }
      o.files = o.files.filter((e) => e.id != file.id);
      if (!me.app.online) {
        db()
          .transaction(["people"], "readwrite")
          .objectStore("people")
          .put(o);
      }
    },
    dblclickImagen(item) {
      window.open(item.src || item.localSrc, "_blank");
    },
    changeImage(result) {
      let me = this, o = me.o;
      me.count = 0;
      if (!result.src && result.tempFile)
        result.src = me.baseURL.replace('/wp-json', '') + "/uploads/" + result.tempFile;
      if (me.file) {
        //put src to temporal reference me.file when is sync by dblclick
        me.file.src = result.src;
        //update store
        delete me.file;
      } else {
        o.files.push(result);
      }
      result.emedId = o.id;
      console.log('me.online==', me.app);
      if (!me.app.online) {
        result.tmpId = 1 * (new Date());
        result.id = -result.tmpId;
        console.log('o==', o);
        db()
          .transaction(["people"], "readwrite")
          .objectStore("people")
          .put(o);
      } else {
        axios.post("/api/desarrollo-social/people/file", { src: result.src, emedId: result.emedId })
      }
    },
    uploaderClick(u) {
      let me = this;
      me.count++;
      console.log(me.count);
      Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
      }).then((result) => {

        me.count--;

        if (me.count == 0) {

          if (result.path) {
            let fs = Filesystem;
            fs.readFile({
              path: result.path,
            }).then(function (r) {
              let fn = new Date().getTime() + ".jpeg";

              fs.writeFile({
                data: r.data,
                path: fn,
                directory: Directory.Data,
              }).then(function () {
                fs.getUri({
                  path: fn,
                  directory: Directory.Data,
                }).then(function (s) {
                  let src = Capacitor.convertFileSrc(s.uri);
                  fetch(src)
                    .then((r) => r.blob())
                    .then((b) => {
                      if (me.app.online) {
                        u.submitFile(b, "name." + result.format);
                      } else {
                        me.changeImage({ ...result, localSrc: src, src: null });
                      }
                    });

                });
              });
            });
          } else
            fetch(result.webPath)
              .then((r) => r.blob())
              .then((b) => {
                console.log(result);
                if (me.app.online)
                  u.submitFile(b, "name." + result.format);
                else {

                  me.changeImage({ ...result, localSrc: URL.createObjectURL(b), src: null });
                }
              });
        }
      });
    }
  },
  mounted() {
    const me = this;
    //if (this.$children[0]) me.app.title = this.$children[0].header;*/
    me.changeRoute();
  },
});
</script>
<style scoped>
#dateDiff:empty,
#msg:empty {
  display: none;
}

#dateDiff {
  border-radius: 4px;
  background-color: #fdfad9;
  border: 1px solid #dddddd;
  padding: 5px 10px;
  margin-top: 10px;
}

.coordinates {
  margin-top: 10px;
  border: 1px solid #ffcf00;
  background-color: #ffff80;
  padding: 10px;
}
</style>