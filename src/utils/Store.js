/* eslint-disable indent */
import { emiter } from './EventEmmiter'
import { ACTION_TYPES } from '../constants/actionTypes'
import { TODOS_STATES } from '../constants/todosStates'

export class Store {
  constructor() {
    this.state = {
      todos: [],
      todosState: TODOS_STATES.ALL,
    }
  }

  isSimilaryCompleted() {
    let isSimilaryCompleted = true

    this.state.todos.forEach((todo) => {
      if (this.state.todos[0].completed !== todo.completed) {
        isSimilaryCompleted = false
      }
    })

    return isSimilaryCompleted
  }

  isCompletedAll() {
    let isSimilaryCompleted = true

    this.state.todos.forEach((todo) => {
      if (!todo.completed) {
        isSimilaryCompleted = false
      }
    })

    return isSimilaryCompleted
  }

  dispatch(action) {
    this.reducer(action)
  }

  reducer(action) {
    switch (action.type) {
      case ACTION_TYPES.ADD_NEW_TODO:
        this.state = {
          ...this.state,
          todos: [...this.state.todos, action.payload],
        }

        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      case ACTION_TYPES.REMOVE_TODO:
        this.state = {
          ...this.state,
          todos: this.state.todos.filter(
            (todo) => todo._id !== action.payload._id
          ),
        }

        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      case ACTION_TYPES.CHECK_TODO:
        this.state = {
          ...this.state,
          todos: this.state.todos.map((todo) => {
            if (+todo._id === +action.payload._id) {
              todo.completed = !todo.completed
            }

            return todo
          }),
        }

        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      case ACTION_TYPES.CHANGE_TODO_DESCRIPTION:
        this.state = {
          ...this.state,
          todos: this.state.todos.map((todo) => {
            if (todo._id === action.payload._id) {
              todo.description = action.payload.description
            }

            return todo
          }),
        }

        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      case ACTION_TYPES.TOGGLE_CHECK_ALL:
        if (this.isSimilaryCompleted()) {
          this.state = {
            ...this.state,
            todos: this.state.todos.map((todo) => {
              todo.completed = !todo.completed
              return todo
            }),
          }
        } else {
          this.state = {
            ...this.state,
            todos: this.state.todos.map((todo) => {
              todo.completed = true
              return todo
            }),
          }
        }

        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      case ACTION_TYPES.SHOW_ALL_TODOS:
        this.state = { ...this.state, todosState: TODOS_STATES.ALL }
        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      case ACTION_TYPES.SHOW_COMPLETED_TODOS:
        this.state = { ...this.state, todosState: TODOS_STATES.COMPLETED }
        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      case ACTION_TYPES.SHOW_ACTIVE_TODOS:
        this.state = { ...this.state, todosState: TODOS_STATES.ACTIVE }
        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      case ACTION_TYPES.CLEAR_COMPLETED:
        this.state = {
          ...this.state,
          todos: this.state.todos.filter((todo) => !todo.completed)
        }
        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      default:
        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
    }
  }
}

const store = new Store()
export default store
