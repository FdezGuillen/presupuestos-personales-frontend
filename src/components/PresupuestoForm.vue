<template>
  <q-card>
        <q-form @submit="guardarPresupuesto" class="q-gutter-md q-pa-md">
          <q-card-section>
            <div class="text-h6">Crear presupuesto</div>
          </q-card-section>
          <q-card-section class="row items-center">
            <q-input
              class="col-12 q-pb-md"
              filled
              type="text"
              v-model="presupuesto.nombre"
              label="Nombre del presupuesto"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
            />

            <q-input
              class="col-12 q-pb-md"
              filled
              type="text"
              v-model="presupuesto.descripcion"
              label="Descripción"
            />

            <q-input
              class="col-12 q-pb-md"
              filled
              type="number"
              v-model="presupuesto.objetivo"
              label="¿Cuánto quieres ahorrar?"
            />
            <q-input
              class="col-12 col-md-6 q-pb-md q-pr-md"
              filled
              label="Fecha de inicio"
              v-model="presupuesto.fecha_inicio"
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
                    <q-date v-model="presupuesto.fecha_inicio">
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

            <q-input
              class="col-12 col-md-6 q-pb-md"
              filled
              v-model="presupuesto.fecha_fin"
              label="Fecha final"
              mask="date"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="presupuesto.fecha_fin">
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

            <q-select
              class="col-12 q-pb-md"
              filled
              v-model="presupuesto.divisa"
              :options="divisas"
              option-value="value"
              option-label="label"
              label="Divisa"
              :rules="[val => val || 'Campo obligatorio']"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancelar"
              color="primary"
              @click="cerrar"
            />
            <q-btn
              label="Guardar"
              color="positive"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class PresupuestoForm extends Vue {
  @Prop({ type: Object, required: true }) presupuesto!: object;
  @Prop({ type: Array, required: true }) divisas!: [];

  guardarPresupuesto(){
      this.$emit('guardarPresupuesto', this.presupuesto);
  }

  cerrar(){
      this.$emit("cerrar");
  }
}
</script>