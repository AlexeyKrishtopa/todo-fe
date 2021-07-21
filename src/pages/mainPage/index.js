/* eslint-disable no-undef */
import '../../vendor/reset.css'
import './style.scss'
import callApi from '../../utils/callApi'

import Todos from '../../components/Todos'

const root = document.querySelector('.root')

const todos = new Todos()

root.append(todos.render())
