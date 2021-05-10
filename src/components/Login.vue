<template>
  <div class="col-12 col-md-4 q-pa-md formulario">
    <q-card>
      <q-tabs v-model="tab" class="text-teal">
        <q-tab name="login" label="Iniciar sesión" />
        <q-tab name="register" label="Registrarse" />
      </q-tabs>
      <q-separator />

      <!-- LOGIN -->
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <q-form @submit="iniciarSesion" class="q-gutter-md">
            <q-input
              filled
              v-model="emailLogin"
              type="email"
              label="Correo electrónico"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
            />

            <q-input
              filled
              type="password"
              v-model="passwordLogin"
              label="Contraseña"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Campo obligatorio'
                //val => val > 0 && val < 100 || 'Please type a real age'
              ]"
            />
            <div class="button-wrapper">
              <q-btn label="Entrar" type="submit" color="primary" />
            </div>
            <div class="button-wrapper">
              <router-link to="/recuperar-cuenta"
                >He olvidado mi contraseña</router-link
              >
            </div>
          </q-form>
        </q-tab-panel>

        <!-- REGISTRO  -->
        <q-tab-panel name="register">
          <q-form @submit="registrar" class="q-gutter-md">
            <q-input
              filled
              v-model="username"
              type="text"
              label="Nombre de usuario"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
            />
            <q-input
              filled
              v-model="nombre"
              type="text"
              label="Nombre"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
            />

            <q-input
              filled
              v-model="apellidos"
              type="text"
              label="Apellidos"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
            />

            <q-input
              filled
              v-model="email"
              type="email"
              label="Correo electrónico"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
            />

            <q-input
              filled
              type="password"
              v-model="password"
              label="Contraseña"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Campo obligatorio'
                //val => val > 0 && val < 100 || 'Please type a real age'
              ]"
            />
            <div class="button-wrapper">
              <q-btn label="Crear cuenta" type="submit" color="primary" />
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script lang="ts">
import AuthService from "../services/auth-service";
import { Vue, Component } from "vue-property-decorator";
import { AxiosResponse } from "app/node_modules/axios";

@Component
export default class LoginComponent extends Vue {
  tab = "login";

  //Login
  emailLogin = "";
  passwordLogin = "";

  //Registro
  username = "";
  nombre = "";
  apellidos = "";
  email = "";
  password = "";
  loggedIn = this.$store.state.auth.status.loggedIn;

  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  }

  handleLogin() {
    if (this.emailLogin && this.passwordLogin) {
      this.$store
        .dispatch("auth/login", {
          correo_electronico: this.emailLogin,
          password: this.passwordLogin
        })
        .then(
          () => {
            this.$router.push("/");
          },
          error => {
            if (
              typeof error.response !== "undefined" &&
              typeof error.response.data !== "undefined" &&
              typeof error.response.data.error !== "undefined"
            ) {
              this.mostrarNotificacion(error.response.data.error, "negative");
            } else {
              this.mostrarNotificacion(
                "No se pudo completar el registro. Por favor, vuelve a intentarlo más tarde",
                "negative"
              );
            }
          }
        );
    }
  }

  iniciarSesion() {
    let usuario = {
      correo_electronico: this.emailLogin,
      password: this.passwordLogin
    };

    this.$store
      .dispatch("auth/login", usuario)
      .then((res: XMLHttpRequest) => {
          this.$router.go("/");
      })
      .catch((error: any) => {
        let respuesta = error.response;
        console.log(respuesta);
        if (typeof respuesta !== "undefined") {
          this.mostrarNotificacion(respuesta.data.error, "negative");
        } else {
          this.mostrarNotificacion(
            "No se pudo iniciar sesión. Por favor, inténtalo más tarde.",
            "negative"
          );
        }
      });
  }

  registrar() {
    let usuario = {
      username: this.username,
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo_electronico: this.email,
      password: this.password
    };

    this.$store
      .dispatch("auth/register", usuario)
      .then((res: AxiosResponse) => {
        this.mostrarNotificacion(
          "Registro completado. Inicia sesión para acceder a tu cuenta",
          "positive"
        );
        this.tab = "login";
        this.username = "";
        this.nombre = "";
        this.apellidos = "";
        this.email = "";
        this.password = "";
      })
      .catch((error: any) => {
        if (
          typeof error.response !== "undefined" &&
          typeof error.response.data !== "undefined" &&
          typeof error.response.data.error !== "undefined"
        ) {
          this.mostrarNotificacion(error.response.data.error, "negative");
        } else {
          this.mostrarNotificacion(
            "No se pudo completar el registro. Por favor, vuelve a intentarlo más tarde",
            "negative"
          );
        }
      });
  }

  mostrarNotificacion(mensaje: string, tipo = "info") {
    this.$q.notify({
      message: mensaje,
      type: tipo
    });
  }
}
</script>
