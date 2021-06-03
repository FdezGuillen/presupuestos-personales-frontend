<template
  ><div>
    <div v-if="presupuestos && presupuestos.length > 0">
      <q-form @submit="crearMovimiento" class="q-gutter-md">
        <q-select
          class="col-12 q-pb-md"
          filled
          v-model="tipo"
          :options="tipos"
          option-value="value"
          option-label="label"
          label="Tipo de movimiento"
        />

        <q-input
          filled
          v-model="cantidad"
          type="number"
          label="Cantidad"
          lazy-rules
          :rules="[val => val > 0 || 'Campo obligatorio']"
        />

        <q-select
          class="col-12 q-pb-md"
          filled
          v-model="categoria"
          :options="categorias"
          option-value="value"
          option-label="label"
          label="Categoría"
        />

        <q-input
          class="col-12 col-md-6 q-pb-md q-pr-md"
          filled
          label="Fecha"
          v-model="fecha"
          mask="date"
          :rules="['date']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="fecha">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select
          class="col-12 q-pb-md"
          filled
          v-model="presupuesto"
          :options="presupuestos"
          option-value="value"
          option-label="label"
          label="Presupuesto"
        />
        <div class="button-wrapper">
          <q-btn label="Guardar" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
    <div v-if="!presupuestos || presupuestos.length == 0" class="aviso-presupuestos">
      <h5>No tienes ningún presupuesto</h5>
        <router-link to="/presupuestos"
                >Crea uno para empezar</router-link
              >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import PresupuestoService from "../services/presupuesto-service";
import CategoriaService from "../services/categoria-service";
@Component
export default class MovimientoForm extends Vue {
  data() {
    return {
      tipo: null,
      cantidad: 0,
      fecha: new Date(),
      categoria: null,
      presupuesto: null,
      presupuestos: [],
      categorias: [],
      tipos: [
        { label: "Gasto", value: "gasto" },
        { label: "Ingreso", value: "ingreso" }
      ]
    };
  }

  created() {
    this.consultarPresupuestos();
    this.consultarCategorias();
  }

  consultarPresupuestos() {
    PresupuestoService.consultar()
      .then(res => {
        let opciones = [];
        res.data.presupuestos.forEach(pres => {
          opciones.push({
            label: pres.nombre,
            value: pres._id
          });
        });
        this.presupuestos = opciones;
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      });
  }

  consultarCategorias() {
    CategoriaService.consultar().then(res => {
      let categorias = res.data.categorias;
      let opciones: { label: string; value: any }[] = [];
      categorias.forEach(d => {
        opciones.push({
          label: d.nombre,
          value: d._id
        });
      });

      this.categorias = opciones;
    });
  }

  crearMovimiento() {
    let movimiento = {
      tipo: this.tipo.value,
      categoria: this.categoria.value,
      fecha: new Date(this.fecha),
      cantidad: this.cantidad,
      presupuesto: this.presupuesto.value
    };

    PresupuestoService.crearMovimiento(movimiento)
      .then(res => {
        this.mostrarNotificacion("Movimiento guardado con éxito", "positive");
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
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
<style>

.aviso-presupuestos{
  text-align: center;
}

</style>
