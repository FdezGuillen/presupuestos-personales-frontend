
import { axiosInstance} from "src/boot/axios";
import { AxiosError, AxiosResponse } from "app/node_modules/axios";

// Servicio de autenticación
class AuthService {
  login(user) {
    return axiosInstance
      .post('/login', {
        correo_electronico: user.correo_electronico,
        password: user.password
      })
      .then((response) => {
        if (response.data.usuario.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data.usuario));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
    location.href="/login";
  }

  registrar(usuario) {
    return axiosInstance.post("/usuario", usuario);
  }

  recuperarCuenta(email){
    return axiosInstance.post("/recuperar", {
        correo_electronico:email
    });
  }

  resetearPassword(cuerpo){
      return axiosInstance.post("/recuperar/reset", cuerpo);
  }
  
}

export default new AuthService();