<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Mis Presupuestos Personales
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <div><q-btn flat round color="white" icon="login" /></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [

  {
    title: 'Mi cuenta',
    icon: 'person',
    link: '/mi-cuenta'
  }
]

import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: { EssentialLink }
})
export default class MainLayout extends Vue {
  leftDrawerOpen = false;
  essentialLinks = linksData;

    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
}
</script>
