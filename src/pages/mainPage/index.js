import '../../vendor/reset.css'
import './style.scss'

import Todos from '../../components/Todos'

const root = document.querySelector('.root')

const todos = new Todos()

root.append(todos.render())
