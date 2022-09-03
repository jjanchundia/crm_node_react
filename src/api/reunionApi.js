import { api } from "./api"

export const getReuniones = () => api("Reuniones")

export const getReunion = id => api(`Reuniones/${id}`)

export const saveReunion= reunion =>
  api(`Reuniones${reunion.id ? `/${reunion.id}` : ''}`, {
    method: reunion.id ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reunion),
  })

export const deleteReunion = async id =>
  api(`Reuniones/${id}`, {
    method: 'DELETE',
  })
