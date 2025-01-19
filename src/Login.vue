<template>
  <div style="background-color: white; height: 100%; overflow: auto">
    <img src="@/cdn/images/fondo-login.svg" width="100%"
      style="position: absolute; object-fit: cover; height: 700px; bottom: 0px" />
    <div id="logoiniciosesion" class="center">
      <!--img height="120" class="ui-banner-login" src="@/fs/images/logo-final.svg" /-->
    </div>
    <form id="LoginForm">
      <div style="margin-top: 20px; padding: 30px; padding-top: 80px" class="LoginForm v-form">
        <div class="v-input-label" style="margin-bottom: 25px">
          <label position="floating" v-on:click="focus"
            style="color: white; border: 0px; font-weight: unset !important">Usuario</label>
          <input class="input-login" v-on:focus="$event.target.parentNode.classList.add('v-focus')"
            v-on:focusout="focusout" type="text" v-model="o.name" required />
        </div>
        <div class="v-input-label" style="margin-bottom: 40px">
          <label position="floating" v-on:click="focus"
            style="color: white; border: 0px; font-weight: unset !important">Contraseña</label>
          <input class="input-login" v-on:focus="$event.target.parentNode.classList.add('v-focus')"
            v-on:focusout="focusout" v-bind:type="type" v-model="o.pass" minlength="6" required />
          <span v-if="o.pass" style="color: white; position: absolute; bottom: 5px; right: 5px"
            v-on:click="type = type == 'text' ? 'password' : 'text'" v-bind:class="type == 'text' ? 'key' : 'eye'"><i
              class="fa" v-bind:class="type == 'text' ? 'fa-key' : 'fa-eye'"></i></span>
        </div>
        <div class="center">
          <v-button expand="block" style="
              font-size: 20px !important;
              margin-bottom: 30px;
              padding: 10px 15px;
              color: #3a62a8;
              background: #fbe501;
              border-radius: 15px;
              border-width: 0px;
            " @click.prevent="login" value="INGRESAR" :disabled="!isValid" />
        </div>
        <a @click="$router.push('/register')" style="margin-bottom: 10px">Registrate</a>
        <a @click="$router.push('/password')">&iquest;Olvidaste tu Contrase&ntilde;a?</a>
        <div class="center" style="
   font-size: 10px;
    margin-top: 20px;
    color: white;">BUILT ON: {{ app.BUILT_ON }}<br />{{ VITE_LOGIN_PATH }}</div>

      </div>
    </form>
  </div>
</template>
<script>
//70896448
import { ui } from 'vue3-ui'
import axios from 'axios'
import { toastController } from '@ionic/vue';

export default ui({
  data() {
    return {
      type: "password",
      o: { name: "", pass: "" },
      data: [],
      isValid: false,
      VITE_LOGIN_PATH: `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_LOGIN_PATH}`
    };
  },
  updated() {
    console.log('update');
    this.isValid = this.validate(0);
    //_.app.bindLinks(this.$el);
  },
  created() {
    //console.log(this.app)
    //this.o.name = _.app.usuario;
  },
  methods: {
    focus(e) {
      //console.log(e.target.nextSibling.focus());
    },
    focusout(e) {
      if (!e.target.value) {
        e.target.parentNode.classList.remove("v-focus");
      }
    },
    initSession(session) {
      const me = this;
      me.session = session;
      me.app.connect();
      me.$router.push("/");
    },
    success({ token, perms, user_nicename }) {
      const me = this;
      if (token) {
        axios.defaults.headers.common = {
          Authorization: `Bearer ` + token,
        };
        if (perms) {
          me.initSession({ token, people: { display_name: user_nicename }, perms });
        } else {
          axios.get("/api/user").then(({ data }) => {
            me.initSession({ token, people: { display_name: data.data.display_name }, perms: data.allcaps });
          });
        }
      } else {
        this.openToast();
        //_.MsgBox('El usuario o la contrase&ntilde;a no son reconocidas por el servidor.');
      }
    },
    login() {
      const me = this;
      if (me.validate(me.$el)) {
        axios.config = {};
        axios.defaults.headers.common = {};
        axios.post(import.meta.env.VITE_LOGIN_PATH, {
          username: this.o.name,
          password: this.o.pass,
        }).then((response) => {
          me.success(response.data);
        });
      }
    },
    async openToast() {
      const toast = await toastController.create({
        message: "El correo o contraseña es incorrecto",
        duration: 4000,
      });
      await toast.present();
    }
  },
});
</script>
<style scoped>
.content-login {
  background-color: white;
  position: relative;
}

.button-native {
  background-color: #fbe501;
}

h3 {
  margin: 40px 0 0;
}

a {
  color: #fbe501;
}

.v-primary-dark i {
  margin-right: 10px;
}

html {
  height: 100%;
}

body {
  padding: 20px;
  background-image: linear-gradient(#007bff, #000000);
  min-height: calc(100% - 40px);
  margin: 0;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

a {
  display: block;
  text-align: center;
}

a:hover {
  color: white;
}

.v-button {
  border-radius: 10px;
}

.inner {
  border-radius: 10px;
  position: relative;
}

label {
  display: inline-block;
  margin-bottom: 0px;
  font-size: 20px;
}

#logoiniciosesion {
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 0px;
  margin-right: 0px;
  padding-top: 50px;
  padding-bottom: 50px;
}

ion-label {
  font-size: 28px;
  font-weight: bolder !important;
  font-family: PTSans !important;
  margin-bottom: 10px;
}

.enlaces {
  margin-right: 40px;
  margin-left: 40px;
  background-color: #e9bc27;
}

.LoginForm {
  position: absolute;
  bottom: 0px;
  width: -webkit-fill-available;
}

.LoginForm>ion-item,
input:required:empty,
.native-input.sc-ion-input-md {
  --background: transparent !important;
  background-color: transparent !important;
}

.v-input-label {
  position: relative;
  padding-top: 22px;
}

.v-input-label.v-focus>label {
  color: white;
  font-size: 15px;
  top: 0px;
}

.v-input-label>label {
  transition-property: font-size, top;
  transition-duration: 0.5s;
  position: absolute;
  color: white;
  top: 20px;
  margin-left: 5px;
}

.v-input-label>input {
  color: white;
  text-align: center;
  border-radius: 0px !important;
  border-width: 0px 0px 1px;
}
</style>
