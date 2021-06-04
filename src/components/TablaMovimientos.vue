<template>
  <!-- TABLA PARA GESTIONAR MOVIMIENTOS DE UN TIPO DE UN PRESUPUESTO -->
  <div>
    <div class="row justify-end" v-if="acciones">
      <q-btn
        flat
        round
        color="primary"
        icon="add"
        aria-label="Añadir movimiento"
        @click="addMovimiento"
      />
    </div>
    <q-table
      :data="movimientos"
      :columns="columns"
      row-key="name"
      binary-state-sort
      :pagination.sync="pagination"
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
                @change="calcularBalance"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="fecha" :props="props" v-if="fecha">
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
                @change="calcularBalance"
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
          <q-td key="acciones" :props="props" v-if="acciones">
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              aria-label="Eliminar movimiento"
              @click="eliminarMovimiento(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TablaMovimientos extends Vue {
  @Prop({ type: Array, required: true }) movimientos: any;
  @Prop({ type: Array, required: true }) nombresCategorias: any;
  @Prop({ type: Array, required: true }) columns: any;
  @Prop({ type: Boolean, default: false }) fecha;
  @Prop({ type: Boolean, default: false }) acciones;
  @Prop({ type: Object, required: true }) pagination;

  // Añade movimiento
  addMovimiento() {
    let mov = {
      categoria: "Selecciona una categoría",
      cantidad: 0
    };

    let fecha = new Date();
    let mes = fecha.getMonth() + 1;
    let mesString = mes.toString().padStart(2, "0");
    let dia = fecha.getDate();
    let diaString = dia.toString().padStart(2, "0");
    if (this.fecha == true) {
      mov["fecha"] = fecha.getFullYear() + "/" + mesString + "/" + diaString;
    }
    this.movimientos.push(mov);
  }

  // Elimina movimiento
  eliminarMovimiento(item) {
    const index = this.movimientos.indexOf(item);
    this.movimientos.splice(index, 1);
    this.calcularBalance();
  }

  // Emite evento para que el padre actualice los datos
  calcularBalance() {
    this.$emit("calcularBalance");
  }
}
</script>
