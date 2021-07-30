import './vendor/reset.css'
import { PAGE_TYPES } from './constants/pageTypes'
import store from './utils/Store'
import redirector from './utils/redirector'

redirector.redirect(PAGE_TYPES.TODOS_PAGE)

redirector.redirect(PAGE_TYPES.REGISTRATION_PAGE)

redirector.redirect(PAGE_TYPES.SIGNIN_PAGE)