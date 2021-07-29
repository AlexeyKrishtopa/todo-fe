// import 'babel-core/register'
// import 'babel-polyfill'
import './vendor/reset.css'
import { PAGE_TYPES } from './constants/pageTypes'

import redirector from './utils/redirector'

redirector.redirect(PAGE_TYPES.TODOS_PAGE)
redirector.redirect(PAGE_TYPES.REGISTRATION_PAGE)
