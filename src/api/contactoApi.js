import { api } from "./api"

export const getContactos = () => api("Contactos")

export const getContacto = id => api(`Contactos/${id}`)

export const saveContacto= Contacto =>
  api(`Contactos${Contacto.id ? `/${Contacto.id}` : ''}`, {
    method: Contacto.id ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Contacto),
  })

export const deleteContacto = async id =>
  api(`Contactos/${id}`, {
    method: 'DELETE',
  })
