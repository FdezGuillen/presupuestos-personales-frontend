<template>
  <q-layout id="q-app" view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          v-if="usuario"
        />

        <q-toolbar-title class="titulo-toolbar">
          <a href="/">Mis Presupuestos Personales</a>
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <div>
          <q-btn
            flat
            round
            color="white"
            icon="logout"
            @click.prevent="logOut"
            v-if="usuario"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
      v-if="usuario"
      class="navegacion"
    >
      <q-list class="items">
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <!-- Encabezado con cuenta -->
      <q-img class="absolute-top-right encabezado" src="fondo-encabezado.jpg">
        <div class="absolute-bottom bg-transparent">
          <div class="absolute-top-right bg-transparent">
            <q-btn
              flat
              dense
              round
              icon="edit"
              aria-label="Editar cuenta de usuario"
              @click="$router.replace('/mi-cuenta')"
              v-if="usuario"
            />
          </div>
          <q-avatar size="56px" class="q-mb-sm">
            <img v-bind:src="avatar" />
          </q-avatar>
          <div class="text-weight-bold">
            {{ usuario.nombre }} {{ usuario.apellidos }}
          </div>
          <div>{{ usuario.username }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import EssentialLink from "components/EssentialLink.vue";

const linksData = [
  {
    title: "Home",
    icon: "home",
    link: "/"
  },
        {
    title: "Presupuestos",
    icon: "assessment",
    link: "/presupuestos"
  },
    {
    title: "Categorías",
    icon: "bookmarks",
    link: "/categorias"
  },

];

@Component({
  components: { EssentialLink },

  computed: {
    usuario() {
      return this.$store.state.auth.user;
    },

    avatar() {
      try {
        if (
          typeof this.$store.state.auth.user.imagen_perfil !== "undefined" &&
          this.$store.state.auth.user.imagen_perfil.trim() !== ""
        ) {
          return (
            "data:image/gif;base64," + this.$store.state.auth.user.imagen_perfil
          );
        }
        return "avatar-defecto.png";
      } catch (err) {
        return "avatar-defecto.png";
      }
    }
  }
})
export default class App extends Vue {
  leftDrawerOpen = false;
  essentialLinks = linksData;
  logOut() {
    // this.usuario = null;
    this.$store.dispatch("auth/logout");
    this.$router.push("/login");
  }
}
</script>
