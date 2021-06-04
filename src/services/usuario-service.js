
import authHeader from './auth-header';
import {
  axiosInstance
} from "src/boot/axios";

// Servicio para usuarios
class UsuarioService {
  modificarUsuario(datos) {
    let headers = authHeader();
    headers['Content-Type'] = 'multipart/form-data';

    let formData = new FormData();

    for (var key in datos) {
      if (key !== "file")
      formData.append(key, datos[key]);
    }

    formData.append('file', datos.file);
    return axiosInstance
      .post('/usuario/actualizar', formData, {
        headers: headers
      })
      .then((response) => {
        if (response.data.data.usuario) {
          let usuario = JSON.parse(JSON.stringify(response.data.data.usuario));
          usuario['accessToken'] = JSON.parse(localStorage.getItem('user')).accessToken;
          console.log(usuario);
          localStorage.setItem('user', JSON.stringify(usuario));
        }

        return response.data;
      });
  }

  modificarPassword(datos) {
    let headers = authHeader();

    return axiosInstance
      .put('/usuario/password', datos, {
        headers: headers
      })
      .then((response) => {
        if (response.data.data.usuario) {
          let usuario = JSON.parse(JSON.stringify(response.data.data.usuario));
          usuario['accessToken'] = JSON.parse(localStorage.getItem('user')).accessToken;
          localStorage.setItem('user', JSON.stringify(usuario));
        }

        return response.data;
      });
  }

  eliminarCuenta(datos) {
    let headers = authHeader();

    return axiosInstance
      .post('/usuario/eliminar', datos, {
        headers: headers
      })
  }


}

export default new UsuarioService();
