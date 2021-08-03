/* eslint-disable indent */
import { emiter } from './EventEmmiter'
import { ACTION_TYPES } from '../constants/actionTypes'
import { TODOS_STATES } from '../constants/todosStates'
import { storeStateLogger } from './storeStateLogger'
import redirector from './redirector'
import { PAGE_TYPES } from '../constants/pageTypes'

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
    storeStateLogger('Before')
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
            if (todo._id === action.payload._id) {
              todo = action.payload
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
              todo = action.payload
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
          todos: this.state.todos.filter((todo) => !todo.completed),
        }
        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      case ACTION_TYPES.LOAD_OLD_TODOS:
        this.state = {
          ...this.state,
          todosState: TODOS_STATES.ALL,
          todos: action.payload,
        }
        // console.log(this.state)
        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
        break
      case ACTION_TYPES.REDIRECT_TODOS:
        redirector.redirect(PAGE_TYPES.TODOS_PAGE)
        emiter.emit({ eventName: ACTION_TYPES.LOAD_CONTENT, args: [] })
        break
      case ACTION_TYPES.REDIRECT_SIGN_IN:
        redirector.redirect(PAGE_TYPES.SIGNIN_PAGE)
        break
      case ACTION_TYPES.REDIRECT_SIGN_UP:
        redirector.redirect(PAGE_TYPES.REGISTRATION_PAGE)
        break
      case ACTION_TYPES.REFRESH_TOKEN:
        console.log(action.payload)
        localStorage.setItem('currentUser', JSON.stringify(action.payload))
        break
      default:
        emiter.emit({ eventName: ACTION_TYPES.RERENDER_TODOS_LIST, args: [] })
    }

    storeStateLogger('After')
  }
}

const store = new Store()
export default store
