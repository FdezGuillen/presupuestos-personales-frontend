<template>
  <div class="col-12 col-md-6 q-pa-md">
    <div class="row justify-center">
      <h4>Home</h4>
    </div>
    <div class="row justify-center">
      <h5>Guardar movimiento (acceso rápido)</h5>
    </div>
    <div class="row justify-center">
      <movimiento-form></movimiento-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MovimientoForm from "../components/MovimientoForm.vue";

@Component({
  components: { MovimientoForm }
})
export default class HomeComponent extends Vue {}
</script>
