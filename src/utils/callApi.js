import { ACTION_TYPES } from '../constants/actionTypes'
import { responseLogger } from './responseLogger'
import store from './Store'

const callApi = async (url, options) => {
  const res = await fetch('http://localhost:3000/api' + url, options)

  let json = await res.json()

  if (+json.statusCode === 401) {
    const newTokenPair = await fetch(
      'http://localhost:3000/api/users/refresh-token',
      {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: store.state.currentUser.refreshToken,
        }),
      }
    )

    const newJson = await newTokenPair.json()

    store.dispatch({
      type: ACTION_TYPES.REFRESH_TOKEN,
      payload: newJson.payload.refreshedTokens,
    })

    const newRes = await fetch('http://localhost:3000/api' + url, {
      ...options,
      headers: {
        Authorization: `Bearer ${store.state.currentUser.accessToken}`,
      },
    })
    json = await newRes.json()
  }

  responseLogger(json)

  return json
}

export default callApi
