<template>
  <v-form header="Planilla de Pago" action="/api/hr/employee">
    <div class="v-form" style="display: flex;flex-direction: column;flex:1">
      <div style="display: flex;flex-direction: row;">
        <div style="width: 100px;padding-right: 10px;">
          <label>Año:</label>
          <v-number v-model="o.year" required="true" class="center" type="number" />
        </div>
        <div style="width: 100px;padding-right: 10px;">
          <label>Mes:</label>
          <v-number v-model="o.month" required="true" class="center" type="number" />
        </div>
        <div
          style="display: flex; flex-grow: 1; margin-bottom: 3px; justify-content: space-between; align-items: flex-end;">
          <v-button icon="fa fa-refresh" @click="refresh2" :disabled="!(o.month && o.year)" />
          <v-button icon="fa fa-person-circle-plus" @click="addPerson" :disabled="!(o.month && o.year)" />
          <div>
            <v-button icon="fa fa-download" @click="download" style="margin-right: 10px;"
              :disabled="!(o.employee && o.year)" />
            <v-button icon="fa fa-save" @click="save" :disabled="!(o.employee && o.year)" />
          </div>
        </div>
      </div>

      <div data-v-72883fb8="" class="v-datatable undefined" height="100"
        style="flex: 1 1 0%; margin-top: 10px; height: 0px;" v--popup="1"><!----><!---->
        <div class="v-widget-header v-datatable-scrollable-header" style="position: relative; margin-right: 0px;">
          <div class="v-datatable-scrollable-header-box" ref="header" style="left: 0px; transform: translateX(0px);">
            <table class="v-cloned-header v-table"><!---->
              <tr v-for="(row, rowIndex) in headerRows" :key="rowIndex">
                <th v-for="(cell, colIndex) in row" :title="cell.index" :key="colIndex" :colspan="cell.colspan"
                  :rowspan="cell.rowspan"
                  :style="{ ...cell.width ? { minWidth: cell.width + 'px', maxWidth: cell.width + 'px' } : (cell.colspan > 1 ? { width: '0px', textOverflow: 'ellipsis' } : {}), backgroundColor: cell.backgroundColor, color: cell.color }">
                  {{ cell.title }}
                </th>
              </tr>
            </table>
          </div>
        </div>
        <div class="v-datatable-scrollable-body" style="overflow-y: auto; flex: 1 1 0%;" @scroll="horizontalScroll">
          <table class="v-table" style="width: 0px;">
            <tbody class="v-datatable-data"><!---->

              <tr v-for="item in items" class=""><!---->
                <td v-for="(cell) in visibleHeaders" :width="cell.width || 80"
                  :style="{ ...cell.width ? { minWidth: cell.width + 'px', maxWidth: cell.width + 'px' } : {} }">

                  <v-number v-if="typeof cell.index === 'number'" placeholder="-" :title="'index=' + cell.index"
                    v-model.number="item.values[cell.index]" />

                  <!-- STRING -->
                  <input v-else type="text" v-model="item[cell.index]" class="v-input" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </v-form>
  <div style="display:none">
    <v-dialog id="addPersonDlg" width="460">
      <div v-if="showAddPersonModal" class="v-form">
        <div style="margin-bottom: 10px;"><input></div>
        <v-table :selectable="true" :scrollable="true" ref="personal" rowKey="id" :pagination="20" :filters="filters"
          src="/api/hr/personal">
          <template v-slot="{ row }">
            <td width="80" class="center" header="DNI">
              {{ row.dni }}
            </td>
            <td width="220" header="Apellidos Nombres">
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
    </v-dialog>
  </div>
</template>
<script>
import { ui, MsgBox } from 'isobit-ui';
import axios from 'axios';
const groups = {
  1: "INGRESOS",
  2: "EGRESOS",
  3: "APORTACIONES",
  4: "INGRESOS",
  5: "EGRESOS",
  6: "APORTACIONES"
};
export default ui({
  props: ["id"],
  watch: {
    items2: {
      deep: true,
      handler(val) {
        const daysMonth = 30;
        const headers = this.columnsHeaders;
        val.forEach(row => {
          /*const v = row.values;
          //if (!row.manual[3]) 
          v[2] = Math.trunc(
            ((Number(v[0]) || 0) * (Number(v[1]) || 0) / daysMonth) * 100
          ) / 100;

          //if (!row.manual[4]) 
          v[4] = Math.trunc(
            ((Number(v[0]) || 0) * (Number(v[3]) || 0) / daysMonth) * 100
          ) / 100;

          v[6] = Math.trunc(
            ((Number(v[0]) || 0) * (Number(v[5]) || 0) / daysMonth) * 100
          ) / 100;

          v[8] = Math.trunc(
            ((Number(v[0]) || 0) * (Number(v[7]) || 0) / daysMonth) * 100
          ) / 100;

          v[10] = Math.trunc(
            ((Number(v[0]) || 0) * (Number(v[9]) || 0) / daysMonth) * 100
          ) / 100;

          v[12] = Math.trunc(
            ((Number(v[0]) || 0) * (Number(v[11]) || 0) / daysMonth) * 100
          ) / 100;


          v[16] = Math.trunc(
            headers.reduce((acc, h, i) => {
              if (h.type === 1) {
                acc += Number(v[i]) || 0;
              }
              return acc;
            }, 0) * 100
          ) / 100;
          v[21] = Math.trunc(
            headers.reduce((acc, h, i) => {
              if (h.type === 2) {
                acc += Number(v[i]) || 0;
              }
              return acc;
            }, 0) * 100
          ) / 100;
          v[23] = Math.trunc(
            (v[21] + v[22]) * 100
          ) / 100;
          v[24] = Math.trunc(
            (v[16] - v[21]) * 100
          ) / 100;
          v[25] = Math.trunc(
            (v[16] - v[23] + v[23]) * 100
          ) / 100;
          v[32] = Math.trunc(
            headers.reduce((acc, h, i) => {
              if (h.type === 3) {
                acc += Number(v[i]) || 0;
              }
              return acc;
            }, 0) * 100
          ) / 100;*/
        });
      }
    }
  },
  data() {

    return {
      tk: 0,
      keySet: 0,
      current: null,
      groups: groups,
      tableKey: 0,
      items: [],//this.completedata([]),
      showAddPersonModal: false,
      headers: [],
      o: {
        data: null,
        id: null,
        employee: null,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
    };
  },
  computed: {
    headerRows() {
      // Función para calcular profundidad máxima, ignorando headers que empiezan con '_'
      const maxDepth = (headers) => {
        return headers.reduce((max, h) => {
          if (h.title.startsWith('_')) return max; // ignorar
          if (h.children) {
            return Math.max(max, 1 + maxDepth(h.children));
          }
          return Math.max(max, 1);
        }, 0);
      };

      const depth = maxDepth(this.headers);

      const rows = Array.from({ length: depth }, () => []);

      const fillRows = (headers, level = 0) => {
        headers.forEach(h => {
          if (h.title.startsWith('_')) return; // ignorar
          const hasChildren = h.children && h.children.some(c => !c.title.startsWith('_'));
          const cell = {
            title: h.title,
            colspan: hasChildren ? h.children.filter(c => !c.title.startsWith('_')).length : 1,
            rowspan: hasChildren ? 1 : depth - level,
            width: hasChildren ? undefined : (h.width || 80),
            backgroundColor: h.backgroundColor,
            color: h.color,
            index: h.index
          };
          rows[level].push(cell);
          if (hasChildren) fillRows(h.children, level + 1);
        });
      };

      fillRows(this.headers);

      return rows;
    },

    visibleHeaders() {
      const leaves = [];

      const collect = (headers) => {
        headers.forEach(h => {
          if (h.children) {
            collect(h.children);
          } else {
            if (!h.title.startsWith('_')) {
              leaves.push(h);
            }
          }
        });
      };
      collect(this.headers);
      return leaves;
    },

    columnsHeaders() {
      const leaves = [];

      const collect = (headers) => {
        headers.forEach(h => {
          if (h.children) {
            collect(h.children);
          } else {
            leaves.push(h);
          }
        });
      };

      collect(this.headers);
      return leaves;
    }

  },
  mounted() {
    const me = this;
    /*me.$el.addEventListener('click', (event) => {
      if (!me.$refs.concept.$el.contains(event.target)) {
        me.current = null
      }
    });*/
    me.items = [];
    me.handler(me.items);
  },
  methods: {
    addPerson() {
      const me = this;
      me.showAddPersonModal = true;
      MsgBox(document.querySelector('#addPersonDlg'), (b) => {
        if (b == 1) {
          const persons = me.$refs.personal.load.selected.value;
          if (persons.length) {
            axios.post('/api/payroll/add-person', { persons }).then(({ data }) => {
              me.refresh2();
            });
          } else {
            MsgBox("Debe seleccionar algun empleado de la lista");
            return false;
          }
        }
      }, ['Cancelar', 'Agregar']);
    },
    handler(val) {
      /*const daysMonth = 30;
      const headers = this.columnsHeaders;
      val.forEach(row => {
        const v = row.values;
        //if (!row.manual[3]) 
        v[2] = Math.trunc(
          ((Number(v[0]) || 0) * (Number(v[1]) || 0) / daysMonth) * 100
        ) / 100;

        //if (!row.manual[4]) 
        v[4] = Math.trunc(
          ((Number(v[0]) || 0) * (Number(v[3]) || 0) / daysMonth) * 100
        ) / 100;

        v[6] = Math.trunc(
          ((Number(v[0]) || 0) * (Number(v[5]) || 0) / daysMonth) * 100
        ) / 100;

        v[8] = Math.trunc(
          ((Number(v[0]) || 0) * (Number(v[7]) || 0) / daysMonth) * 100
        ) / 100;

        v[10] = Math.trunc(
          ((Number(v[0]) || 0) * (Number(v[9]) || 0) / daysMonth) * 100
        ) / 100;

        v[12] = Math.trunc(
          ((Number(v[0]) || 0) * (Number(v[11]) || 0) / daysMonth) * 100
        ) / 100;


        v[16] = Math.trunc(
          headers.reduce((acc, h) => {
            if (h.type === 1) {
              acc += Number(v[h.index]) || 0;
            }
            return acc;
          }, 0) * 100
        ) / 100;
        v[21] = Math.trunc(
          headers.reduce((acc, h) => {
            if (h.type === 2) {
              acc += Number(v[h.index]) || 0;
            }
            return acc;
          }, 0) * 100
        ) / 100;
        v[23] = Math.trunc(
          (v[21] + v[22]) * 100
        ) / 100;
        v[24] = Math.trunc(
          (v[16] - v[21]) * 100
        ) / 100;
        v[25] = Math.trunc(
          (v[16] - v[23] + v[23]) * 100
        ) / 100;
        v[32] = Math.trunc(
          headers.reduce((acc, h) => {
            if (h.type === 3) {
              acc += Number(v[h.index]) || 0;
            }
            return acc;
          }, 0) * 100
        ) / 100;
        v[39] = Math.trunc(
          ((v[23] || 0) + (v[32] || 0) + (v[38] || 0)) * 100
        ) / 100;
        v[41] = Math.trunc(
          ((v[16] || 0) - (v[39] || 0) + (v[40] || 0)) * 100
        ) / 100;
      });*/
    },
    horizontalScroll(e) {
      const horizontal = e.target.scrollLeft;
      this.$refs.header.style.transform = "translateX(-" + horizontal + "px)";
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
      //me.saveAs('/api/payroll/chd', me.o);

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
        //me.saveAs(process.env.VUE_APP_REPORT_URL + "/api/jreport/", fo);

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

    refresh2() {
      const me = this;
      const o = me.o;
      axios.get('/api/payroll/period', { params: o }).then(({ data }) => {
        me.items = data.data;
        me.headers = data.headers;
        me.handler(me.items);
      });
    },

    save() {
      const me = this;
      axios.post('/api/payroll/people', { ...this.o, items: this.items }).then(({ data }) => {
        me.refresh();
      });
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