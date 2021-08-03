import { ACTION_TYPES } from '../../constants/actionTypes'
import Component from '../../utils/Component'
import store from '../../utils/Store'
import { checkAllSVG } from '../../constants/checkAllSVG'
import { Button } from '../Button'
import callApi from '../../utils/callApi'

export class Todos extends Component {
  constructor(options) {
    super(options)
  }

  render() {
    const todosBodyElement = document.createElement('div')
    todosBodyElement.classList.add('todos__body')

    const todosListElement = document.createElement('ul')
    todosListElement.classList.add('todos__list')

    const todosCountElement = document.createElement('div')
    todosCountElement.classList.add('todos__count')
    todosCountElement.innerText = `${store.state.todos.reduce((acc, todo) => {
      if (!todo.completed) {
        acc += 1
      }

      return acc
    }, 0)} item left`

    const todosCheckAllElement = document.createElement('button')
    todosCheckAllElement.classList.add('todos__check-all')
    todosCheckAllElement.innerHTML = checkAllSVG
    todosCheckAllElement.addEventListener('click', async (event) => {
      event.preventDefault()

      await store.dispatch({
        type: ACTION_TYPES.TOGGLE_CHECK_ALL,
        payload: {},
      })
      //api
      store.state.todos.forEach(async (todo) => {
        await callApi(`/todos/${todo._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            description: todo.description,
            completed: todo.completed,
            sort: todo.sort,
          }),
        })
      })
    })

    const todosFormElement = document.createElement('form')
    todosFormElement.classList.add('todos__form')

    const todosInputElement = document.createElement('input')
    todosInputElement.classList.add('todos__input')
    todosInputElement.placeholder = 'What needs to be done?'
    todosInputElement.addEventListener('keypress', async (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()

        if (todosInputElement.value) {
          const res = await callApi('/todos', {
            method: 'POST',
            body: JSON.stringify({
              description: todosInputElement.value,
              completed: false,
              sort: store.state.todos.length
                ? store.state.todos[store.state.todos.length - 1].sort + 1
                : 1,
            }),
          })

          const newTodo = res.payload.dto

          store.dispatch({
            type: ACTION_TYPES.ADD_NEW_TODO,
            payload: newTodo,
          })

          todosInputElement.value = ''
        }
      }
    })

    todosFormElement.append(todosCheckAllElement)
    todosFormElement.append(todosInputElement)

    todosBodyElement.append(todosFormElement)
    todosBodyElement.append(todosListElement)

    const todosFooterElement = document.createElement('div')
    todosFooterElement.classList.add('todos__footer')

    const todosOptionsContainerElement = document.createElement('div')
    todosOptionsContainerElement.classList.add('todos__options-container')

    const allTodosComponent = new Button({
      label: 'All',
      className: 'todos__todo-all',
      href: '#',
      onClick: () => {
        store.dispatch({ type: ACTION_TYPES.SHOW_ALL_TODOS, payload: {} })
      },
    })
    const completedTodosComponent = new Button({
      label: 'Completed',
      className: 'todos__todo-completed',
      href: '#/completed',
      onClick: () => {
        store.dispatch({ type: ACTION_TYPES.SHOW_COMPLETED_TODOS, payload: {} })
      },
    })
    const activeTodosComponent = new Button({
      label: 'Active',
      className: 'todos__todo-active',
      href: '#/active',
      onClick: () => {
        store.dispatch({ type: ACTION_TYPES.SHOW_ACTIVE_TODOS, payload: {} })
      },
    })
    const clreaCompletedTodosComponent = new Button({
      label: 'Clear compelted',
      className: 'todos__clear-completed',
      onClick: async () => {
        store.state.todos.forEach(async (todo) => {
          if (todo.completed) {
            await callApi(`/todos/${todo._id}`, {
              method: 'DELETE',
            })
          }
        })

        store.dispatch({ type: ACTION_TYPES.CLEAR_COMPLETED, payload: {} })   
      },
    })

    todosOptionsContainerElement.append(allTodosComponent.render())
    todosOptionsContainerElement.append(completedTodosComponent.render())
    todosOptionsContainerElement.append(activeTodosComponent.render())

    todosBodyElement.append(todosFooterElement)
    todosFooterElement.append(todosCountElement)
    todosFooterElement.append(todosOptionsContainerElement)
    todosFooterElement.append(clreaCompletedTodosComponent.render())

    if (!store.state.todos.length) {
      todosCheckAllElement.classList.add('hidden')
      todosFooterElement.classList.add('hidden')
    } else {
      todosCheckAllElement.classList.remove('hidden')
      todosFooterElement.classList.remove('hidden')
    }

    return todosBodyElement
  }
}
