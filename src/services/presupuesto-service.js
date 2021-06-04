
import authHeader from './auth-header';
import {
  axiosInstance
} from "src/boot/axios";

// Servicio para presupuestos y movimientos
class PresupuestoService {
  consultar() {
    let usuario = JSON.parse(localStorage.getItem('user')).username;
    let headers = authHeader();
    return axiosInstance
      .get('/presupuestos?username=' + usuario , {
        headers: headers
      })
      .then((response) => {
        return response.data;
      });
  }

  consultarPorId(id){
    let usuario = JSON.parse(localStorage.getItem('user')).username;
    let headers = authHeader();
    return axiosInstance
      .get('/presupuestos?username=' + usuario + '&id=' + id, {
        headers: headers
      })
      .then((response) => {
        return response.data;
      });

  }

  consultarDivisas() {
    return axiosInstance
      .get('/presupuestos/divisas', {})
      .then((response) => {
        return response.data;
      });
  }


  crearPresupuesto(datos){
    let usuario = JSON.parse(localStorage.getItem('user')).username;
    let headers = authHeader();
    let objeto = datos;
    objeto["username"] = usuario;
    return axiosInstance
      .post('/presupuestos', objeto, {
        headers: headers
      })
      .then((response) => {
        return response.data;
      });
  }

  editarPresupuesto(id, datos){
    let usuario = JSON.parse(localStorage.getItem('user')).username;
    let headers = authHeader();
    let objeto = datos;
    objeto["username"] = usuario;
    objeto["id"] = id;
    return axiosInstance
      .put('/presupuestos', objeto, {
        headers: headers
      })
      .then((response) => {
        return response.data;
      });
  }

  eliminarPresupuesto(id){
    let usuario = JSON.parse(localStorage.getItem('user')).username;
    let headers = authHeader();
    return axiosInstance
      .delete('/presupuestos?username=' + usuario + "&id=" + id, {
        headers: headers
      })
      .then((response) => {
        return response.data;
      });
  }

  crearMovimiento(datos){
    let usuario = JSON.parse(localStorage.getItem('user'))._id;
    let headers = authHeader();
    let objeto = datos;
    objeto["usuario"] = usuario;
    return axiosInstance
      .post('/presupuestos/movimiento', objeto, {
        headers: headers
      })
      .then((response) => {
        return response.data;
      });
  }

}

export default new PresupuestoService();
