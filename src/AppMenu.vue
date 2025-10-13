<template>
  <ion-menu menu-id="main-content" content-id="main-content" type="overlay">
    <ion-header mode="md">
      <ion-toolbar mode="md">
        <ion-title v-if="session?.people">
          <div class="center" v-for="(o, i) in [session.people]" :key="i" style="color: white;text-align:center;white-space: normal;
							padding: 20px;">
            <table align="center">
              <tr>
                <td style="width:50%">
                  <div
                    style="border:1px solid gray;overflow-y: hidden; width: 140px;height: 140px; border-radius: 50%;">
                    <img :key="'men-' + app.ki" style="width: 100%;object-fit: cover;height: 100%;"
                      :src="baseURL + '/fs/shami/profile/' + app.profileImg" @error="$event.target.src = imgError">
                  </div>
                </td>
                <td style="text-align: left;padding-left: 10px;">
                  <div style="color:blue">Hola,<br />{{ o.display_name }}</div>
                </td>
              </tr>
            </table>
          </div>
          <span style="right: 0px;position: absolute;top: 10px;"
            v-on:click="$ionic.menuController.close('menuprincipal')"><i class="fa fa-times"></i></span>
        </ion-title>
        <ion-title v-if="false">
          <div class="center" v-for="(o, i) in [session.people]" v-bind:key="i" style="color: white;
							padding: 20px 0px;
							background-color:#0f62ac; border-bottom-right-radius: 60%;">

            <div v-if="o.urlPerfil"
              style="margin-left: 23%;overflow-y: hidden; width: 170px;height: 140px; border-radius: 50%;">
              <img style="width:100%;" v-bind:src="baseURL + '/fs/shami/profile/' + app.profileImg">
            </div>
            <div style=" margin-top: 10px;">{{ o.nombres }} {{ o.apPaterno }} {{ o.apMaterno }}</div>
            <div>{{ session.user }}</div>
          </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ul class="v-menu" v-if="perms" @click="hide">
        <v-item icon="fa-home" href="/admin" label="Inicio"></v-item>
        <v-item icon="fa-user" href="/admin/profile" label="Mi Cuenta"></v-item>
        <v-item icon="fa-sliders-h" href="/admin/setting" label="Configuración"></v-item>
        <v-item v-if="perms.INVENTORY_ADMIN" icon="fa-table" href="/admin/inventory/item" label="Inventario">
          <v-item v-if="perms.INVENTORY_ADMIN" icon="fa-plus" href="/admin/inventory/item/create" label="Agregar" />
        </v-item>

        <v-item v-if="perms.DS_PEOPLE_READ" icon="fa-table" href="/admin/desarrollo-social/people" label="Personas">
          <v-item v-if="perms.DS_PEOPLE_REGISTER" icon="fa-plus" href="/admin/desarrollo-social/people/create"
            label="Agregar" />
        </v-item>

        <v-item v-if="perms.DESARROLLO_SOCIAL_ADULTO_MAYOR_READ" icon="fa-table"
          href="/admin/desarrollo-social/adulto-mayor" label="Adulto Mayor">
          <v-item v-if="perms.CDESARROLLO_SOCIAL_ADULTO_MAYOR_ADMIN" icon="fa-plus"
            href="/admin/desarrollo-social/adulto-mayor/creare" label="Agregar" />
        </v-item>
        <v-item v-if="perms.OBRESEC" icon="fa-table" href="/admin/obresec/crime/type" label="Tipo Delitos"></v-item>
        <v-item v-if="perms.OBRESEC" icon="fa-table" href="/admin/obresec/crime/category"
          label="Categoria Delitos"></v-item>
        <v-item v-if="perms.OBRESEC" icon="fa-table" href="/admin/obresec/risk/type" label="Tipo Riesgos"></v-item>
        <v-item v-if="perms.OBRESEC" icon="fa-table" href="/admin/obresec/crime" label="Delitos"></v-item>
        <v-item v-if="perms.OBRESEC" icon="fa-table" href="/admin/obresec/risk" label="Riesgos"></v-item>
        <v-item v-if="perms.MCI_READ" icon="fa-table" href="/admin/desarrollo-social/sivico" label="MCI"></v-item>
        <v-item v-if="perms.EMED_READ" icon="fa-table" href="/admin/desarrollo-social/emed" label="EMED">
          <v-item v-if="perms.EMED_REGISTER" icon="fa-plus" href="/admin/desarrollo-social/emed/create"
            label="Agregar" />
        </v-item>
        <v-item v-if="perms.MATERNO_ADMIN" icon="fa-table" href="/admin/desarrollo-social/vea-materno"
          label="VEA Materno" />
        <v-item v-if="perms.CANCER_READ" icon="fa-table" href="/admin/desarrollo-social/cancer" label="Cancer" />
        <v-item v-if="perms.HR_PERSONAL_READ" icon="fa-table" href="/admin/hr/personal" label="Personal" />
        <v-item v-if="perms.PAYROLL_READ" icon="fa-table" href="/admin/hr/employee" label="Empleados" />
        <v-item v-if="perms.PAYROLL_READ" icon="fa-table" href="/admin/payroll/chd"
          label="Constancia de Pago de Haberes y Descuentos" />
        <v-item v-if="perms.PREGNANT_READ" icon="fa-person-pregnant" href="/admin/desarrollo-social/pregnant"
          label="Gestantes" />
        <v-item icon="fa-exclamation-triangle" style="display: flex;">
          <template v-slot:label>
            <v-checkbox v-model="app.connected" label="Connectado" />
          </template>
        </v-item>
        <hr style="background: #d5d5d5;margin-top: 10px;margin-bottom: 10px;">
        <v-item icon="fa-sign-out-alt" @click="app.logout" label="Cerrar Sessión" />
      </ul>
    </ion-content>
  </ion-menu>
</template>

<script>

import { useCounterStore } from "./stores/counter";
import { storeToRefs } from "pinia";
import { ui } from 'isobit-ui'
import { IonContent, IonHeader, IonItem, IonMenu, IonTitle, IonToolbar, menuController } from '@ionic/vue';
import { onMounted, ref } from "vue";

export default ui({


  components: { IonHeader, IonMenu, IonItem, IonTitle, IonToolbar, IonContent },
  setup() {
    const { count } = storeToRefs(useCounterStore());
    const imgError = ref('');
    const hide = () => {
      menuController.close('main-content');
    }
    onMounted(() => {
      import("./cdn/images/smile.png").then((image) => {
        imgError.value = image.default;
      });
      //console.log(cxt.session, cxt.session)
      //if (me.session?.people && me.app) me.app.profile = me.session.people.urlPerfil;
    });
    return { count, imgError, hide };
  }
})
</script>