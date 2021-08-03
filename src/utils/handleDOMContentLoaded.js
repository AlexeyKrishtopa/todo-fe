import { ACTION_TYPES } from '../constants/actionTypes'
import store from './Store'
import callApi from './callApi'
import redirector from './redirector'
import { PAGE_TYPES } from '../constants/pageTypes'

export async function handleDOMContentLoaded() {
  if (document.querySelector('.todos__list')) {
    const res = await callApi('/todos', {
      method: 'GET',
    })
    const oldTodos = res.payload.list
    store.dispatch({
      type: ACTION_TYPES.LOAD_OLD_TODOS,
      payload: oldTodos,
    })
    if (location.hash === '' && location.hash === '#') {
      store.dispatch({ type: ACTION_TYPES.SHOW_ALL_TODOS, payload: {} })
    }
    if (location.hash === '#/active') {
      store.dispatch({
        type: ACTION_TYPES.SHOW_ACTIVE_TODOS,
        payload: {},
      })
    }
    if (location.hash === '#/completed') {
      store.dispatch({
        type: ACTION_TYPES.SHOW_COMPLETED_TODOS,
        payload: {},
      })
    }
  }
}

export function handleHistory() {
  window.addEventListener('popstate', () => {
    console.log(location.hash)
    if (location.hash === '#/signup') {
      redirector.redirect(PAGE_TYPES.REGISTRATION_PAGE)
    } else {
      handleDOMContentLoaded()
    }
  })
}
