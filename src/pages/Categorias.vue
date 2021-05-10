<template>
  <div class="q-pa-lg">
    <div class="row justify-center">
      <h4>Categorías</h4>
    </div>
    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="row justify-end">
          <q-btn
            flat
            round
            color="primary"
            icon="add"
            aria-label="Crear categoría"
            @click="
              editando = false;
              formulario = true;
            "
          />
        </div>
        <q-list bordered separator>
          <q-item v-ripple v-for="c in categorias">
            <q-item-section>
              <q-item-label>{{ c.nombre }}</q-item-label>
              <q-item-label caption>{{ c.descripcion }}</q-item-label>
            </q-item-section>
            <q-item-section top side>
              <div class=" q-gutter-xs">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  aria-label="Editar categoría"
                  @click="abrirEditor(c, true)"
                />
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  aria-label="Eliminar categoría"
                   @click="seleccionarCategoriaEliminar(c.nombre)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- Formulario -->
    <q-dialog v-model="formulario" persistent>
      <q-card>
        <q-form @submit="guardarCategoria" class="q-gutter-md q-my-lg">
          <q-card-section class="row items-center">
            <q-input
              class="col-12"
              filled
              type="text"
              v-model="nombre"
              label="Nombre de la categoría"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Campo obligatorio']"
            />
            <q-input
              class="col-12"
              filled
              type="text"
              v-model="descripcion"
              label="Descripción"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" @click="categoriaEliminar = ''" v-close-popup />
            <q-btn
              label="Guardar"
              color="positive"
              type="submit"
              v-close-popup
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Confirmar eliminación -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-form @submit="eliminarCategoria" class="q-gutter-md q-my-lg">
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="negative" text-color="white" />
            <span class="q-ml-sm q-my-lg"
              >¿Seguro que quieres eliminar esta categoría?</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn
              label="Eliminar categoría"
              color="negative"
              type="submit"
              v-close-popup
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { AxiosError } from "app/node_modules/axios";
import { Vue, Component } from "vue-property-decorator";
import CategoriaService from "../services/categoria-service";

@Component
export default class CategoriasComponent extends Vue {
  formulario = false;
  editando = false;
  nombre = "";
  descripcion = "";
  nombreActual = "";
  confirm = false;

  categoriaEliminar = "";
  data() {
    return {
      categorias: []
    };
  }

  created() {
    this.consultar();
  }

  consultar() {
    CategoriaService.consultar()
      .then(res => {
        console.log(res);
        this.categorias = res.data.categorias;
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      });
  }

  guardarCategoria() {
    if (this.editando === true) {
      this.editarCategoria();
      this.editando = false;
    } else {
      this.addCategoria();
    }
  }

  addCategoria() {
    CategoriaService.crearCategoria(this.nombre, this.descripcion)
      .then(res => {
        this.mostrarNotificacion("Categoría creada", "positive");
        this.categorias = res.data.categorias;
        this.nombre = "";
        this.descripcion = "";
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      })
      .finally(() => {
        this.nombre = "";
        this.nombreActual = "";
        this.descripcion = "";
        this.formulario = false;
      });
  }

  editarCategoria() {
    CategoriaService.editarCategoria(
      this.nombreActual,
      this.nombre,
      this.descripcion
    )
      .then(res => {
        this.mostrarNotificacion("Categoría editada", "positive");
        this.categorias = res.data.categorias;
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      })
      .finally(() => {
        this.nombre = "";
        this.nombreActual = "";
        this.descripcion = "";
        this.formlario = false;
      });
  }

  seleccionarCategoriaEliminar(nombre){
      this.categoriaEliminar = nombre;
      this.confirm = true;
  }

  eliminarCategoria() {
    CategoriaService.eliminarCategoria(this.categoriaEliminar)
      .then(res => {
        this.mostrarNotificacion("Categoría eliminada", "positive");
        this.categorias = res.data.categorias;
      })
      .catch(error => {
        this.mostrarNotificacion(error.response.data.error, "negative");
      })
      .finally(() => {
        this.categoriaEliminar = "";
        this.confirm = false;
      });
  }

  abrirEditor(categoria: any) {
    this.editando = true;
    this.nombre = categoria.nombre;
    this.nombreActual = categoria.nombre;
    this.descripcion = categoria.descripcion;
    this.formulario = true;
  }

  mostrarNotificacion(mensaje: string, tipo = "info") {
    this.$q.notify({
      message: mensaje,
      type: tipo
    });
  }
}
</script>
