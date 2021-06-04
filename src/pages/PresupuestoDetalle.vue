<template>
  <!-- DETALLE Y GESTIÓN DE UN PRESUPUESTO -->
  <div class="q-pa-lg">
    <!-- Para generar pdf -->
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1080"
      filename="Informe"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="760px"
      ref="html2Pdf"
    >
      <contenido-pdf
        :presupuesto="presupuesto"
        :datosGraficoGeneral="datosGraficoGeneral"
        :datosGraficoBalance="datosGraficoBalance"
        :opcionesGraficoBalance="opcionesGraficoBalance"
        :opcionesGraficoGeneral="opcionesGraficoGeneral"
        :nombresCategorias="nombresCategorias"
        :columns="columnsPdf"
        :columnasReales="columnasRealesPdf"
        :gastosReales="gastosReales"
        :ingresosReales="ingresosReales"
        :divisaPresupuesto="divisaPresupuesto"
        slot="pdf-content"
      ></contenido-pdf>
    </vue-html2pdf>

    <div class="row justify-start">
      <!-- Nombre, descripción, objetivo y fechas -->
      <div class="col-12 q-mb-md">
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
            icon="download"
            @click="generarInforme"
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

      <!-- Grafico -->
      <div class="col-12 col-md-8 grafico-wrapper">
        <q-card>
          <q-tabs
            v-model="tabGraficos"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="analisis-balance" label="Balance" />
            <q-tab name="analisis-gastos-ingresos" label="Gastos / Ingresos" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tabGraficos" animated>
            <q-tab-panel name="analisis-balance">
              <div class="desktop-only">
                <grafico-barra
                  :chart-data="datosGraficoBalance"
                  :options="opcionesGraficoBalance"
                  :height="150"
                ></grafico-barra>
              </div>
              <div class="mobile-only">
                <grafico-barra
                  :chart-data="datosGraficoBalance"
                  :options="opcionesGraficoBalance"
                  :height="300"
                ></grafico-barra>
              </div>
            </q-tab-panel>

            <q-tab-panel name="analisis-gastos-ingresos">
              <div class="desktop-only">
                <grafico-component
                  :chart-data="datosGraficoGeneral"
                  :options="opcionesGraficoGeneral"
                  :height="150"
                ></grafico-component>
              </div>
              <div class="mobile-only">
                <grafico-component
                  :chart-data="datosGraficoGeneral"
                  :options="opcionesGraficoGeneral"
                  :height="300"
                ></grafico-component>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
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
              <tabla-movimientos
                :movimientos="presupuesto.gastos_previstos"
                :columns="columns"
                :nombresCategorias="nombresCategorias"
                v-bind:acciones="true"
                :pagination="pagination"
                @calcularBalance="calcularBalancePrevisto()"
              ></tabla-movimientos>
            </q-tab-panel>

            <q-tab-panel name="ingresos">
              <tabla-movimientos
                :movimientos="presupuesto.ingresos_previstos"
                :columns="columns"
                :nombresCategorias="nombresCategorias"
                v-bind:acciones="true"
                :pagination="pagination"
                @calcularBalance="calcularBalancePrevisto()"
              ></tabla-movimientos>
            </q-tab-panel>
          </q-tab-panels>

          <q-card-section>
            <div class="text-h6 q-mt-sm q-mb-xs">
              Balance: {{ balancePrevisto }}
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
              <tabla-movimientos
                :movimientos="gastosReales"
                :columns="columnasReales"
                v-bind:fecha="true"
                :nombresCategorias="nombresCategorias"
                v-bind:acciones="true"
                :pagination="pagination"
                @calcularBalance="calcularBalanceReal()"
              ></tabla-movimientos>
            </q-tab-panel>

            <q-tab-panel name="ingresos">
              <tabla-movimientos
                :movimientos="ingresosReales"
                :columns="columnasReales"
                v-bind:fecha="true"
                :nombresCategorias="nombresCategorias"
                :pagination="pagination"
                v-bind:acciones="true"
                @calcularBalance="calcularBalanceReal()"
              ></tabla-movimientos>
            </q-tab-panel>
          </q-tab-panels>

          <q-card-section>
            <div class="text-h6 q-mt-sm q-mb-xs">
              Balance: {{ balanceReal }}
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
import GraficoComponent from "../components/GraficoComponent.vue";
import GraficoBarra from "../components/GraficoBarra.vue";
import TablaMovimientos from "../components/TablaMovimientos.vue";
import ContenidoPdf from "../components/ContenidoPdf.vue";
import VueHtml2pdf from "vue-html2pdf";

@Component({
  components: {
    PresupuestoForm,
    GraficoComponent,
    GraficoBarra,
    TablaMovimientos,
    ContenidoPdf,
    VueHtml2pdf
  }
})
export default class PresupuestoDetalleComponent extends Vue {
  data() {
    return {
      presupuesto: {
        gastos_previstos: []
      },
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
      columnsPdf: [
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
        }
      ],
      columnasRealesPdf: [
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
        }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 5
      },
      gastosReales: [],
      ingresosReales: [],
      datosGraficoGeneral: {},
      datosGraficoBalance: {},
      opcionesGraficoGeneral: {
        spanGaps: true,
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: 0
              }
            }
          ]
        }
      },
      opcionesGraficoBalance: {
        scales: {
          xAxes: [
            {
              ticks: {
                suggestedMin: 0
              }
            }
          ]
        }
      }
    };
  }

  formulario = false;
  eliminar = false;
  id = this.$route.params.id;
  tab = "gastos";
  tabReales = "gastos";
  tabGraficos = "analisis-balance";

  created() {
    this.consultarPresupuesto();
  }

  // Consulta un presupuesto por el id obtenido de la ruta y genera la interfaz a partir de los datos obtenidos
  consultarPresupuesto() {
    PresupuestoService.consultarPorId(this.$route.params.id)
      .then(res => {
        this.presupuesto = res.data.presupuestos;
        this.divisaPresupuesto = JSON.parse(
          JSON.stringify(res.data.presupuestos.divisa)
        );
        this.presupuesto.divisa = {
          value: this.presupuesto.divisa.codigo,
          label:
            this.presupuesto.divisa.simbolo +
            " (" +
            this.presupuesto.divisa.nombre +
            ")"
        };

        let fechaInicio = new Date(this.presupuesto.fecha_inicio);
        this.presupuesto.fecha_inicio = this.formatearFecha(fechaInicio);

        let fechaFin = new Date(this.presupuesto.fecha_fin);
        this.presupuesto.fecha_fin = this.formatearFecha(fechaFin);

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
                value: d.codigo,
                simbolo: d.simbolo
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
              this.calcularBalanceReal();
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

  // Recibe los datos del formulario para editar presupuesto y los asigna en las variables
  guardarPresupuesto(presupuesto) {
    this.presupuesto = presupuesto;
    this.formulario = false;
    this.divisas.forEach(d => {
      console.log(d);
      if (d.value === this.presupuesto.divisa) {
        this.divisaPresupuesto = {
          simbolo: d.simbolo
        };
      }
    });
  }

  // Envía petición al servidor para guardar los cambios realizados
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

    this.presupuesto.gastos_reales = this.gastosReales;
    this.presupuesto.ingresos_reales = this.ingresosReales;
    this.presupuesto.divisa = this.presupuesto.divisa;
    if (typeof this.presupuesto.divisa.value !== "undefined") {
      this.presupuesto.divisa = this.presupuesto.divisa.value;
    }
    let fechaInicio = new Date(this.presupuesto.fecha_inicio);
    this.presupuesto.fecha_inicio = this.formatearFecha(fechaInicio);

    let fechaFin = new Date(this.presupuesto.fecha_fin);
    this.presupuesto.fecha_fin = this.formatearFecha(fechaFin);

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
        this.consultarPresupuesto();
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      })
      .finally(() => {
        this.formulario = false;
      });
  }

  // Formatea los datos de los movimientos para presentarlos en las tablas
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

  // Envía petición al servidor para borrar el presupuesto
  eliminarPresupuesto() {
    PresupuestoService.eliminarPresupuesto(this.id)
      .then(res => {
        this.$router.push("/presupuestos");
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      });
  }

  // Calcula el balance de los movimientos previstos
  calcularBalancePrevisto() {
    let valor = 0;

    this.presupuesto.ingresos_previstos.forEach(function(i) {
      if (!isNaN(i.cantidad)) {
        valor += parseFloat(i.cantidad);
      }
    });

    this.presupuesto.gastos_previstos.forEach(function(g) {
      if (!isNaN(g.cantidad)) {
        valor -= parseFloat(g.cantidad);
      }
    });

    this.balancePrevisto = valor;
    this.actualizarGraficoBalance();
  }

  // Calcula el balance de los movimientos reales
  calcularBalanceReal() {
    console.log(this.ingresosReales);
    console.log(this.gastosReales);
    let valor = 0;

    this.ingresosReales.forEach(function(i) {
      if (!isNaN(i.cantidad)) {
        valor += parseFloat(i.cantidad);
      }
    });

    this.gastosReales.forEach(function(g) {
      if (!isNaN(g.cantidad)) {
        valor -= parseFloat(g.cantidad);
      }
    });

    this.balanceReal = valor;
    this.actualizarGrafico();
    this.actualizarGraficoBalance();
  }

  //Muestra un toast
  mostrarNotificacion(mensaje: string, tipo = "info") {
    this.$q.notify({
      message: mensaje,
      type: tipo
    });
  }

  // Cambia el formato de la fecha
  formatearFecha(fecha) {
    let anualidad = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDate();
    return (
      anualidad +
      "/" +
      mes.toString().padStart(2, 0) +
      "/" +
      dia.toString().padStart(2, 0)
    );
  }

  // Actualiza el componente gráfico lineal
  actualizarGrafico() {
    let datosGrafico = {
      labels: [],
      datasets: []
    };

    let arrayConFechas = this.gastosReales.concat(this.ingresosReales);
    arrayConFechas.sort((a, b) => {
      if (a.fecha > b.fecha) {
        return 1;
      } else if (a.fecha < b.fecha) {
        return -1;
      }
      return 0;
    });

    let datasetGastos = {
      label: "Gastos totales",
      borderColor: "#f87979",
      data: [],
      fill: false
    };

    let datasetIngresos = {
      label: "Ingresos totales",
      borderColor: "#44b6eb",
      data: [],
      fill: false
    };

    let meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ];

    let fechas = [];
    let valorGastos = 0;
    let valorIngresos = 0;
    //Se iteran todos los datos para añadir
    for (var i = 0; i < arrayConFechas.length; i++) {
      if (arrayConFechas[i].tipo === "gasto") {
        //Añadimos a gastos
        if (!isNaN(arrayConFechas[i].cantidad)) {
          valorGastos += arrayConFechas[i].cantidad;
        }

        datasetGastos.data.push(JSON.parse(JSON.stringify(valorGastos)));

        // Si la fecha del siguiente item es mayor que la actual, hay que añadir un valor nulo a ingresos
        if (
          i < arrayConFechas.length - 1 &&
          arrayConFechas[i + 1].fecha > arrayConFechas[i].fecha
        ) {
          datasetIngresos.data.push(null);
        }
      } else if (arrayConFechas[i].tipo === "ingreso") {
        //Añadimos a ingresos
        if (!isNaN(arrayConFechas[i].cantidad)) {
          valorIngresos += arrayConFechas[i].cantidad;
        }

        datasetIngresos.data.push(JSON.parse(JSON.stringify(valorIngresos)));

        // Si la fecha del siguiente item es mayor que la actual, hay que añadir un valor nulo a gastos
        if (
          i < arrayConFechas.length - 1 &&
          arrayConFechas[i + 1].fecha > arrayConFechas[i].fecha
        ) {
          datasetGastos.data.push(null);
        }
      }

      // Añadimos fecha
      if (
        fechas.length == 0 ||
        (fechas.length > 0 &&
          fechas[fechas.length - 1] !== arrayConFechas[i].fecha)
      ) {
        fechas.push(arrayConFechas[i].fecha);
      }
    }

    // Añadimos los datasets al gráfico de gastos / ingresos
    datosGrafico.datasets.push(datasetGastos);
    datosGrafico.datasets.push(datasetIngresos);

    //Sacamos labels de las fechas
    fechas.forEach(f => {
      let fecha = new Date(f);
      let label =
        fecha.getDate() + "-" + meses[fecha.getMonth()] + fecha.getFullYear();
      datosGrafico.labels.push(label);
    });

    this.datosGraficoGeneral = datosGrafico;
  }

  // Actualiza el gráfico de los balances
  actualizarGraficoBalance() {
    let datosGraficoBalance = {
      labels: ["Balance"],
      datasets: [
        {
          label: "Previsto",
          backgroundColor: "#44b6eb",
          data: [this.balancePrevisto]
        },
        {
          label: "Real",
          backgroundColor: "#f87979",
          data: [this.balanceReal]
        }
      ]
    };

    this.datosGraficoBalance = datosGraficoBalance;
  }

  //Genera un pdf del presupuesto para descargar
  generarInforme() {
    this.$refs.html2Pdf.generatePdf();
  }
}
</script>
