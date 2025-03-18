<template>
  <v-page action="/api/desarrollo-social/emed/damage-ipress" store="emed_damage_ipress" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    " v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Daño IPRESS'">
    <div class="v-form" style="flex:1">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>EMED:</label>
      <div>{{ pad(o.emedId || 0, 4) }}</div>
      <label>Red:</label>
      <v-select v-model="o.red" autoload="true" required="required" ref="red" v-on:input="
        $refs.microred.load({ code: o.red })
        ">
        <option value="">Select One...</option>
        <v-options store="red" display-field="name" value-field="code" />
      </v-select>
      <label>Microred:</label>
      <v-select autoload="false" :disabled="!o.red" store="microred" ref="microred" v-model="o.microred"
        :required="true" @input="$refs.establishment.load({ microredCode: /*'02' +*/ o.microred, type: 1 })">
        <option value="">Select One...</option>
        <v-options store="microred" display-field="name" value-field="code" />
      </v-select>
      <label>IPRESS:</label>
      <v-select ref="establishment" v-model="o.ipress" :autoload="false" :disabled="!o.microred">
        <option value="">Select One...</option>
        <v-options store="establishment" display-field="name" value-field="code" />
      </v-select>
      <label>Categoria:</label>
      <input maxlength="10" v-model="o.category" />
      <label>Estado:</label>
      <v-select v-model="o.status" required="required">
        <option value="">Select One...</option>
        <option v-for="type in ['AFECTADO OPERATIVO', 'AFECTADO INOPERATIVO']" :key="type" :value="type">
          {{ type }}
        </option>
      </v-select>
      <label>Observación:</label>
      <v-textarea maxlength="200" v-model="o.remark" />
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" v-on:click.prevent="save"></v-button>
    </center>
  </v-page>
</template>
<script>
import { ui } from 'isobit-ui'
import { ref } from 'vue'
import axios from 'axios'
export default ui({
  props: ["id", "action"],
  setup({ $on, router, getStoredList }) {
    const o = ref({ emedId: null, red: null });
    $on("sync", (data, o) => {
      getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if ((o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) || e.id == o.emedId) {
            e.agreements.forEach((e2, i) => {
              if (e2.tmpId == o.tmpId)
                e.damage_ipress[i] = o;
            });
            _.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
    $on("stored", (o, data) => {
      getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (
            (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
            e.id == o.emedId
          ) {
            e.damage_ipress = data;
            delete e.synchronized;
            _.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
    const close = ({ success, data }) => {
      if (success === true) {
        o.value = { ...o.value, id: data.id, tmpId: data.tmpId };
      }
      router.back();
    }
    return { close, o };
  },
  methods: {
    changeRoute() {
      let me = this,
        id = me.id,
        action = me.action;
      if (Number(id)) {
        if (action == "add") {
          me.o = { emedId: id };
        } else {
          if (id < 0) {
            me.getStoredList("emed").then((emeds) => {
              emeds.forEach((p) => {
                p.damage_ipress.forEach((v) => {
                  if (v.tmpId == Math.abs(me.id)) {
                    me.setStoredList("emed_damage_ipress", p.damage_ipress);
                    me.o = v;
                  }
                });
              });
            });
          } else
            axios
              .get("/api/desarrollo-social/emed/damage-ipress/" + id)
              .then((response) => {
                let o = response.data;
                if (o.red) o.red = me.pad(o.red, 2);
                if (o.microred) o.microred = me.pad(o.microred, 4);
                me.o = o;
              });
        }
      } else if (action == "add") {
        me.o = { emedId: id };
      }
    },
  },
  mounted() {
    let me = this;
    //if (me.$children[0]) me.app.title = me.$children[0].header;
    me.changeRoute();
  },
});
</script>