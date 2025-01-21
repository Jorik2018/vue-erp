<template>
  <v-form action="/api/desarrollo-social/vea-materno" :title="o.synchronized" header="VEA Materno" @resize="onResize"
    store="vea-materno" :class="o.id < 0 || (o.tmpId && !o.synchronized)
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
      <v-fieldset legend="Recursos movilizados ">
        <div>TODOS CON ORIGEN (IPRESS)</div>
        <label>N° Ambulancias:</label>
        <div>{{ o.ambulancias || '---' }}</div>
        <label>N° personal:</label>
        <div>{{ o.personal || '---' }}</div>
        <label>N° Brigadistas de salud:</label>
        <div>{{ o.brigadistas || '---' }}</div>
        <label>N° Equipo Técnico vea-materno:</label>
        <div>{{ o.equipo_tecnico || '---' }}</div>
      </v-fieldset>

      <v-fieldset legend="Coordenadas" v-if="(o.lat && o.lat != 0) || (o.lon && o.lon != 0)" style="width: auto">
        <div class="center coordinates">
          <a :href="'https://www.google.com/maps/search/?api=1&query=' +
            o.lat +
            ',' +
            o.lon
            " target="_blank">({{ o.lat ? o.lat : "---" }},{{ o.lon }})</a>
        </div>
      </v-fieldset>
    </div>
    <center style="margin-bottom: 10px">
      <v-button value="Editar" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
        $router.replace(
          '/admin/desarrollo-social/vea-materno/' +
          (o.tmpId ? -o.tmpId : o.id) +
          '/edit'
        )
        "></v-button>
    </center>
  </v-form>
</template>
<script>
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ui, db, getStoredList } from 'isobit-ui'
import axios from 'axios';

export default ui({

  props: ["id"],
  emits: {
    sync() {
      alert('sync')
    }
  },
  created() {
    const me = this;
    getStoredList("vea-materno").then((emeds) => {
      me.$on("destroyed", (e, storeName) => {
        e.forEach((o) => {
          emeds.forEach((e) => {
            if (
              (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
              e.id == o.emedId
            ) {
              console.log(storeName);
              const sn = storeName.replace("emed_", "");
              console.log(e);
              console.log(sn);
              me.setStoredList(storeName,
                e[sn] = e[sn].filter(r => r.tmpId != o.tmpId)
                || []);
              db()
                .transaction(["vea-materno"], "readwrite")
                .objectStore("vea-materno")
                .put(e);
            }
          });
        });
      });
    });
    console.log(me);
    /*
    this.$on("sync", (o) => {
      getStoredList("vea-materno").then((emeds) => {
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
            db()
              .transaction(["vea-materno"], "readwrite")
              .objectStore("vea-materno")
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
      width: null,
      maxHeight: '400px',
      o: { synchronized: null, files: [] },
    };
  },
  methods: {

    getScrollBarWidth() {
      let w = this.w;
      if (!w) {
        const el = document.createElement("div");
        el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
        document.body.appendChild(el);
        this.w = w = el.offsetWidth - el.clientWidth;
        el.remove();
      }
      return w;
    },
    onResize(e) {
      const w = e.$target.$el.offsetWidth - 44 - this.getScrollBarWidth();

      Array.prototype.forEach.call(
        this.$el.querySelectorAll(".v-datatable"),
        (e) => {
          e.style.width = w + "px";
          this.width = w;
        }
      );
    },
    close() { },
    add(table, o) {
      this.open(
        "/admin/desarrollo-social/vea-materno/" + o.id + "/add/" + table.replace('_', '-'),
        this.$refs[table].load
      );
    },
    loadTables() {
      const refs = this.$refs;
      for (const e in refs) {
        if (refs[e] && refs[e].load) refs[e].load();
      }
    },
    changeRoute() {
      const me = this, id = me.id;
      if (id < 0) {
        getStoredList("vea-materno").then((items) => {
          items.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              const o = e;
              o.files = o.files || [];
              me.setStoredList("emed_action", o.action || []);
              me.setStoredList("emed_damage_ipress", o.damage_ipress || []);
              me.setStoredList("emed_damage_salud", o.damage_salud || []);
              me.setStoredList("emed_file", o.files || []);
              me.o = o;
              me.loadTables();
            }
          });
        });
      } else if (Number(id)) {
        let loaded = 0;
        getStoredList("vea-materno").then((items) => {
          items.forEach((e) => {
            if (e.id == me.id) {
              const o = e;
              me.setStoredList("emed_action", o.action || []);
              me.setStoredList("emed_damage_ipress", o.damage_ipress || []);
              me.setStoredList("emed_damage_salud", o.damage_salud || []);
              me.setStoredList("emed_file", o.files || []);
              me.o = o;
              me.loadTables();
              loaded = 1;
            }
          });
        });
        axios
          .get("/api/desarrollo-social/vea-materno/" + id)
          .then((response) => {
            const o = response.data;
            o.files = o.files || [];
            me.o = o;
            if (!loaded) me.loadTables();
          });
      }
    },
    syncImagen(file) {

      const me = this;
      me.clicks++
      if (me.clicks === 1) {
        this.timer = setTimeout(function () {
          if (me.online) {
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
      const me = this, o = me.o;
      if (me.online && file.id > 0) {
        await axios.delete('/api/desarrollo-social/vea-materno/file/' + file.id);
      }
      o.files = o.files.filter((e) => e.id != file.id);
      if (!me.online) {
        db()
          .transaction(["vea-materno"], "readwrite")
          .objectStore("vea-materno")
          .put(o);
      }
    },
    dblclickImagen(item) {
      window.open(item.src || item.localSrc, "_blank");
    },
    changeImage(result) {
      const me = this, o = me.o;
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
      if (!me.online) {
        result.tmpId = 1 * (new Date());
        result.id = -result.tmpId;
        _.db
          .transaction(["vea-materno"], "readwrite")
          .objectStore("vea-materno")
          .put(o);
      } else {
        axios.post("/api/desarrollo-social/vea-materno/file", { src: result.src, emedId: result.emedId })
      }
    },
    uploaderClick(u) {
      const me = this;
      me.count++;
      console.log(me.count);
      Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
      }).then((result) => {

        me.count--;

        if (me.count == 0) {

          if (result.path) {
            const fs = Filesystem;
            fs.readFile({
              path: result.path,
            }).then(function (r) {
              const fn = new Date().getTime() + ".jpeg";

              fs.writeFile({
                data: r.data,
                path: fn,
                directory: Directory.Data,
              }).then(function () {
                fs.getUri({
                  path: fn,
                  directory: Directory.Data,
                }).then(function (s) {
                  const src = Capacitor.convertFileSrc(s.uri);
                  fetch(src)
                    .then((r) => r.blob())
                    .then((b) => {
                      if (me.online) {
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
                if (me.online)
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
    //if (this.$children[0]) me.app.title = this.$children[0].header;
    me.changeRoute();
  },
});
</script>
<style scoped>
.visit>>>table {
  width: 100%;
}

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