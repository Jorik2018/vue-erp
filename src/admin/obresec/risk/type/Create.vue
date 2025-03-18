<template>
  <v-page action="/admin/obresec/api/crime" :header="(o.id ? $t('Edit') : $t('Create')) + ' ' + $t('Crime')">
    <div class="v-form" style="flex:1">
      <label>{{ $t('Name') }}:</label>
      <v-textarea rows="1" required="true" class="ucase" id="name" v-model="o.name" title="#{bundle.Name}" />
      <label>{{ $t('Category') }}:</label>
      <v-select v-model="o.crimeCategoryId">
        <option value="">{{ $t('SelectOneMessage') }}</option>
        <v-options url="/admin/obresec/api/crime-category/0/0" value-field="id" display-field="name" />
      </v-select>
      <label>{{ $t('Shape') }}:</label>
      <v-autocomplete id="shape" floating="true" v-on:contextmenu="shapeInput(1, 1)" v-on:input="shapeInput"
        v-bind:data="shapes" v-model="o.shape">
        <template v-slot:label="{ selected }">
          <span v-bind:key="o.color" v-on:click="$refs.color.focus(); $refs.color.click()"
            v-bind:style="{ color: o.color, backgroundColor: o.color }" class="shape" v-bind:data-symbol="selected">
          </span>
          <input id="color" ref="color" style="margin: 5px auto;" type="color" v-on:input="shapeInput"
            v-model="o.color" />
        </template>

        <template v-slot="{ row }">
          <div class="center">
            <span v-bind:key="row + '-' + o.color" v-bind:style="{ color: o.color, backgroundColor: o.color }"
              class="shape" v-bind:data-symbol="row" />
          </div>
        </template>
      </v-autocomplete>
    </div>
    <center>
      <v-button :value="$t('Save')" icon="fa-save" v-on:click.prevent="save" />
      <v-button :value="$t('Shape')" icon="fa-ban" v-on:click.prevent="close" />
    </center>
  </v-page>
</template>
<script>
import { ui } from 'isobit-ui'
export default ui({
  props: ['id'],
  data() {
    return { shapes: ['0', 1, 2, 3, 4, 5, 6, 7, 8], o: { color: null, ext: { province: null }, districtId: null } };
  },
  created() {
    var me = this;
    if (me.id)
      axios.get('/api/obresec/crime-type/' + me.id).then((r) => {
        var o = r.data;
        if (o.shape == 0) o.shape = '0';
        if (o.color) o.color = '#' + o.color;
        me.o = o;
      });
  },
  updated() {
    this.shapeInput(this.o.shape);
  },
  methods: {
    shapeInput(e, o) {
      if (e) {
        var me = this;
        setTimeout(() => {
          _.drawShapes(me.$el.querySelectorAll((o ? '.v-list' : '.v-selection') + ' .shape:not(._)'));
        }, 100);
      }
    },
    process(o) {
      if (o.color) o.color = o.color.substring(1);
      return o;
    }
  }
});
</script>
