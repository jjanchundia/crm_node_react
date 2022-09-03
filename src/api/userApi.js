/* eslint-disable prettier/prettier */

import axios from "axios"
import { api } from "./api"

export const getUsers = () => api("users")
export const getUser = id => api(`users/${id}`)

export const getLoginUser =(usuario, clave) => api(`users/${usuario}/${clave}`)

export const saveUser = usuario =>
  api(`users${usuario.idusuario ? `/${usuario.idusuario}` : ''}`, {
    method: usuario.id ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  })

// export const saveUser = async (usuario) =>{
//   try {
//         await axios.post("users", usuario);
//       } catch (error) {
//         console.log(error);
//       }
//   }

  // const grabar = async () => {
  //   try {
  //     await axios.post(url + 'aliments-categories', categoria);
  //     setConsulta(true);
  //     alertas.AlertaMensajeExito("Categoria-Alimento ingresado correctamente");
  //     setModal(!modal);
  //   } catch (error) {
  //     alertas.AlertaFormulario(error.response.data);
  //   }
  // };

export const deleteUser = async id =>
  api(`users/${id}`, {
    method: 'DELETE',
  })
