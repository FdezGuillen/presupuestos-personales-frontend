
import authHeader from './auth-header';
import {
  axiosInstance
} from "src/boot/axios";

// Servicio para categorías
class CategoriaService {
  consultar() {
    let usuario = JSON.parse(localStorage.getItem('user')).username;
    let headers = authHeader();
    return axiosInstance
      .get('/categorias?username=' + usuario , {
        headers: headers
      })
      .then((response) => {
        return response.data;
      });
  }

  crearCategoria(nombre, descripcion){
    let usuario = JSON.parse(localStorage.getItem('user')).username;
    let headers = authHeader();
    let objeto = {
        nombre: nombre,
        descripcion: descripcion,
        username: usuario
    }
    return axiosInstance
      .post('/categorias', objeto, {
        headers: headers
      })
      .then((response) => {
        return response.data;
      });
  }

  editarCategoria(nombreActual, nombre, descripcion){
    let usuario = JSON.parse(localStorage.getItem('user')).username;
    let headers = authHeader();
    let objeto = {
        nombre: nombreActual,
        nombre_nuevo: nombre,
        descripcion_nueva: descripcion,
        username: usuario
    }
    return axiosInstance
      .put('/categorias', objeto, {
        headers: headers
      })
      .then((response) => {
        return response.data;
      });
  }

  eliminarCategoria(nombre){
    let usuario = JSON.parse(localStorage.getItem('user')).username;
    let headers = authHeader();
    return axiosInstance
      .delete('/categorias?username=' + usuario + "&nombre=" + nombre, {
        headers: headers
      })
      .then((response) => {
        return response.data;
      });
  }

}

export default new CategoriaService();
