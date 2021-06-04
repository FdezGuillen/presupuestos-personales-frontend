<template>
  <!-- PÁGINA PARA RECUPERAR CUENTA -->
  <q-page class="row justify-evenly">
    <div class="col-12 col-md-4 q-pa-md formulario">
      <q-card class="q-pa-md">
        <q-form @submit="recuperar" class="q-gutter-md">
          <p>Introduce tu correo electrónico y te enviaremos tu contraseña</p>
          <q-input
            filled
            v-model="emailLogin"
            type="email"
            label="Correo electrónico"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
          />

          <div class="button-wrapper">
            <q-btn label="Recuperar cuenta" type="submit" color="primary" />
          </div>
          <div class="button-wrapper">
            <router-link to="/login">Volver</router-link>
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { AxiosResponse } from "app/node_modules/axios";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class HomeComponent extends Vue {
  emailLogin = "";

  //Envía petición al servidor para iniciar el proceso de recuperación de cuenta
  recuperar() {
    this.$store
      .dispatch("auth/recuperar", this.emailLogin)
      .then(res => {
        this.mostrarNotificacion(res.mensaje);
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
            "No se pudo completar el proceso. Por favor, inténtalo más tarde.",
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
