<template>
  <div class="q-pa-lg">
    <div class="row justify-start">
      <!-- Nombre, descripción, objetivo y fechas -->
      <div class="col-12">
        <div class="row justify-end">
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click="eliminar = true"
          />
          <q-btn
            flat
            round
            color="primary"
            icon="save"
            @click="guardarCambios"
          />
        </div>
      </div>
      <q-card class="my-card col-12 col-md-4" flat bordered>
        <q-card-section horizontal class="row">
          <q-card-section class="col-12">
            <div class="row">
              <div class="text-h5 q-mt-sm q-mb-xs col-10">
                {{ presupuesto.nombre }}
              </div>
              <q-btn
                class="float-right"
                flat
                round
                color="primary"
                icon="edit"
                @click="formulario = true"
              />
            </div>
            <div class="text-caption text-grey">
              {{ presupuesto.descripcion }}
            </div>
            <div class="text-h6 q-mt-sm q-mb-xs">
              Tienes que conseguir ahorrar {{ presupuesto.objetivo }}
              {{ divisaPresupuesto.simbolo }}
            </div>
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-section class="row justify-start">
          <div class="q-gutter-md q-mr-sm" style="font-size: 2em">
            <q-icon name="today" />
          </div>
          <div class="col-10">
            <div>Fecha de inicio: {{ presupuesto.fecha_inicio }}</div>
            <div>Fecha límite: {{ presupuesto.fecha_fin }}</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-separator class="q-mt-lg q-mb-lg" />

    <div class="row justify-start">
      <!-- Movimientos previstos -->
      <div class="q-mt-lg q-mr-lg col-12 col-md-5">
        <div class="text-h5 q-mt-sm q-mb-xs">
          Movimientos previstos
        </div>
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="gastos" label="Gastos" />
            <q-tab name="ingresos" label="Ingresos" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="gastos">
              <div class="row justify-end">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="add"
                  aria-label="Añadir gasto"
                  @click="addGasto"
                />
              </div>
              <q-table
                :data="presupuesto.gastos_previstos"
                :columns="columns"
                row-key="name"
                binary-state-sort
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-tooltip>Haz click en un valor para editar</q-tooltip>
                    <q-td key="categoria" :props="props">
                      {{ props.row.categoria }}
                      <q-popup-edit v-model="props.row.name">
                        <q-select
                          class="col-12 q-pb-md"
                          filled
                          v-model="props.row.categoria"
                          :options="nombresCategorias"
                          label="Categoría"
                          :rules="[val => val !== null || 'Campo obligatorio']"
                        />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="cantidad" :props="props">
                      {{ props.row.cantidad }}
                      <q-popup-edit
                        v-model="props.row.cantidad"
                        title="Actualizar cantidad"
                        buttons
                      >
                        <q-input
                          type="number"
                          v-model="props.row.cantidad"
                          dense
                          autofocus
                        />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="acciones" :props="props">
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        aria-label="Eliminar gasto"
                        @click="eliminarGasto(props.row)"
                      />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel name="ingresos">
              <div class="row justify-end">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="add"
                  aria-label="Añadir ingreso"
                  @click="addIngreso"
                />
              </div>
              <q-table
                :data="presupuesto.ingresos_previstos"
                :columns="columns"
                row-key="name"
                binary-state-sort
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-tooltip>Haz click en un valor para editar</q-tooltip>
                    <q-td key="categoria" :props="props">
                      {{ props.row.categoria }}
                      <q-popup-edit v-model="props.row.name">
                        <q-select
                          class="col-12 q-pb-md"
                          filled
                          v-model="props.row.categoria"
                          :options="nombresCategorias"
                          label="Categoría"
                          :rules="[val => val !== null || 'Campo obligatorio']"
                        />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="cantidad" :props="props">
                      {{ props.row.cantidad }}
                      <q-popup-edit
                        v-model="props.row.cantidad"
                        title="Actualizar cantidad"
                        buttons
                      >
                        <q-input
                          type="number"
                          v-model="props.row.cantidad"
                          dense
                          autofocus
                        />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="acciones" :props="props">
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        aria-label="Eliminar ingreso"
                        @click="eliminarIngreso(props.row)"
                      />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>

          <q-card-section>
            <div class="text-h6 q-mt-sm q-mb-xs">
              Balance previsto: {{ balancePrevisto }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Movimientos reales -->
      <div class="q-mt-lg col-12 col-md-6">
        <div class="text-h5 q-mt-sm q-mb-xs">
          Movimientos reales
        </div>
        <q-card>
          <q-tabs
            v-model="tabReales"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="gastos" label="Gastos" />
            <q-tab name="ingresos" label="Ingresos" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tabReales" animated>
            <q-tab-panel name="gastos">
              <div class="row justify-end">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="add"
                  aria-label="Añadir gasto"
                  @click="addGastoReal"
                />
              </div>
              <q-table
                :data="gastosReales"
                :columns="columnasReales"
                row-key="name"
                binary-state-sort
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-tooltip>Haz click en un valor para editar</q-tooltip>
                    <q-td key="categoria" :props="props">
                      {{ props.row.categoria }}
                      <q-popup-edit v-model="props.row.name">
                        <q-select
                          class="col-12 q-pb-md"
                          filled
                          v-model="props.row.categoria"
                          :options="nombresCategorias"
                          label="Categoría"
                          :rules="[val => val !== null || 'Campo obligatorio']"
                        />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="cantidad" :props="props">
                      {{ props.row.cantidad }}
                      <q-popup-edit
                        v-model="props.row.cantidad"
                        title="Actualizar cantidad"
                        buttons
                      >
                        <q-input
                          type="number"
                          v-model="props.row.cantidad"
                          dense
                          autofocus
                        />
                      </q-popup-edit>
                    </q-td>

                    <q-td key="fecha" :props="props">
                      {{ props.row.fecha }}
                      <q-popup-edit
                        v-model="props.row.fecha"
                        title="Actualizar fecha"
                        buttons
                      >
                        <q-input
                          class="col-12 col-md-6 q-pb-md"
                          filled
                          v-model="props.row.fecha"
                          label="Fecha"
                          mask="date"
                        >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy
                                ref="qDateProxy"
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-date v-model="props.row.fecha">
                                  <div class="row items-center justify-end">
                                    <q-btn
                                      v-close-popup
                                      label="Cerrar"
                                      color="primary"
                                      flat
                                    />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </q-popup-edit>
                    </q-td>

                    <q-td key="acciones" :props="props">
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        aria-label="Eliminar gasto"
                        @click="eliminarGastoReal(props.row)"
                      />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel name="ingresos">
              <div class="row justify-end">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="add"
                  aria-label="Añadir ingreso"
                  @click="addIngresoReal"
                />
              </div>
              <q-table
                :data="ingresosReales"
                :columns="columnasReales"
                row-key="name"
                binary-state-sort
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-tooltip>Haz click en un valor para editar</q-tooltip>
                    <q-td key="categoria" :props="props">
                      {{ props.row.categoria }}
                      <q-popup-edit v-model="props.row.name">
                        <q-select
                          class="col-12 q-pb-md"
                          filled
                          v-model="props.row.categoria"
                          :options="nombresCategorias"
                          label="Categoría"
                          :rules="[val => val !== null || 'Campo obligatorio']"
                        />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="cantidad" :props="props">
                      {{ props.row.cantidad }}
                      <q-popup-edit
                        v-model="props.row.cantidad"
                        title="Actualizar cantidad"
                        buttons
                      >
                        <q-input
                          type="number"
                          v-model="props.row.cantidad"
                          dense
                          autofocus
                        />
                      </q-popup-edit>
                    </q-td>

                    <q-td key="fecha" :props="props">
                      {{ props.row.fecha }}
                      <q-popup-edit
                        v-model="props.row.fecha"
                        title="Actualizar fecha"
                        buttons
                      >
                        <q-input
                          class="col-12 col-md-6 q-pb-md"
                          filled
                          v-model="props.row.fecha"
                          label="Fecha"
                          mask="date"
                        >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy
                                ref="qDateProxy"
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-date v-model="props.row.fecha">
                                  <div class="row items-center justify-end">
                                    <q-btn
                                      v-close-popup
                                      label="Cerrar"
                                      color="primary"
                                      flat
                                    />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </q-popup-edit>
                    </q-td>

                    <q-td key="acciones" :props="props">
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        aria-label="Eliminar ingreso"
                        @click="eliminarIngresoReal(props.row)"
                      />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>

          <q-card-section>
            <div class="text-h6 q-mt-sm q-mb-xs">
              Balance previsto: {{ balanceReal }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- Formulario -->
    <q-dialog v-model="formulario" persistent>
      <PresupuestoForm
        :presupuesto="presupuesto"
        :divisas="divisas"
        @guardarPresupuesto="guardarPresupuesto($event)"
        @cerrar="formulario = false"
      />
    </q-dialog>

    <!-- Confirmar eliminación -->
    <q-dialog v-model="eliminar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm q-my-lg"
            >¿Seguro que quieres eliminar este presupuesto?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            label="Eliminar presupuesto"
            color="negative"
            type="submit"
            v-close-popup
            @click="eliminarPresupuesto"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import PresupuestoService from "../services/presupuesto-service";
import CategoriaService from "../services/categoria-service";
import PresupuestoForm from "../components/PresupuestoForm.vue";

@Component({
  components: { PresupuestoForm }
})
export default class PresupuestoDetalleComponent extends Vue {
  data() {
    return {
      presupuesto: {},
      divisas: [],
      divisaPresupuesto: {
        simbolo: ""
      },
      categorias: [],
      nombresCategorias: [],
      balancePrevisto: 0,
      balanceReal: 0,
      columns: [
        {
          name: "categoria",
          align: "center",
          label: "Categoría",
          field: "categoria",
          sortable: true
        },
        {
          name: "cantidad",
          align: "center",
          label: "Cantidad",
          field: "cantidad",
          sortable: true
        },
        {
          name: "acciones",
          label: "Acciones",
          field: "acciones"
        }
      ],
      columnasReales: [
        {
          name: "categoria",
          align: "center",
          label: "Categoría",
          field: "categoria",
          sortable: true
        },
        {
          name: "cantidad",
          align: "center",
          label: "Cantidad",
          field: "cantidad",
          sortable: true
        },
        {
          name: "fecha",
          align: "center",
          label: "Fecha",
          field: "fecha",
          sortable: true
        },
        {
          name: "acciones",
          label: "Acciones",
          field: "acciones"
        }
      ],
      gastosReales: [],
      ingresosReales: []
    };
  }

  formulario = false;
  eliminar = false;
  id = this.$route.params.id;
  tab = "gastos";
  tabReales = "gastos";

  created() {
    PresupuestoService.consultarPorId(this.$route.params.id)
      .then(res => {
        this.presupuesto = res.data.presupuestos;
        this.divisaPresupuesto = res.data.presupuestos.divisa;
        this.presupuesto.divisa = {
          value: this.presupuesto.divisa.codigo,
          label:
            this.presupuesto.divisa.simbolo +
            " (" +
            this.presupuesto.divisa.nombre +
            ")"
        };

        let fechaInicio = new Date(this.presupuesto.fecha_inicio);
        this.presupuesto.fecha_inicio =
          fechaInicio.getFullYear() +
          "/" +
          fechaInicio
            .getMonth()
            .toString()
            .padStart(2, 0) +
          "/" +
          fechaInicio
            .getDate()
            .toString()
            .padStart(2, 0);

        if (typeof this.presupuesto.gastos_previstos === "undefined") {
          this.presupuesto.gastos_previstos = [];
        }

        if (typeof this.presupuesto.ingresos_previstos === "undefined") {
          this.presupuesto.ingresos_previstos = [];
        }

        this.gastosReales = this.presupuesto.gastos_reales;
        for (var g = 0; g < this.gastosReales.length; g++) {
          this.gastosReales[g].fecha = this.formatearFecha(
            new Date(this.gastosReales[g].fecha)
          );
        }

        this.ingresosReales = this.presupuesto.ingresos_reales;
        for (var g = 0; g < this.ingresosReales.length; g++) {
          this.ingresosReales[g].fecha = this.formatearFecha(
            new Date(this.ingresosReales[g].fecha)
          );
        }

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

            CategoriaService.consultar().then(res => {
              let categorias = res.data.categorias;
              console.log(categorias);
              let opciones: { label: string; value: any }[] = [];
              categorias.forEach(d => {
                opciones.push(d.nombre);
              });
              this.nombresCategorias = opciones;
              this.categorias = categorias;
              this.formatearMovimientos();
              this.calcularBalancePrevisto();
            });
          })
          .catch(error => {
            this.mostrarNotificacion(error.response.data.error, "negative");
          });
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      });
  }

  guardarPresupuesto(presupuesto) {
    console.log(presupuesto);
    presupuesto["divisa"] = presupuesto.divisa.value;
    this.presupuesto = presupuesto;
  }

  addGasto() {
    this.presupuesto.gastos_previstos.push({
      categoria: "Selecciona una categoría",
      cantidad: 0
    });
  }

  addIngreso() {
    this.presupuesto.ingresos_previstos.push({
      categoria: "Selecciona una categoría",
      cantidad: 0
    });
  }

  eliminarGasto(item) {
    const index = this.presupuesto.gastos_previstos.indexOf(item);
    this.presupuesto.gastos_previstos.splice(index, 1);
  }

  eliminarIngreso(item) {
    const index = this.presupuesto.ingresos_previstos.indexOf(item);
    this.presupuesto.ingresos_previstos.splice(index, 1);
  }

  addGastoReal() {
    this.gastosReales.push({
      categoria: "Selecciona una categoría",
      cantidad: 0,
      fecha: this.formatearFecha(new Date()),
      tipo: "gasto"
    });
  }

  addIngresoReal() {
    this.ingresosReales.push({
      categoria: "Selecciona una categoría",
      cantidad: 0,
      fecha: this.formatearFecha(new Date()),
      tipo: "ingreso"
    });
  }

  eliminarGastoReal(item) {
    const index = this.gastosReales.indexOf(item);
    this.gastosReales.splice(index, 1);
  }

  eliminarIngresoReal(item) {
    const index = this.ingresosReales.indexOf(item);
    this.ingresosReales.splice(index, 1);
  }

  guardarCambios() {
    for (var g = 0; g < this.presupuesto.gastos_previstos.length; g++) {
      this.categorias.forEach(c => {
        if (c.nombre == this.presupuesto.gastos_previstos[g].categoria) {
          this.presupuesto.gastos_previstos[g].categoria = c._id;
        }
      });
    }

    for (var i = 0; i < this.presupuesto.ingresos_previstos.length; i++) {
      this.categorias.forEach(c => {
        if (c.nombre == this.presupuesto.ingresos_previstos[i].categoria) {
          this.presupuesto.ingresos_previstos[i].categoria = c._id;
        }
      });
    }

    this.presupuesto.divisa = this.presupuesto.divisa.value;
    this.presupuesto.gastos_reales = this.gastosReales;
    this.presupuesto.ingresos_reales = this.ingresosReales;

    for (var g = 0; g < this.presupuesto.gastos_reales.length; g++) {
      this.categorias.forEach(c => {
        if (c.nombre == this.presupuesto.gastos_reales[g].categoria) {
          this.presupuesto.gastos_reales[g].categoria = c._id;
        }
      });
    }

    for (var i = 0; i < this.presupuesto.ingresos_reales.length; i++) {
      this.categorias.forEach(c => {
        if (c.nombre == this.presupuesto.ingresos_reales[i].categoria) {
          this.presupuesto.ingresos_reales[i].categoria = c._id;
        }
      });
    }

    PresupuestoService.editarPresupuesto(this.id, this.presupuesto)
      .then(res => {
        console.log(res);
        this.mostrarNotificacion("Presupuesto actualizado");
        this.presupuesto = res.data.presupuesto;
        this.calcularBalancePrevisto();
        this.formatearMovimientos();
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      })
      .finally(() => {
        this.formulario = false;
      });
  }

  formatearMovimientos() {
    for (var g = 0; g < this.presupuesto.gastos_previstos.length; g++) {
      this.categorias.forEach(c => {
        if (c._id == this.presupuesto.gastos_previstos[g].categoria) {
          this.presupuesto.gastos_previstos[g].categoria = c.nombre;
        }
      });
    }

    for (var i = 0; i < this.presupuesto.ingresos_previstos.length; i++) {
      this.categorias.forEach(c => {
        if (c._id == this.presupuesto.ingresos_previstos[i].categoria) {
          this.presupuesto.ingresos_previstos[i].categoria = c.nombre;
        }
      });
    }

    for (var g = 0; g < this.gastosReales.length; g++) {
      this.categorias.forEach(c => {
        if (c._id == this.gastosReales[g].categoria) {
          this.gastosReales[g].categoria = c.nombre;
        }
      });
    }

    for (var i = 0; i < this.ingresosReales.length; i++) {
      this.categorias.forEach(c => {
        if (c._id == this.ingresosReales[i].categoria) {
          this.ingresosReales[i].categoria = c.nombre;
        }
      });
    }
  }

  eliminarPresupuesto() {
    PresupuestoService.eliminarPresupuesto(this.id)
      .then(res => {
        this.$router.push("/presupuestos");
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      });
  }

  calcularBalancePrevisto() {
    let sumaGastos = 0;
    this.presupuesto.gastos_previstos.forEach(g => {
      if (!isNaN(g.cantidad)) {
        sumaGastos += g.cantidad;
      }
    });

    let sumaIngresos = 0;
    this.presupuesto.ingresos_previstos.forEach(i => {
      if (!isNaN(i.cantidad)) {
        sumaGastos += i.cantidad;
      }
    });

    return sumaIngresos - sumaGastos;
  }

  mostrarNotificacion(mensaje: string, tipo = "info") {
    this.$q.notify({
      message: mensaje,
      type: tipo
    });
  }

  formatearFecha(fecha) {
    return (
      fecha.getFullYear() +
      "/" +
      fecha
        .getMonth()
        .toString()
        .padStart(2, 0) +
      "/" +
      fecha
        .getDate()
        .toString()
        .padStart(2, 0)
    );
  }
}
</script>
