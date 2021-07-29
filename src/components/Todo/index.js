import Component from '../../utils/Component'
import store from '../../utils/Store'
import { ACTION_TYPES } from '../../constants/actionTypes'
import callApi from '../../utils/callApi'

export class Todo extends Component {
  constructor(options) {
    super(options)
    this._id = options._id ?? null
    this.description = options.description ?? ''
    this.completed = options.completed ?? false
  }

  render() {
    const todoElement = document.createElement('li')
    todoElement.classList.add('todos__todo')
    todoElement.id = this._id

    const todoCheckboxElement = document.createElement('input')
    todoCheckboxElement.classList.add('todos__todo-checkbox')
    todoCheckboxElement.type = 'checkbox'
    todoCheckboxElement.checked = this.completed
    todoCheckboxElement.addEventListener('click', async (event) => {
      event.preventDefault()
      const currentTodoElement = event.target.closest('.todos__todo')

      const oldTodo = store.state.todos.find(
        (todo) => todo._id === currentTodoElement.id
      )

      const res = await callApi(`/todos/${currentTodoElement.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${store.state.currentUser.accessToken}`,
        },
        body: JSON.stringify({
          description: oldTodo.description,
          completed: !oldTodo.completed,
          sort: oldTodo.sort,
        }),
      })

      const updatedTodo = res.payload.dto

      store.dispatch({
        type: ACTION_TYPES.CHECK_TODO,
        payload: updatedTodo,
      })
    })

    const todoDescriptionElement = document.createElement('div')
    todoDescriptionElement.classList.add('todos__todo-description')
    todoDescriptionElement.innerText = this.description

    const todoDeleteButtonElement = document.createElement('button')
    todoDeleteButtonElement.classList.add('todos__todo-delete')
    todoDeleteButtonElement.innerText = '×'
    todoDeleteButtonElement.addEventListener('click', async (event) => {
      event.preventDefault()

      const res = await callApi(`/todos/${todoElement.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${store.state.currentUser.accessToken}`,
        },
      })

      const deletedTodo = res.payload.dto

      store.dispatch({
        type: ACTION_TYPES.REMOVE_TODO,
        payload: deletedTodo,
      })
    })

    todoElement.append(todoCheckboxElement)
    todoElement.append(todoDescriptionElement)
    todoElement.append(todoDeleteButtonElement)

    let timerId = null
    let clicksCount = 0

    todoElement.addEventListener('click', (event) => {
      clicksCount += 1

      const currentTodoElement = event.target.closest('.todos__todo')
      const currentTodoCheckboxElement = currentTodoElement.querySelector(
        '.todos__todo-checkbox'
      )
      const currentTodoDescriptionElement = currentTodoElement.querySelector(
        '.todos__todo-description'
      )
      const currentTodoDeleteElement = currentTodoElement.querySelector(
        '.todos__todo-delete'
      )

      if (clicksCount === 1) {
        timerId = setTimeout(() => {
          //
          clearInterval(timerId)
          timerId = null
          clicksCount = 0
          //
        }, 300)
      }

      if (clicksCount === 2) {
        // 2 clicks
        if (
          event.target !== currentTodoCheckboxElement &&
          event.target !== currentTodoDeleteElement
        ) {
          const tempInputElement = document.createElement('input')
          tempInputElement.classList.add('todos__todo-temp-input')

          tempInputElement.value = currentTodoDescriptionElement.innerText

          currentTodoElement.append(tempInputElement)

          tempInputElement.focus()

          tempInputElement.addEventListener('blur', async () => {
            const oldTodo = store.state.todos.find(
              (todo) => todo._id === currentTodoElement.id
            )

            const res = await callApi(`/todos/${currentTodoElement.id}`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${store.state.currentUser.accessToken}`,
              },
              body: JSON.stringify({
                description:
                  tempInputElement.value ||
                  currentTodoDescriptionElement.innerText,
                completed: oldTodo.completed,
                sort: oldTodo.sort,
              }),
            })

            const updatedTodo = res.payload.dto

            store.dispatch({
              type: ACTION_TYPES.CHANGE_TODO_DESCRIPTION,
              payload: updatedTodo,
            })

            tempInputElement.remove()
          })
          tempInputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              tempInputElement.blur()
            }
          })
        }

        //
        clearInterval(timerId)
        timerId = null
        clicksCount = 0
      }
    })

    todoElement.draggable = true

    return todoElement
  }
}
