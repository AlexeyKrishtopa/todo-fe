import './vendor/reset.css'
import { PAGE_TYPES } from './constants/pageTypes'
import store from './utils/Store'
import redirector from './utils/redirector'
import { ACTION_TYPES } from './constants/actionTypes'

const currentUser = JSON.parse(localStorage.getItem('currentUser'))

if (currentUser) {
  store.dispatch({
    type: ACTION_TYPES.REFRESH_TOKEN,
    payload: currentUser,
  })
  redirector.redirect(PAGE_TYPES.TODOS_PAGE)
} else {
  redirector.redirect(PAGE_TYPES.SIGNIN_PAGE)
}
