<template>
<!-- Componente que tendrá el contenido de un pdf autogenerado a partir de un presupuesto -->
  <section class="pdf-content" slot="pdf-content">
    <section class="pdf-item">
      <div class="row justify-start">
        <q-card class="my-card col-12" flat bordered>
          <q-card-section horizontal class="row">
            <q-card-section class="col-12">
              <div class="row">
                <div class="text-h5 q-mt-sm q-mb-xs col-10">
                  {{ presupuesto.nombre }}
                </div>
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
    </section>
    <!-- Grafico -->
    <section class="pdf-item">
      <div class="text-h4 q-mt-sm q-mb-xs">
        Comparativas
      </div>
      <div class="row justify-center">
        <div class="col-8">
          <grafico-barra
            :chart-data="datosGraficoBalance"
            :options="opcionesGraficoBalance"
            :height="100"
          ></grafico-barra>
        </div>
        <div class="col-8">
          <grafico-component
            :chart-data="datosGraficoGeneral"
            :options="opcionesGraficoGeneral"
            :height="150"
          ></grafico-component>
        </div>
      </div>
    </section>

    <q-separator class="q-mt-lg q-mb-lg" />
    <div class="html2pdf__page-break" />

    <section class="pdf-item">
      <div class="row justify-start">
        <!-- Movimientos previstos -->
        <div class="q-mt-lg q-mr-lg col-12">
          <div class="text-h4 q-mt-sm q-mb-xs">
            Movimientos previstos
          </div>
          <div class="text-h5 q-mt-sm q-mb-xs">
            Gastos
          </div>
          <tabla-movimientos
            :movimientos="presupuesto.gastos_previstos"
            :columns="columns"
            :nombresCategorias="nombresCategorias"
            v-bind:acciones="false"
            :pagination="pagination"
          ></tabla-movimientos>
          <div class="text-h5 q-mt-sm q-mb-xs">
            Ingresos
          </div>
          <tabla-movimientos
            :movimientos="presupuesto.ingresos_previstos"
            :columns="columns"
            :nombresCategorias="nombresCategorias"
            v-bind:acciones="false"
            :pagination="pagination"
          ></tabla-movimientos>
        </div>
      </div>
    </section>

    <div class="html2pdf__page-break" />
    <section class="pdf-item">
      <div class="row justify-start">
        <q-separator class="q-mt-lg q-mb-lg" />
        <!-- Movimientos reales -->
        <div class="q-mt-lg col-12">
          <div class="text-h5 q-mt-sm q-mb-xs">
            Movimientos reales
          </div>
          <div class="text-h5 q-mt-sm q-mb-xs">
            Gastos
          </div>
          <tabla-movimientos
            :movimientos="gastosReales"
            :columns="columnasReales"
            v-bind:fecha="true"
            :nombresCategorias="nombresCategorias"
            v-bind:acciones="false"
            :pagination="pagination"
          ></tabla-movimientos>
          <div class="text-h5 q-mt-sm q-mb-xs">
            Ingresos
          </div>
          <tabla-movimientos
            :movimientos="ingresosReales"
            :columns="columnasReales"
            v-bind:fecha="true"
            :nombresCategorias="nombresCategorias"
            v-bind:acciones="false"
            :pagination="pagination"
          ></tabla-movimientos>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import GraficoComponent from "../components/GraficoComponent.vue";
import GraficoBarra from "../components/GraficoBarra.vue";
import TablaMovimientos from "../components/TablaMovimientos.vue";

@Component({
  components: {
    GraficoComponent,
    GraficoBarra,
    TablaMovimientos
  }
})
export default class ContenidoPdf extends Vue {
  @Prop({ type: Object, required: true }) presupuesto!: object;
  @Prop({ type: Object, required: true }) datosGraficoBalance!: object;
  @Prop({ type: Object, required: true }) datosGraficoGeneral!: object;
  @Prop({ type: Object, required: true }) opcionesGraficoBalance!: object;
  @Prop({ type: Object, required: true }) opcionesGraficoGeneral!: object;
  @Prop({ type: Object, required: true }) divisaPresupuesto!: object;
  @Prop({ type: Array, required: true }) nombresCategorias: any;
  @Prop({ type: Array, required: true }) columns: any;
  @Prop({ type: Array, required: true }) columnasReales: any;
  @Prop({ type: Array, required: true }) gastosReales: any;
  @Prop({ type: Array, required: true }) ingresosReales: any;

  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      }
    };
  }
}
</script>
<style>
.pdf-content{
  padding: 40px 70px;
}

.pdf-item{
  margin-top: 50px;
}
</style>
