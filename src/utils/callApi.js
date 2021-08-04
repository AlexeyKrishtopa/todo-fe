import { ACTION_TYPES } from '../constants/actionTypes'
import { responseLogger } from './responseLogger'
import store from './Store'

const callApi = async (url, options) => {
  let accessToken = null 
  let refreshToken = null
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  
  if(currentUser) {
    accessToken = currentUser.accessToken
    refreshToken = currentUser.refreshToken
  }

  const res = await fetch('http://localhost:3001/api' + url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  let json = await res.json()

  if (json.statusCode === 401) {
    const newTokenPair = await fetch(
      'http://localhost:3001/api/user/refresh-token',
      {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      }
    )

    const newJson = await newTokenPair.json()

    store.dispatch({
      type: ACTION_TYPES.REFRESH_TOKEN,
      payload: newJson.payload.refreshedTokens,
    })

    json = callApi(url, options)
  }

  responseLogger(json)

  return json
}

export default callApi
