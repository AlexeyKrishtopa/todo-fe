import { ACTION_TYPES } from '../constants/actionTypes'
import store from './Store'
import { Todo } from '../components/Todo'
import { dragAndDrop } from './dragAndDrop'
import { TODOS_STATES } from '../constants/todosStates'

class EventEmitter {
  constructor() {
    this._events = {}
  }
  subscribe(eventName, handler) {
    if (!this._events[eventName]) {
      this._events[eventName] = []
    }
    this._events[eventName].push(handler)

    return this._unsubscribe.bind(this, eventName, handler)
  }
  _unsubscribe(eventName, handler) {
    this._events[eventName] = this._events[eventName].filter(
      (eventHandler) => eventHandler !== handler
    )
  }
  emit(event) {
    const handlers = this._events[event.eventName]
    if (handlers) {
      handlers.forEach((handler) => handler(...event.args))
    }
  }
}

export const emiter = new EventEmitter()

emiter.subscribe(ACTION_TYPES.RERENDER_TODOS_LIST, () => {
  const todosListElement = document.querySelector('.todos__list')
  const todoCheckAllElement = document.querySelector('.todos__check-all')
  const todosCountElement = document.querySelector('.todos__count')
  const todosFooterElement = document.querySelector('.todos__footer')
  const todosAllElement = document.querySelector('.todos__todo-all')
  const todosCompletedElement = document.querySelector('.todos__todo-completed')
  const todosActiveElement = document.querySelector('.todos__todo-active')

  todosListElement.innerHTML = ''
  todosCountElement.innerText = `${store.state.todos.reduce((acc, todo) => {
    if (!todo.completed) {
      acc += 1
    }

    return acc
  }, 0)} item left`

  store.isCompletedAll()
    ? todoCheckAllElement.classList.add('active')
    : todoCheckAllElement.classList.remove('active')
  console.log(store.state)

  if (store.state.todosState === TODOS_STATES.ALL) {
    store.state.todos
      .sort((a, b) => a.sort - b.sort)
      .forEach((todo) => {
        const todoComponent = new Todo({
          _id: todo._id,
          description: todo.description,
          completed: todo.completed,
        })
        todosListElement.append(todoComponent.render())
      })

    todosAllElement.classList.add('active-option')
    todosCompletedElement.classList.remove('active-option')
    todosActiveElement.classList.remove('active-option')
  } else if (store.state.todosState === TODOS_STATES.ACTIVE) {
    store.state.todos
      .sort((a, b) => a.sort - b.sort)
      .forEach((todo) => {
        if (!todo.completed) {
          const todoComponent = new Todo({
            _id: todo._id,
            description: todo.description,
            completed: todo.completed,
          })
          todosListElement.append(todoComponent.render())
        }
      })

    todosAllElement.classList.remove('active-option')
    todosCompletedElement.classList.remove('active-option')
    todosActiveElement.classList.add('active-option')
  } else if (store.state.todosState === TODOS_STATES.COMPLETED) {
    store.state.todos
      .sort((a, b) => a.sort - b.sort)
      .forEach((todo) => {
        if (todo.completed) {
          const todoComponent = new Todo({
            _id: todo._id,
            description: todo.description,
            completed: todo.completed,
          })
          todosListElement.append(todoComponent.render())
        }
      })

    todosAllElement.classList.remove('active-option')
    todosCompletedElement.classList.add('active-option')
    todosActiveElement.classList.remove('active-option')
  }

  if (!store.state.todos.length) {
    todoCheckAllElement.classList.add('hidden')
    todosFooterElement.classList.add('hidden')
  } else {
    todoCheckAllElement.classList.remove('hidden')
    todosFooterElement.classList.remove('hidden')
  }

  dragAndDrop()
})
