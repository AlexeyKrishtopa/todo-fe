/* eslint-disable no-undef */
import '../../vendor/reset.css'
import './style.scss'

import Todos from '../../components/Todos'

const root = document.querySelector('.root')

const todos = new Todos()

root.append(todos.render())

// window.onpopstate = function (event) {
//   alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
// }

// history.pushState({ page: 1 }, 'title 1', '#/active')
// history.pushState({ page: 2 }, 'title 2', '#/completed')
// history.pushState({ page: 3 }, 'title 3', '#')
// history.go(1) // alerts "location: http://example.com/example.html?page=3, state: {"page":3}"
