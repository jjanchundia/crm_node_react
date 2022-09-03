const SERVER_URL = 'http://localhost:4000'

export const api = async (service, options) => {
  await new Promise(resolve => setTimeout(resolve, 0))

  return fetch(`${SERVER_URL}/${service}`, options).then(res => res.json())
}
