<template>
  <v-form v-if="o" :header="o.payrollTypeName + ' [' + o.year + '-' + pad(o.month, 2) + ']'" action="/api/hr/employee">
    <div class="v-form" style="padding:0px;display: flex;flex-direction: column;flex:1">
      <div style="display:flex; flex-grow:1; padding:10px; align-items:flex-end;">

        <v-button icon="fa fa-refresh" @click="refresh" />
        <div style="width: 10px;"></div>
        <v-button icon="fa fa-person-circle-plus" @click="addPerson" />
        <v-button icon="fa fa-person-circle-minus" class="red-light" @click="removePerson"
          :disabled="selectedRows.size === 0" />
        <div style="width: 10px;"></div>
        <v-button icon="fa fa-square-plus" @click="addConcept" :disabled="!(o.month && o.year)" />
        <v-button icon="fa fa-gear" @click="process" class="yellow-light" />
        <v-button title="Descargar" :disabled="!o.generateDate" icon="fa-download"
          @click.prevent="saveAs('/api/payroll/download', { id: 1 })"></v-button>

        <div style="margin-left:auto">
          <v-button icon="fa fa-save" @click="save" />
        </div>

      </div>
      <div style="display:flex;flex-direction:row;height: -webkit-fill-available;">
        <div data-v-72883fb8="" class="v-datatable undefined"
          style="width:300px;flex:0 0 300px; height: 0px;min-width: unset;min-height: -webkit-fill-available;"
          v--popup="1"><!----><!---->
          <div class="v-widget-header v-datatable-scrollable-header" style="position: relative; margin-right: 0px;">
            <div class="v-datatable-scrollable-header-box" ref="header" style="left: 0px; transform: translateX(0px);">
              <table class="v-cloned-header v-table"><!---->

                <tr v-for="(row, rowIndex) in headerRows" :key="rowIndex">
                  <th v-if="!rowIndex" style="width:30px; min-width: 30px" rowspan="2">
                    <input type="checkbox" @click.stop @change="toggleCheckbox(-1, $event)">
                  </th>
                  <th v-for="(cell, colIndex) in row" :title="cell.index" :key="colIndex" :colspan="cell.colspan"
                    :rowspan="cell.rowspan" :class="cell.class"
                    :style="{ ...cell.width ? { minWidth: cell.width + 'px', maxWidth: cell.width + 'px' } : (cell.colspan > 1 ? { width: '0px', textOverflow: 'ellipsis' } : {}), backgroundColor: cell.backgroundColor, color: cell.color }">
                    {{ cell.title }}
                  </th>
                </tr>
              </table>
            </div>
          </div>
          <div class="v-datatable-scrollable-body" ref="body1" style="overflow-y: auto; flex: 1 1 0%;"
            @scroll="onScrolling($event, 1)">
            <table class="v-table" style="width: 0px;">
              <tbody class="v-datatable-data"><!---->

                <tr v-for="(item, rowIndex) in items" :key="rowIndex"
                  :class="{ 'v-selected': selectedRows.has(rowIndex) }" @click="toggleRow(rowIndex)">
                  <td style="width:30px">
                    <input type="checkbox" :checked="selectedRows.has(rowIndex)" @click.stop
                      @change="toggleCheckbox(rowIndex, $event)">
                  </td>
                  <td v-for="(cell) in visibleHeaders" :width="cell.width || 90"
                    :style="{ ...cell.width ? { minWidth: cell.width + 'px', maxWidth: cell.width + 'px' } : {} }" >
<!--
                    <v-number v-if="cell.concept_id" placeholder="-" :title="'index=' + cell.concept_id"
                    v-model.number="item.values[cell.concept_id]" />
                -->
                  <!-- STRING -->
                  <!--input v-else type="text" v-model="item[cell.index]" class="v-input" /-->
                  {{ item[cell.index] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div data-v-72883fb8="" class="v-datatable undefined"
          style="flex: 1; height: 0px;min-width: unset;min-height: -webkit-fill-available;" v--popup="1"><!----><!---->
          <div class="v-widget-header v-datatable-scrollable-header" style="position: relative; margin-right: 0px;">
            <div class="v-datatable-scrollable-header-box" ref="header" style="left: 0px; transform: translateX(0px);">
              <table class="v-cloned-header v-table"><!---->
                <tr v-for="(row, rowIndex) in headerRows" :key="rowIndex">
                  <th v-for="(cell, colIndex) in rowIndex ? row : row.slice(2)" :title="cell.index" :key="colIndex"
                    :colspan="cell.colspan" :rowspan="cell.rowspan" :class="cell.class"
                    :style="{ ...cell.width ? { minWidth: cell.width + 'px', maxWidth: cell.width + 'px' } : (cell.colspan > 1 ? { width: '0px', textOverflow: 'ellipsis' } : {}), backgroundColor: cell.backgroundColor, color: cell.color }">
                    {{ cell.title }}
                  </th>
                </tr>
              </table>
            </div>
          </div>
          <div class="v-datatable-scrollable-body" ref="body2" style="overflow-y: auto; flex: 1 1 0%;"
            @scroll="onScrolling($event, 2)">
            <table class="v-table" style="width: 0px;">
              <tbody class="v-datatable-data"><!---->

                <tr v-for="(item, rowIndex) in items" :key="rowIndex"
                  :class="{ 'v-selected': selectedRows.has(rowIndex) }" @click="toggleRow(rowIndex)">

                  <td v-for="(cell) in visibleHeaders.slice(2)" :width="cell.width || 90"
                    :style="{ ...cell.width ? { minWidth: cell.width + 'px', maxWidth: cell.width + 'px' } : {} }">

                    <!--v-number v-if="cell.concept_id" placeholder="-" :title="'concept_id=' + cell.concept_id"
                      v-model.number="item.values[cell.concept_id]" /-->
                    <!-- STRING -->
                    <!--input v-else type="text" v-model="item[cell.index]" class="v-input" /-->
                    {{ item[cell.index] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </v-form>
  <div v-else class="center" style="display:flex;
    justify-content:center;
    align-items:center;">loading....</div>
  <div style="display:none">
    <v-form id="addPerson" header="Agregar Persona" width="460">
      <div v-if="showAddPerson" class="v-form">
        <div style="margin-bottom: 10px;"></div>
        <v-table :selectable="true" :scrollable="true" ref="personal" style="height:400px" rowKey="id" :pagination="20"
          :filters="filters" src="/api/hr/personal">
          <template v-slot="{ row }">
            <td width="80" class="center" header="DNI">
              <v-filter>
                <input v-model="filters.code" />
              </v-filter>
              {{ row.dni }}
            </td>
            <td width="220" header="Apellidos Nombres">
              <v-filter>
                <input v-model="filters.fullName" />
              </v-filter>
              {{ row.apellidosNombres }}
            </td>
            <td width="220" header="Organo">
              {{ row.organo }}
            </td>
            <td width="220" header="Unidad Organica">
              {{ row.unidadOrganica }}
            </td>
            <td width="220" header="Cargo">
              {{ row.cargo }}
            </td>
          </template>
        </v-table>
      </div>
    </v-form>
    <v-panel header="Agregar Monto" id="addConcept" width="460">
      <div v-if="showAddConcept" class="v-form">
        <v-fieldset legend="Destino">
          <label>Tipo:</label>
          <v-select v-model="concept.targetType" required>
            <option value="">Select One...</option>
            <v-options :data="targetType" value-field="id" display-field="name"></v-options>
          </v-select>
          <v-template v-if="concept.targetType == 'GR'">
            <label>Grupo:</label>
            <v-select v-model="concept.targetId" required>
              <option value="">Select One...</option>
              <v-options store="group" value-field="id" display-field="name"></v-options>
            </v-select>
          </v-template>
          <v-template v-if="concept.targetType == 'PE'">
            <label>Persona:</label>
            <v-select v-model="concept.target" name="event" required>
              <option value="">Select One...</option>
              <v-options value-field="id" src="/api/payroll/1/personal">
                <template #default="{ item }">
                  👤 {{ item.code }}, {{ item.fullName }}
                </template>
              </v-options>
            </v-select>
          </v-template>

        </v-fieldset>
        <v-fieldset legend="Concepto">
          <label>Tipo:</label>
          <v-select v-model="concept.conceptType" required>
            <option value="">Select One...</option>
            <v-options :data="conceptType" value-field="id">
              <template #default="{ item }">
                {{ item.id }}: {{ item.name }}
              </template>
            </v-options>
          </v-select>
          <label>Concepto:</label>
          <v-select :disabled="!concept.conceptType" v-model="concept.concept" required>
            <option value="">Select One...</option>
            <v-options src="/api/payroll/concept/0/0" :filter="{ typeId: concept.conceptType }" value-field="id"
              display-field="name"></v-options>
          </v-select>
        </v-fieldset>
        <label>Monto:</label>
        <input type="nuber" v-model="concept.amount" />
      </div>
    </v-panel>
  </div>
</template>
<script>
import { ui, MsgBox } from 'isobit-ui';
import axios from 'axios';
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { targetType, conceptType } from './constants';

const groups = {
  1: "INGRESOS",
  2: "EGRESOS",
  3: "APORTACIONES",
  4: "INGRESOS",
  5: "EGRESOS",
  6: "APORTACIONES"
};
export default ui({
  setup({ id, app: { axios } }) {

    const o = ref()

    const headers = ref([])

    const items = ref([])

    const syncingScroll = ref(false)

    const tk = ref(0)

    const selectedRows = ref(new Set())

    const concept = ref({})

    const keySet = ref(0)

    const current = ref(null);

    const personal = ref(null)

    const tableKey = ref(0)

    const showAddPerson = ref(false)

    const showAddConcept = ref(false)

    const refresh = () => {
      axios.get('/api/payroll/' + id + '/preview')
        .then(({ data: { headers: h, items: i, ...payroll } }) => {
          selectedRows.value.clear();
          console.log(h);
          headers.value = h
          items.value = i
          o.value = payroll
          handler(items)
        })
    }

    const handler = (val) => {
      // lógica futura
    }

    onMounted(refresh)

    watch(items, {
      deep: true,
      handler(val) {
        const daysMonth = 30
        const headers = columnsHeaders.value
        val.forEach(row => {
          // lógica futura
        })
      }
    })

    const headerRows = computed(() => {

      const maxDepth = (headers) => {
        return headers.reduce((max, h) => {

          if (h.title.startsWith('_')) return max

          if (h.children) {
            return Math.max(max, 1 + maxDepth(h.children))
          }

          return Math.max(max, 1)

        }, 0)
      }

      const depth = maxDepth(headers.value)

      const rows = Array.from({ length: depth }, () => [])

      const fillRows = (headersList, level = 0) => {

        headersList.forEach(h => {

          if (h.title.startsWith('_')) return

          const hasChildren =
            h.children &&
            h.children.some(c => !c.title.startsWith('_'))

          const cell = {
            title: h.title,
            class: h.class,
            colspan: hasChildren
              ? h.children.filter(c => !c.title.startsWith('_')).length
              : 1,
            rowspan: hasChildren ? 1 : depth - level,
            width: hasChildren ? undefined : (h.width || 90),
            backgroundColor: h.backgroundColor,
            color: h.color,
            index: h.index
          }

          rows[level].push(cell)

          if (hasChildren) {
            fillRows(h.children, level + 1)
          }

        })

      }

      fillRows(headers.value)

      return rows

    })


    const visibleHeaders = computed(() => {

      const leaves = []

      const collect = (headersList) => {

        headersList.forEach(h => {

          if (h.children) {
            collect(h.children)
          } else {
            if (!h.title.startsWith('_')) {
              leaves.push(h)
            }
          }

        })

      }

      collect(headers.value)

      return leaves

    })


    const columnsHeaders = computed(() => {
      const leaves = []
      const collect = (headersList) => {
        headersList.forEach(h => {
          if (h.children) {
            collect(h.children)
          } else {
            leaves.push(h)
          }
        })
      }
      collect(headers.value)
      return leaves

    })

    const process = () => {
      axios.post('/api/payroll/process', o.value).then(({ data: { items: i, headers: h } }) => {
        items.value = i;
        headers.value = h;
        //handler(me.items);
      });
    }

    const addPerson = () => {
      showAddPerson.value = true;
      MsgBox(document.querySelector('#addPerson'), async (b) => {
        if (b === 0) {
          const persons = personal.value.load.selected.value;
          if (!persons.length) {
            MsgBox("Debe seleccionar algun empleado de la lista");
            return false; // ❗ evita cerrar
          }
          try {
            await axios.post('/api/payroll/add-person', { persons, payrollType: o.value.typeId });
            refresh(); // éxito → se cierra normalmente
          } catch {
            return false; // ❗ evita cerrar el modal
          }
        }
      }, [{ label: 'Agregar', icon: 'fa-plus' }]);
    }

    const addConcept = () => {
      showAddConcept.value = true;
      MsgBox(document.querySelector('#addConcept'), async (b) => {
        if (b == 0) {
          try {
            const item = concept.value;
            item.payrollType = o.value.typeId;
            if (item.type == 'PE') {
              item.targetId = item.targetId.id;
            } else if (item.type == 'PT') {
              item.targetId = item.payrollType || 0;
            }
            await axios.post('/api/payroll/add-concept', item);
            refresh();
          } catch (e) {
            return false;
          }
        }
      }, [{ label: 'Agregar', icon: 'fa-plus' }]);
    }

    const removePerson = () => {
      MsgBox("Esta seguro de remover estos trabajadores de la planilla?", async (b) => {
        if (b === 0) {
          try {
            await axios.post('/api/payroll/remove-person', {
              payrollType: o.value.typeId,
              persons: Array.from(selectedRows.value)
                .map(i => items.value[i].peopleId)
            });
            refresh(); // éxito → se cierra normalmente
          } catch {
            return false; // ❗ evita cerrar el modal
          }
        }
      }, [{ label: 'Si', icon: 'fa-check' }]);
    }

    const save = () => {
      axios.post('/api/payroll/people', { payrollType:o.value.typeId, items: items.value }).then(({ data }) => {
        refresh();
      });
    }
    return {
      save,
      o,
      headers,
      items,
      process,
      refresh,
      personal,
      addPerson,
      headerRows,
      visibleHeaders,
      columnsHeaders,
      removePerson,
      syncingScroll,
      tk,
      selectedRows,
      concept,
      conceptType,
      targetType,
      keySet,
      current,
      groups,
      tableKey,
      showAddPerson,
      showAddConcept,
      addConcept
    }

  },
  props: ["id"],
  methods: {
    toggleRow(index) {
      this.selectedRows.clear()
      this.selectedRows.add(index)
    },
    toggleCheckbox(index, event) {
      if (index == -1) {
        if (event.target.checked) {
          this.selectedRows = new Set(this.items.map((_, i) => i))
        } else {
          this.selectedRows.clear();
        }
      } else {
        if (event.target.checked) {
          this.selectedRows.add(index)
        } else {
          this.selectedRows.delete(index)
        }
      }
    },
    onScrolling(e, tableId) {
      const body = e.target
      // horizontal header sync
      const horizontal = body.scrollLeft
      const header = body.previousElementSibling.children[0]
      header.style.transform = "translateX(-" + horizontal + "px)"

      // prevent infinite loop
      if (this.syncingScroll) return
      this.syncingScroll = true

      const other = tableId === 1 ? this.$refs.body2 : this.$refs.body1

      if (other) {
        other.scrollTop = body.scrollTop
      }

      requestAnimationFrame(() => {
        this.syncingScroll = false
      })
    },
    escape() {
      const me = this;
      const concepto = this.$refs.concept.$el.querySelector('input');
      me.current.concept = concepto.value
      me.current = null;
      me.tk++;
    },
    selectConcept(e) {
      this.current.concept = e.name;
      this.current.conceptId = e.id;
      this.current.name = e.name;
      this.current = null;
    },
    sele(e, row) {
      const concepto = this.$refs.concept.$el;
      if (e.target.tagName === 'TD') {
        e.stopPropagation();
        if (row.concept) {
          this.o.data = { name: row.concept, conceptId: row.conceptId }
        } else {
          this.$refs.concept.query = '';
          this.o.data = null;
        }
        this.current = row;
        this.keySet = row.type;
        if (!e.target.contains(concepto)) {
          e.target.appendChild(concepto);
        }
      }
    },
    download() {
      const me = this;
      axios.post('/api/payroll/chd', me.o).then(({ data }) => {
        const fo = new FormData();
        fo.append(
          "file",
          new Blob([JSON.stringify(data)], { type: "text/plain" }),
          "data.json"
        );
        fo.append("filename", "data.json");
        fo.append("template", "hc");
        fo.append("original", "1");
      });
    },
    findGroup(data, id) {
      return data.find((e) => e.name == id);
    },
    completedata(data) {
      let result = [];
      Object.entries(groups).forEach(([groupType]) => {
        const groupTypeInt = parseInt(groupType);
        let groupHasData = false;
        // Procesar los elementos de la data original que pertenezcan al grupo
        data.forEach(item => {
          if (item.type === groupTypeInt) {
            groupHasData = true;
            result.push(item);
          }
        });
        // Si no hay elementos del grupo, agregar un objeto vacío con el tipo del grupo
        if (!groupHasData) {
          result.push({ type: groupTypeInt });
        }
      });
      return result;
    },
    addItem(item) {
      item = { type: Number(item.name) };
      const lastIndex = this.items.length - 1 - this.items.slice().reverse().findIndex(el => (el.type) == item.type);
      if (lastIndex >= 0) {
        this.items.splice(lastIndex + 1, 0, item);
      } else {
        this.items.push(item);
      }
    },
  },
});
</script>
<style scoped>
.xyz {
  padding: 0px !important;
}

.v-selected input {
  color: black;
}

.xyz>a {
  padding: 10px;
  background-color: #e1f8ff;
  border: 1px solid gray;
  margin-top: 10px;
  display: block;
}

.v-datatable /deep/ .v-header-group {
  background-color: #b31111;
  padding: 0px 10px;
  color: #ffffff;
  font-weight: bolder;
  cursor: default;
}

.v-datatable /deep/ .v-footer-group {

  background-color: #ffffa8;
  font-weight: bolder;
  text-align: right;
}

.v-datatable /deep/ .v-footer-group /deep/ td {
  padding: 0px 20px !important;
  text-align: right;
}

.v-footer-group /deep/ td {
  padding: 0px 20px !important;
  text-align: right;
}

.v-datatable ::v-deep(.v-footer-group > td) {
  padding: 0px 20px !important;
  text-align: right;
}

.v-datatable /deep/ input {
  border: none !important;
  border-radius: 0px !important;
}

.v-datatable /deep/ td {
  padding: 0px;
}

.v-datatable input[type="number"] {
  --width: 160px;
}

.v-datatable {
  display: flex;
  flex-direction: column;
}

.v-datatable>.v-datatable-scrollable-body {
  flex: 1 !important;
}

.v-datatable>.v-datatable-scrollable-body {
  height: -webkit-fill-available !important;
}

.v-datatable .v-row {
  background-color: red !important;
}
</style>
<style>
.v-selected input:not(:focus) {
  background: unset;
  color: white;
}

.p-green {
  background: #95f75a !important;
  color: black !important;
}

.p-wine {
  background: #e51700 !important;
}

.p-sky {
  background: #41d9ff !important;
  color: black !important;
}

.p-yellow {
  background: yellow !important;
  color: black !important;
}
</style>