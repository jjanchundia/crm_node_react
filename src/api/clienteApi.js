import { api } from "./api"

export const getClientes = () => api("Clientes")

export const getCliente = id => api(`Clientes/${id}`)

export const saveCliente= cliente =>
  api(`Clientes${cliente.id ? `/${cliente.id}` : ''}`, {
    method: cliente.id ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  })

export const deleteCliente = async id =>
  api(`Clientes/${id}`, {
    method: 'DELETE',
  })
