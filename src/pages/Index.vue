<template>
  <q-page class="row justify-evenly">
    <login-component></login-component>
  </q-page>
</template>

<script lang="ts">
import LoginComponent from 'components/Login.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: { LoginComponent }
})
export default class PageIndex extends Vue {

}
</script>
