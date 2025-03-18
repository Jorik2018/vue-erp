<template>
  <v-page action="/api/desarrollo-social/adulto-mayor" :header="(o.id ? 'Editar' : 'Crear') + '  Registro Adulto Mayor'"
    :class="o.id < 0 || (o.tmpId && !o.synchronized)
      ? 'yellow'
      : o.tmpId
        ? 'green'
        : ''
      " store="adulto-mayor">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <v-fieldset legend="I. Datos generales" class="v-form">
        <label>DNI:</label>
        <input v-model="o.dni"  maxlength="8" class="center" @input="validateInput" />
        <label>Apellidos y Nombres:</label>
        <input v-model="o.apellidos_nombres" required/>
        <label>Fecha Nacimiento:</label>
        <v-calendar v-model="o.fecha_nacimiento" required @changed="inputEdad" />
        <label>Edad:</label>
        <div class="readonly">{{ (o.edad || o.edad
          == 0 ? o.edad : '---') }}
        </div>
        <label>Sexo:</label>
        <v-radio-group required="true" v-model="o.sexo">
          <v-radio label="MASCULINO" value="M"></v-radio>
          <v-radio label="FEMENINO" value="F"></v-radio>
        </v-radio-group>

        <label>Tipo de Seguro Médico:</label>

        <v-select v-model="o.tipo_seguro_medico" ref="tipo_seguro_medico" :required="true">
          <option>Select One...</option>
          <option v-for="item in tipo_seguro_medico" :key="item" :value="item">
            {{ item }}
          </option>
        </v-select>
        <label>Clan:</label>
        <input v-model="o.clan" />
        <label>Teléfono de Contacto:</label>
        <input v-model="o.telefono_contacto" class="center" />
        <label>Teléfono de Contacto:</label>
        <v-textarea v-model="o.direccion_habitual" />
      </v-fieldset>



      <v-fieldset legend="II. Antencedentes Medicos" class="v-form">

        <!-- Diabetes Fieldset -->
        <v-fieldset legend="Diabetes" class="v-form">
          <label>Diagnosticada:</label>
          <v-radio-group required v-model="o.diabetes_diagnosticada">
            <v-radio value="Si"></v-radio>
            <v-radio value="No"></v-radio>
          </v-radio-group>
          <template v-if="o.diabetes_diagnosticada === 'Si'">
            <label>Año de Dx:</label>
            <v-number v-model="o.diabetes_anio_dx" />
            <label>En Tratamiento:</label>
            <v-radio-group required v-model="o.diabetes_en_tratamiento">
              <v-radio value="Si"></v-radio>
              <v-radio value="No"></v-radio>
            </v-radio-group>
            <template v-if="o.diabetes_en_tratamiento === 'Si'">
              <label>Dónde se Trata:</label>
              <v-textarea v-model="o.diabetes_donde_trata" />
              <label>Acude a Control:</label>
              <v-radio-group required v-model="o.diabetes_acude_control">
                <v-radio value="Si"></v-radio>
                <v-radio value="No"></v-radio>
              </v-radio-group>
            </template>
          </template>
        </v-fieldset>

        <!-- Hypertension Fieldset -->
        <v-fieldset legend="Hipertensión" class="v-form">
          <label>Diagnosticada:</label>
          <v-radio-group v-model="o.hipertension_diagnosticada">
            <v-radio value="Si"></v-radio>
            <v-radio value="No"></v-radio>
          </v-radio-group>
          <template v-if="o.hipertension_diagnosticada === 'Si'">
            <label>Año de Dx:</label>
            <v-number v-model="o.hipertension_anio_dx" />
            <label>En Tratamiento:</label>
            <v-radio-group required v-model="o.hipertension_en_tratamiento">
              <v-radio value="Si"></v-radio>
              <v-radio value="No"></v-radio>
            </v-radio-group>
            <template v-if="o.hipertension_en_tratamiento === 'Si'">
              <label>Dónde se Trata:</label>
              <v-textarea v-model="o.hipertension_donde_trata" />
              <label>Acude a Control:</label>
              <v-radio-group required v-model="o.hipertension_acude_control">
                <v-radio value="Si"></v-radio>
                <v-radio value="No"></v-radio>
              </v-radio-group>
            </template>
          </template>
        </v-fieldset>

        <!-- Dyslipidemia Fieldset -->
        <v-fieldset legend="Dislipidemia" class="v-form">
          <label>Diagnosticada:</label>
          <v-radio-group required v-model="o.dislipidemia_diagnosticada">
            <v-radio value="Si"></v-radio>
            <v-radio value="No"></v-radio>
          </v-radio-group>
          <template v-if="o.dislipidemia_diagnosticada === 'Si'">
            <label>Año de Dx:</label>
            <v-number v-model="o.dislipidemia_anio_dx" />
            <label>En Tratamiento:</label>
            <v-radio-group required v-model="o.dislipidemia_en_tratamiento">
              <v-radio value="Si"></v-radio>
              <v-radio value="No"></v-radio>
            </v-radio-group>
            <template v-if="o.dislipidemia_en_tratamiento === 'Si'">
              <label>Dónde se Trata:</label>
              <v-textarea v-model="o.dislipidemia_donde_trata" />
              <label>Acude a Control:</label>
              <v-radio-group required v-model="o.dislipidemia_acude_control">
                <v-radio value="Si"></v-radio>
                <v-radio value="No"></v-radio>
              </v-radio-group>
            </template>
          </template>
        </v-fieldset>

        <!-- Other Disease Fieldset -->
        <v-fieldset legend="Otra Enfermedad" class="v-form">
          <label>Especificar:</label>
          <v-textarea v-model="o.otra_enfermedad_especificar" />
          <template v-if="o.otra_enfermedad_especificar">
            <label>Año de Dx:</label>
            <v-number v-model="o.otra_enfermedad_anio_dx" />
            <label>En Tratamiento:</label>
            <v-radio-group required v-model="o.otra_enfermedad_en_tratamiento">
              <v-radio value="Si"></v-radio>
              <v-radio value="No"></v-radio>
            </v-radio-group>
            <template v-if="o.otra_enfermedad_en_tratamiento === 'Si'">
              <label>Dónde se Trata:</label>
              <v-textarea v-model="o.otra_enfermedad_donde_trata" />
              <label>Acude a Control:</label>
              <v-radio-group required v-model="o.otra_enfermedad_acude_control">
                <v-radio value="Si"></v-radio>
                <v-radio value="No"></v-radio>
              </v-radio-group>
            </template>
          </template>
        </v-fieldset>
        <label>Observaciones Médicas</label>
        <v-textarea v-model="o.observaciones_medicas" />
      </v-fieldset>

      <v-fieldset legend="III. Hábitos y Estilos de Vida" class="v-form">
        <label>Chequeo Médico 1 vez al Año:</label>
        <v-radio-group required v-model="o.chequeo_medico_anual">
          <v-radio value="Si"></v-radio>
          <v-radio value="No"></v-radio>
          <v-radio value="A veces"></v-radio>
        </v-radio-group>
        <label>Actividad Física 30 min al Día:</label>
        <v-radio-group required v-model="o.actividad_fisica_diaria">
          <v-radio value="Si"></v-radio>
          <v-radio value="No"></v-radio>
          <v-radio value="A veces"></v-radio>
        </v-radio-group>
        <label>Consume 5 Porciones de Frutas/Verduras al Día:</label>
        <v-radio-group required v-model="o.frutas_verduras_diario">
          <v-radio value="Si"></v-radio>
          <v-radio value="No"></v-radio>
          <v-radio value="A veces"></v-radio>
        </v-radio-group>
        <label>Duerme al menos 5 Horas Continuas:</label>
        <v-radio-group required v-model="o.sueño_continuo">
          <v-radio value="Si"></v-radio>
          <v-radio value="No"></v-radio>
          <v-radio value="A veces"></v-radio>
        </v-radio-group>
        <label>Toma Medicamentos en Dosis y Horario Correcto:</label>
        <v-radio-group required v-model="o.medicamentos_correctos">
          <v-radio value="Si"></v-radio>
          <v-radio value="No"></v-radio>
          <v-radio value="A veces"></v-radio>
        </v-radio-group>
        <label>Consume Suplementos Recetados:</label>
        <v-radio-group required v-model="o.suplementos_recetados">
          <v-radio value="Si"></v-radio>
          <v-radio value="No"></v-radio>
          <v-radio value="A veces"></v-radio>
        </v-radio-group>
        <label>Consume Suplementos sin Receta:</label>
        <v-radio-group required v-model="o.suplementos_sin_receta">
          <v-radio value="Si"></v-radio>
          <v-radio value="No"></v-radio>
          <v-radio value="A veces"></v-radio>
        </v-radio-group>
        <label>Bebe 8 Vasos de Agua al Día:</label>
        <v-radio-group required v-model="o.agua_diaria">
          <v-radio value="Si"></v-radio>
          <v-radio value="No"></v-radio>
          <v-radio value="A veces"></v-radio>
        </v-radio-group>
        <label>Cuenta con un Cuidador:</label>
        <v-radio-group required v-model="o.cuidador">
          <v-radio value="Si"></v-radio>
          <v-radio value="No"></v-radio>
          <v-radio value="A veces"></v-radio>
        </v-radio-group>
        <label>Participa en Actividades Recreativas:</label>
        <v-radio-group required v-model="o.actividades_recreativas">
          <v-radio value="Si"></v-radio>
          <v-radio value="No"></v-radio>
          <v-radio value="A veces"></v-radio>
        </v-radio-group>
        <label>Observaciones:</label>
        <v-textarea v-model="o.habito_estilo_vida_observaciones" />

      </v-fieldset>

      <v-fieldset legend="IV. Chequeo Médico" class="v-form">
        <v-fieldset legend="Dosaje Hemoglobina" class="v-form">
          <label>Fecha:</label>
          <v-calendar v-model="o.fecha_dosaje_hemoglobina" />
          <label>Resultado:</label>
          <input v-model="o.resultado_dosaje_hemoglobina" />
        </v-fieldset>
        <v-fieldset legend="Dosaje Glucosa" class="v-form">
          <label>Fecha:</label>
          <v-calendar v-model="o.fecha_dosaje_glucosa" />
          <label>Resultado:</label>
          <input v-model="o.resultado_dosaje_glucosa" />
        </v-fieldset>
        <v-fieldset legend="Control PA" class="v-form">
          <label>Fecha:</label>
          <v-calendar v-model="o.fecha_control_pa" />
          <label>Resultado:</label>
          <input v-model="o.resultado_control_pa" />
        </v-fieldset>
        <v-fieldset legend="Dosaje Lípidos" class="v-form">
          <label>Fecha:</label>
          <v-calendar v-model="o.fecha_dosaje_lipidos" />
          <label>Resultado:</label>
          <input v-model="o.resultado_dosaje_lipidos" />
        </v-fieldset>
        <template v-if="o.sexo === 'F'">
          <v-fieldset legend="Papanicolao" class="v-form">
            <label>Fecha:</label>
            <v-calendar v-model="o.fecha_papanicolao" />
            <label>Resultado:</label>
            <input v-model="o.resultado_papanicolao" />
          </v-fieldset>
          <v-fieldset legend="Mamografía" class="v-form">
            <label>Fecha:</label>
            <v-calendar v-model="o.fecha_mamografia" />
            <label>Resultado:</label>
            <input v-model="o.resultado_mamografia" />
          </v-fieldset>
        </template>
        <label>Comentarios y Observaciones:</label>
        <v-textarea v-model="o.comentarios_observaciones" />
        <label>Fecha de Visita:</label>
        <v-calendar v-model="o.fecha_visita" />
        <label>Firma:</label>
        <div style="border: 1px solid gray;padding: 10px;margin-bottom: 10px;">
          <img style="height: 200px;" />
        </div>
        <div class="right">
        <v-uploader v-model="o.firma" />
        </div>
      </v-fieldset>
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
    </center>
  </v-page>
</template>
<script>
import { ui } from 'isobit-ui'
import { ref } from 'vue'
import axios from 'axios'
export default ui({
  props: ["id"],
  setup({ router,id }) {
    const o = ref({});
    const close=({success,data}) =>{
      let _o = o.value;
      if (success === true) {
        _o = { ..._o, id: data.id, tmpId: data.tmpId };
        if (data.uploaded) {
          delete _o.tempFile;
        }
      }
      o.value = _o;
      const nid = _o.tmpId ? -_o.tmpId : _o.id;
      if (id != nid) {
      router.replace("/admin/desarrollo-social/adulto-mayor/" + nid);
      }
    }
    return {o,close}
  },
  data() {
    return {
      count: 0,
      red: [],
      age: null,
      tipo_seguro_medico: [
        "SIS", "ESSALUD", "PRIVADA", "NINGUNA"
      ]
    };
  },
  mounted() {
    this.changeRoute();
  },
  methods: {
    validateInput() {
      // Only keep digits and limit to 8 characters
      if(this.o.dni)
      this.o.dni = this.o.dni.replace(/\D/g, '').slice(0, 8);
    },
    inputEdad(e) {
      this.o.edad = this.o.fecha_nacimiento ? this.app.getAge(this.o.fecha_nacimiento) : null;
    },
    async changeRoute() {
      const me = this, id = me.id;
      if (id < 0) {
        me.getStoredList("adulto-mayor").then((adultomayor) => {
          adultomayor.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              me.o = e;
            }
          });
        });
      } else if (Number(id)) {
        axios.get("/api/desarrollo-social/adulto-mayor/" + id)
          .then((response) => {
            this.o = response.data;
          });
      }
    }
  },
});
</script>