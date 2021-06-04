<template>
  <!-- PÁGINA DE GESTIÓN DE DATOS DE USUARIO -->
  <div class="q-pa-lg">
    <div class="row justify-center">
      <q-avatar size="150px" class="q-mb-sm items-center avatar-usuario">
        <img v-bind:src="avatar" />
      </q-avatar>
    </div>
    <div class="text-h5 text-center q-mt-sm q-mb-xs ">{{ username }}</div>
    <div class="q-pa-lg row justify-center">
      <div class="q-gutter-y-md col-12">
        <q-tabs v-model="tab" class="text-teal">
          <q-tab name="editar" icon="edit" label="Editar datos de usuario" />
          <q-tab name="danger" icon="warning" label="Danger zone" />
        </q-tabs>
        <q-separator />
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <q-tab-panels v-model="tab" animated>
          <!-- EDITAR DATOS -->
          <q-tab-panel name="editar" class="col-12 col-md-6 col-lg-4">
            <q-form @submit="editar">
              <q-file
                v-model="imagen"
                label="Cambiar imagen de perfil"
                multiple
                filled
                accept=".jpg, image/*"
                @rejected="onRejected"
                class="q-my-md"
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
                label="Introduce tu contraseña para confirmar los cambios"
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
              />
              <div class="button-wrapper">
                <q-btn label="Guardar" type="submit" color="primary" />
              </div>
            </q-form>
          </q-tab-panel>

          <!-- DANGER ZONE  -->
          <q-tab-panel name="danger" class="col-12 col-md-6 col-lg-4">
            <q-form @submit="cambiarPassword" class="q-gutter-md q-my-lg">
              <div class="text-h6 q-mt-sm q-mb-xs">Modificar contraseña</div>
              <q-input
                filled
                type="password"
                v-model="nuevaPassword"
                label="Contraseña nueva"
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
              />
              <q-input
                filled
                type="password"
                v-model="passwordActual"
                label="Introduce tu contraseña antigua para confirmar los cambios"
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
              />
              <div class="button-wrapper">
                <q-btn label="Guardar" type="submit" color="primary" />
              </div>
            </q-form>

            <q-separator />
            <div class="q-my-lg">
              <div class="text-h6 q-mt-sm q-mb-xs ">Darse de baja</div>
              <p class="text-red">
                ¡Cuidado! Si eliminas tu cuenta no podrás recuperarla.
              </p>
              <div class="button-wrapper">
                <q-btn
                  label="Eliminar cuenta"
                  @click="confirm = true"
                  color="negative"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <!-- Diálogo de confirmación -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-form @submit="eliminarCuenta" class="q-gutter-md q-my-lg">
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="negative" text-color="white" />
            <span class="q-ml-sm q-my-lg"
              >¿Seguro que quieres darte de baja?</span
            >
            <q-input
              class="col-12"
              filled
              type="password"
              v-model="passwordEliminar"
              label="Introduce tu contraseña para confirmar"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn
              flat
              label="Eliminar cuenta"
              color="negative"
              type="submit"
              v-close-popup
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { AxiosError } from "app/node_modules/axios";
import { Vue, Component } from "vue-property-decorator";
import UsuarioService from "../services/usuario-service";

@Component({
  computed: {
    usuario() {
      return this.$store.state.auth.user;
    },

    avatar() {
      if (
        typeof this.$store.state.auth.user.imagen_perfil !== "undefined" &&
        this.$store.state.auth.user.imagen_perfil.trim() !== ""
      ) {
        return (
          "data:image/gif;base64," + this.$store.state.auth.user.imagen_perfil
        );
      }
      return "avatar-defecto.png";
    }
  }
})
export default class UsuarioComponent extends Vue {
  confirm = false;

  tab = "editar";
  username = this.$store.state.auth.user.username;
  nombre = this.$store.state.auth.user.nombre;
  apellidos = this.$store.state.auth.user.apellidos;
  email = this.$store.state.auth.user.correo_electronico;
  password = "";

  nuevaPassword = "";
  passwordActual = "";

  passwordEliminar = "";
  imagen = [];

  // Envía datos del usuario al servidor para actualizarlo
  editar() {
    let usuario = {
      username: this.username,
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo_electronico: this.email,
      password: this.password,
      file: this.imagen[0]
    };

    UsuarioService.modificarUsuario(usuario)
      .then((res: any) => {
        // this.mostrarNotificacion(res.data.mensaje, "positive");
        this.$router.go("/mi-cuenta");
      })
      .catch((error: AxiosError) => {
        console.log(error);
        this.mostrarNotificacion(
          "No se pudo actualizar los datos. Por favor, inténtalo de nuevo más tarde",
          "negative"
        );
      });
  }

  // Envía petición al servidor para actualizar contraseña
  cambiarPassword() {
    let datos = {
      username: this.$store.state.auth.user.username,
      password: this.passwordActual,
      password_nueva: this.nuevaPassword
    };
    UsuarioService.modificarPassword(datos)
      .then((res: any) => {
        this.mostrarNotificacion(res.data.mensaje, "positive");
      })
      .catch((error: AxiosError) => {
        console.log(error);
        this.mostrarNotificacion(
          "No se pudo actualizar la contraseña. Por favor, inténtalo de nuevo más tarde",
          "negative"
        );
      });
  }

  // Envía petición al servidor para eliminar cuenta
  eliminarCuenta() {
    let datos = {
      username: this.$store.state.auth.user.username,
      password: this.passwordEliminar
    };
    UsuarioService.eliminarCuenta(datos)
      .then((res: any) => {
        this.$store.dispatch("auth/logout");
      })
      .catch(error => {
        this.passwordEliminar = "";
        this.mostrarNotificacion(error.response.data.error, "negative");
      });
  }

// Si se intenta subir una imagen muy pesada, se muestra un toast de error
  onRejected(archivos: any) {
    this.$q.notify({
      type: "negative",
      message: `${archivos.length} imágenes no cumplen con los requisitos`
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
