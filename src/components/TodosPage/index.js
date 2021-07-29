import { Todos } from '../Todos'
import Component from '../../utils/Component'
import { ACTION_TYPES } from '../../constants/actionTypes'
import callApi from '../../utils/callApi'
import './style.scss'
import store from '../../utils/Store'

export class TodosPage extends Component {
  constructor(options) {
    super(options)
  }

  render() {
    const todosBodyComponent = new Todos()

    const todosContainerElement = document.createElement('div')
    todosContainerElement.classList.add('todos__container')

    const todosHeaderElement = document.createElement('div')
    todosHeaderElement.classList.add('todos__header')
    const todosHeaderTitleElement = document.createElement('h1')
    todosHeaderTitleElement.innerText = 'todos'
    todosHeaderElement.append(todosHeaderTitleElement)

    todosContainerElement.append(todosHeaderElement)
    todosContainerElement.append(todosBodyComponent.render())

    document.addEventListener('DOMContentLoaded', async () => {
      const res = await callApi('/todos', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${store.state.currentUser.accessToken}`,
        },
      })
      const oldTodos = res.payload.list
      store.dispatch({ type: ACTION_TYPES.LOAD_OLD_TODOS, payload: oldTodos })
      if (location.hash === '' && location.hash === '#') {
        store.dispatch({ type: ACTION_TYPES.SHOW_ALL_TODOS, payload: {} })
      }
      if (location.hash === '#/active') {
        store.dispatch({ type: ACTION_TYPES.SHOW_ACTIVE_TODOS, payload: {} })
      }
      if (location.hash === '#/completed') {
        store.dispatch({ type: ACTION_TYPES.SHOW_COMPLETED_TODOS, payload: {} })
      }
    })

    return todosContainerElement
  }
}
