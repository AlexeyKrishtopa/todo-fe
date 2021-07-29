import { responseLogger } from './responseLogger'

const callApi = async (url, options) => {
  const res = await fetch('http://localhost:3000/api' + url, options)
  const json = await res.json()

  responseLogger(json)

  return json
}

export default callApi
