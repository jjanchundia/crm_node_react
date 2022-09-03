import { api } from "./api"

export const getProyectos = () => api("Proyectos")

export const getProyecto = id => api(`Proyectos/${id}`)

export const saveProyecto= Proyecto =>
  api(`Proyectos${Proyecto.id ? `/${Proyecto.id}` : ''}`, {
    method: Proyecto.id ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Proyecto),
  })

export const deleteProyecto = async id =>
  api(`Proyectos/${id}`, {
    method: 'DELETE',
  })
