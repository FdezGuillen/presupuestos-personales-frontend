<template>
  <!-- PÁGINA PARA RESETEAR CONTRASEÑA OLVIDADA -->
  <q-page class="row justify-evenly">
    <div class="col-12 col-md-4 q-pa-md formulario">
      <q-card class="q-pa-md">
        <q-form @submit="guardar" class="q-gutter-md">
          <p>Introduce tu nueva contraseña</p>
          <q-input
            filled
            v-model="password"
            type="password"
            label="Nueva contraseña"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
          />

          <div class="button-wrapper">
            <q-btn label="Guardar contraseña" type="submit" color="primary" />
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
  password = "";

  //envía contraseña al servidor para actualizarla
  guardar() {
    let objetoCuerpo = {
      token: this.$router.currentRoute.query.token,
      user_id: this.$router.currentRoute.query.id,
      password: this.password
    };

    this.$store
      .dispatch("auth/resetearPassword", objetoCuerpo)
      .then(res => {
        alert(
          "Contraseña guardada correctamente. Inicia sesión con tus nuevos datos"
        );
        this.$router.push("login");
      })
      .catch((error: any) => {
        this.mostrarNotificacion(
          "No se pudo completar el proceso. Por favor, inténtalo más tarde.",
          "negative"
        );
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
