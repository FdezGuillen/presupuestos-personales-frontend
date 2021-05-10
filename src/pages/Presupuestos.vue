<template>
  <div class="q-pa-lg">
    <div class="row justify-center">
      <h4>Presupuestos</h4>
    </div>
    <div class="row justify-center">
      <div class="col-12 col-md-10 q-pa-md">
        <q-table
          grid
          card-class="bg-primary text-white"
          :data="data"
          :columns="columnas"
          row-key="_id"
          :filter="filter"
          hide-header
          @row-click="elegirPresupuesto"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscar"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              flat
              round
              color="primary"
              icon="add"
              aria-label="Crear presupuesto"
              @click="formulario = true"
            />
          </template>
        </q-table>
      </div>
    </div>

    <!-- Formulario -->
    <q-dialog v-model="formulario" persistent>
        <PresupuestoForm
         :presupuesto="presupuesto"
         :divisas="divisas"
         @guardarPresupuesto="guardarPresupuesto($event)"
         @cerrar="formulario=false"
        />
    </q-dialog>
    
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import PresupuestoService from "../services/presupuesto-service";
import PresupuestoForm from "../components/PresupuestoForm.vue";

@Component({
    components: { PresupuestoForm },
})
export default class PresupuestosComponent extends Vue {
  data() {
    return {
      divisas: [],
      filter: "",
      columnas: [
        {
          label: "Haz click para seguir planificando",
          name: "nombre",
          align: "center",
          field: "nombre",
          sortable: true
        },
        {
          name: "fecha_inicio",
          align: "center",
          label: "Fecha de inicio",
          field: "fecha_inicio",
          sortable: true
        },
        {
          name: "fecha_fin",
          label: "Fecha final",
          field: "fecha_fin",
          sortable: true
        }
      ],
      data: []
    };
  }

  created() {
    PresupuestoService.consultarDivisas()
      .then(res => {
        let divisas = res.data.divisas;
        let opciones: { label: string; value: any }[] = [];
        divisas.forEach(d => {
          opciones.push({
            label: d.simbolo + " (" + d.nombre + ")",
            value: d.codigo
          });
        });
        this.divisas = opciones;
        this.consultarPresupuestos();
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      });
  }

  presupuesto = {
    nombre: "",
    descripcion: "",
    objetivo: null,
    fecha_inicio: new Date(),
    fecha_fin: null,
    divisa: "",
    gastos_previstos: [],
    ingresos_previstos: []
  };

  formulario = false;

  consultarPresupuestos() {
    PresupuestoService.consultar()
      .then(res => {
        this.data = res.data.presupuestos;
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      });
  }

  borrarPresupuesto() {
    this.presupuesto = {
      nombre: "",
      descripcion: "",
      objetivo: null,
      fecha_inicio: new Date(),
      fecha_fin: null,
      divisa: "cod_euro",
      gastos_previstos: [],
      ingresos_previstos: []
    };
  }

  guardarPresupuesto(presupuesto:any) {
    presupuesto["divisa"] = presupuesto.divisa.value;
    PresupuestoService.crearPresupuesto(presupuesto)
      .then(res => {
        this.mostrarNotificacion(
          "Presupuesto creado. ¡Ya puedes empezar a planificarlo!",
          "positive"
        );
        this.data = res.data.presupuestos;
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      })
      .finally(() => {
        this.borrarPresupuesto();
        this.formulario = false;
      });
  }

  elegirPresupuesto(event: any, row: any){
      console.log(row._id);
      this.$router.push("/presupuestos/" + row._id);
  }

  mostrarNotificacion(mensaje: string, tipo = "info") {
    this.$q.notify({
      message: mensaje,
      type: tipo
    });
  }
}
</script>
